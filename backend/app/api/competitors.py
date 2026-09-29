from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Competitor

router = APIRouter()

@router.get("/", response_model=List[Competitor])
def get_competitors(session: Session = Depends(get_session)):
    competitors = session.exec(select(Competitor)).all()
    return competitors

@router.post("/", response_model=Competitor)
def create_competitor(competitor: Competitor, session: Session = Depends(get_session)):
    session.add(competitor)
    session.commit()
    session.refresh(competitor)
    return competitor

@router.get("/{competitor_id}", response_model=Competitor)
def get_competitor(competitor_id: str, session: Session = Depends(get_session)):
    competitor = session.get(Competitor, competitor_id)
    if not competitor:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return competitor

@router.delete("/{competitor_id}")
def delete_competitor(competitor_id: str, session: Session = Depends(get_session)):
    competitor = session.get(Competitor, competitor_id)
    if not competitor:
        raise HTTPException(status_code=404, detail="Competitor not found")
    session.delete(competitor)
    session.commit()
    return {"ok": True}
