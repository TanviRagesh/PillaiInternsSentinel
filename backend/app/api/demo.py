from fastapi import APIRouter
import uuid
import time
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ArticleSim(BaseModel):
    title: str
    author: str
    published_date: str
    content: str
    image_url: Optional[str] = None

@router.post("/publish")
def publish_demo_article(article: ArticleSim):
    # This is a simulation endpoint for Demo Lab
    return {
        "status": "published",
        "id": str(uuid.uuid4()),
        "published_at": time.time(),
        "article": article.dict()
    }
