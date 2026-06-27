import json
import os
from datetime import datetime, timedelta
from typing import Dict, List

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
ANALYTICS_FILE = os.path.join(DATA_DIR, "analytics.json")

class AnalyticsService:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(ANALYTICS_FILE):
            with open(ANALYTICS_FILE, "w", encoding="utf-8") as f:
                json.dump({"queries": []}, f)

    def log_query(self):
        """Log a new query timestamp."""
        try:
            with open(ANALYTICS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            data["queries"].append(datetime.utcnow().isoformat())
            
            with open(ANALYTICS_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f)
        except Exception as e:
            print(f"Error logging analytics: {e}")

    def get_last_7_days(self) -> List[Dict[str, int]]:
        """Return aggregated query counts for the last 7 days."""
        try:
            with open(ANALYTICS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            data = {"queries": []}

        # Initialize the last 7 days with 0 counts
        today = datetime.utcnow().date()
        days_map = {}
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            # Format: 'Mon', 'Tue', etc.
            day_name = d.strftime("%a")
            days_map[d] = {"name": day_name, "requests": 0}

        # Count queries
        for q_time_str in data.get("queries", []):
            try:
                q_date = datetime.fromisoformat(q_time_str).date()
                if q_date in days_map:
                    days_map[q_date]["requests"] += 1
            except Exception:
                pass

        return list(days_map.values())

analytics_service = AnalyticsService()
