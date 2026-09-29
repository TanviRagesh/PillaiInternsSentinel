from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from typing import List, Optional
from ..database import get_session
from ..models import Article

router = APIRouter()

@router.get("/", response_model=List[Article])
def get_articles(
    skip: int = 0, 
    limit: int = 50,
    target_met: Optional[bool] = None,
    method: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Article).order_by(Article.detected_at.desc())
    
    if target_met is not None:
        query = query.where(Article.target_met == target_met)
    if method:
        query = query.where(Article.source_method == method)
        
    articles = session.exec(query.offset(skip).limit(limit)).all()
    return articles
