from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/health")
def get_system_health() -> Dict[str, Any]:
    # Mock health endpoint
    return {
        "status": "OPERATIONAL",
        "components": {
            "database": "HEALTHY",
            "redis": "HEALTHY",
            "scheduler": "HEALTHY",
            "workers": "HEALTHY",
            "rss_monitor": "HEALTHY",
            "sitemap_monitor": "HEALTHY"
        },
        "metrics": {
            "active_competitors": 94,
            "articles_today": 127,
            "avg_latency": "02:41",
            "fastest": "00:19"
        }
    }
