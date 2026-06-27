import httpx
import asyncio
import html2text
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urlunparse
from typing import Callable, Optional
from dataclasses import dataclass, field

from app.config import MAX_CRAWL_DEPTH, MAX_PAGES, CRAWL_CONCURRENCY, CRAWL_TIMEOUT


@dataclass
class CrawledPage:
    url: str
    title: str
    content: str  # Cleaned markdown
    links: list[str] = field(default_factory=list)


class WebCrawler:
    """Async recursive web crawler using httpx + BeautifulSoup + html2text.
    
    Lightweight alternative to Crawl4AI/Playwright — no browser binaries needed,
    making it deployment-friendly for Render/Railway.
    """

    # File extensions to skip
    SKIP_EXTENSIONS = frozenset((
        ".pdf", ".zip", ".tar", ".gz", ".rar", ".7z",
        ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".ico",
        ".css", ".js", ".woff", ".woff2", ".ttf", ".eot",
        ".mp4", ".mp3", ".avi", ".mov", ".wmv",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ))

    def __init__(
        self,
        max_depth: Optional[int] = None,
        max_pages: Optional[int] = None,
        concurrency: Optional[int] = None,
        timeout: Optional[int] = None,
    ):
        self.max_depth = max_depth or MAX_CRAWL_DEPTH
        self.max_pages = max_pages or MAX_PAGES
        self.concurrency = concurrency or CRAWL_CONCURRENCY
        self.timeout = timeout or CRAWL_TIMEOUT

    @staticmethod
    def _normalize_url(url: str) -> str:
        """Normalize URL by removing fragment, trailing slash, lowercasing netloc."""
        parsed = urlparse(url)
        path = parsed.path.rstrip("/") or "/"
        return urlunparse((
            parsed.scheme,
            parsed.netloc.lower(),
            path,
            parsed.params,
            parsed.query,
            "",  # Remove fragment
        ))

    @staticmethod
    def _is_same_domain(url: str, base_domain: str) -> bool:
        return urlparse(url).netloc.lower() == base_domain

    def _should_skip_url(self, url: str) -> bool:
        """Check if URL should be skipped based on extension or pattern."""
        parsed = urlparse(url)
        path_lower = parsed.path.lower()

        # Skip non-content file extensions
        if any(path_lower.endswith(ext) for ext in self.SKIP_EXTENSIONS):
            return True

        # Skip common non-content paths
        skip_paths = ("/login", "/signup", "/register", "/logout", "/admin", "/wp-admin")
        if any(path_lower.startswith(p) for p in skip_paths):
            return True

        return False

    def _extract_links(self, soup: BeautifulSoup, base_url: str, base_domain: str) -> list[str]:
        """Extract same-domain links from parsed HTML."""
        links = set()
        for a_tag in soup.find_all("a", href=True):
            href = a_tag.get("href")
            if not isinstance(href, str) or href.startswith(("#", "mailto:", "tel:", "javascript:")):
                continue

            full_url = urljoin(base_url, href)
            normalized = self._normalize_url(full_url)

            if (
                urlparse(normalized).scheme in ("http", "https")
                and self._is_same_domain(normalized, base_domain)
                and not self._should_skip_url(normalized)
            ):
                links.add(normalized)

        return list(links)

    def _extract_content(self, html: str, url: str) -> tuple[str, str, list[str]]:
        """Parse HTML → extract title, clean markdown content, and links."""
        soup = BeautifulSoup(html, "html.parser")

        # Extract title
        title = ""
        if soup.title and soup.title.string:
            title = soup.title.string.strip()

        # Extract links from the full page BEFORE modifying/decomposing the soup
        base_domain = urlparse(url).netloc.lower()
        links = self._extract_links(soup, url, base_domain)

        # Remove non-content elements
        for tag in soup.find_all([
            "nav", "header", "footer", "script", "style", "aside",
            "noscript", "iframe", "form", "svg", "button",
        ]):
            tag.decompose()

        # Remove common boilerplate by class/id patterns
        for selector in [
            '[class*="cookie"]', '[class*="banner"]', '[class*="popup"]',
            '[class*="sidebar"]', '[class*="menu"]', '[class*="nav"]',
            '[id*="cookie"]', '[id*="banner"]', '[id*="popup"]',
            '[id*="sidebar"]', '[id*="menu"]',
        ]:
            for el in soup.select(selector):
                el.decompose()

        # Prefer main content area
        main = soup.find("main") or soup.find("article") or soup.find(role="main")
        if main:
            content_html = str(main)
        else:
            body = soup.find("body")
            content_html = str(body) if body else str(soup)

        # Convert to markdown
        h2t = html2text.HTML2Text()
        h2t.ignore_links = False
        h2t.ignore_images = True
        h2t.ignore_emphasis = False
        h2t.body_width = 0  # Don't wrap lines
        h2t.skip_internal_links = True
        
        markdown = h2t.handle(content_html).strip()

        return title, markdown, links

    # Priority path segments — lower index = higher priority
    PRIORITY_PATHS = (
        "/", "/about", "/docs", "/documentation", "/product", "/products",
        "/service", "/services", "/faq", "/pricing", "/blog",
    )

    def _page_priority(self, url: str) -> int:
        """Return a sort key: lower = higher priority."""
        path = urlparse(url).path.rstrip("/").lower() or "/"
        for i, prefix in enumerate(self.PRIORITY_PATHS):
            if path == prefix or path.startswith(prefix + "/"):
                return i
        return len(self.PRIORITY_PATHS)

    async def crawl(
        self,
        seed_url: str,
        on_progress: Optional[Callable] = None,
        on_page_ready: Optional[Callable] = None,
    ) -> list[CrawledPage]:
        """Recursively crawl starting from seed_url. Returns list of CrawledPage."""
        seed_url = self._normalize_url(seed_url)
        base_domain = urlparse(seed_url).netloc.lower()

        import heapq
        visited: set[str] = set()
        seen_hashes: set[str] = set()
        pages: list[CrawledPage] = []
        # Priority Queue: stores tuples of (priority, depth, url)
        queue: list[tuple[int, int, str]] = [(self._page_priority(seed_url), 0, seed_url)]
        semaphore = asyncio.Semaphore(self.concurrency)

        async with httpx.AsyncClient(
            timeout=self.timeout,
            follow_redirects=True,
            limits=httpx.Limits(max_connections=50, max_keepalive_connections=50),
            headers={"User-Agent": "RAGBot/1.0 (Educational Project)"},
        ) as client:

            while queue and len(pages) < self.max_pages:
                # Build a batch of URLs to fetch concurrently
                batch: list[tuple[str, int]] = []
                while queue and len(batch) < self.concurrency:
                    priority, depth, url = heapq.heappop(queue)
                    if url not in visited and depth <= self.max_depth:
                        visited.add(url)
                        batch.append((url, depth))

                if not batch:
                    break

                # Fetch all pages in batch concurrently
                tasks = [
                    self._fetch_page(client, semaphore, url, depth, base_domain)
                    for url, depth in batch
                ]
                results = await asyncio.gather(*tasks, return_exceptions=True)

                for result in results:
                    if isinstance(result, BaseException) or result is None:
                        continue

                    page, depth, new_links = result
                    
                    import hashlib
                    content_hash = hashlib.md5(page.content.encode('utf-8')).hexdigest()
                    if content_hash in seen_hashes:
                        continue
                    seen_hashes.add(content_hash)
                    
                    # Index this page immediately — don't wait for the full crawl
                    if on_page_ready:
                        await on_page_ready(page)
                        
                    pages.append(page)

                    # Enqueue discovered links (only if within depth limit)
                    if depth < self.max_depth:
                        for link in new_links:
                            if link not in visited:
                                heapq.heappush(queue, (self._page_priority(link), depth + 1, link))

                    # Report progress
                    if on_progress:
                        await on_progress(
                            pages_crawled=len(pages),
                            pages_total=min(len(pages) + len(queue), self.max_pages),
                            page_info={
                                "url": page.url,
                                "title": page.title,
                                "status": "success",
                            },
                        )

                    if len(pages) >= self.max_pages:
                        break

        return pages

    async def _fetch_page(
        self,
        client: httpx.AsyncClient,
        semaphore: asyncio.Semaphore,
        url: str,
        depth: int,
        base_domain: str,
    ) -> tuple[CrawledPage, int, list[str]] | None:
        """Fetch and parse a single page. Returns (page, depth, links) or None."""
        async with semaphore:
            try:
                response = await client.get(url)

                # Only process HTML responses
                content_type = response.headers.get("content-type", "")
                if "text/html" not in content_type:
                    return None

                response.raise_for_status()
                html = response.text

                # Offload CPU-bound HTML parsing and Markdown conversion to thread pool
                title, markdown, links = await asyncio.to_thread(
                    self._extract_content, html, url
                )

                # Skip pages with very little meaningful content
                if len(markdown.strip()) < 50:
                    return None

                page = CrawledPage(
                    url=url,
                    title=title or url,
                    content=markdown,
                    links=links,
                )

                return page, depth, links

            except Exception:
                return None
