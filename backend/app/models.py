from typing import Optional, List, Dict, Any
from sqlmodel import Field, SQLModel, Relationship, JSON, Column
from datetime import datetime, timezone
import uuid

def utcnow():
    return datetime.now(timezone.utc)

class Competitor(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(index=True)
    website_url: str = Field(index=True)
    blog_url: Optional[str] = None
    created_at: datetime = Field(default_factory=utcnow)
    is_demo: bool = Field(default=False)
    
    sources: List["MonitoringSource"] = Relationship(back_populates="competitor")
    articles: List["Article"] = Relationship(back_populates="competitor")

class MonitoringSource(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    competitor_id: str = Field(foreign_key="competitor.id")
    source_type: str = Field(index=True) # RSS, SITEMAP, DIRECT, ATOM, SITEMAP_INDEX
    url: str
    is_active: bool = Field(default=True)
    polling_interval_minutes: int = Field(default=5)
    status: str = Field(default="HEALTHY") # HEALTHY, DEGRADED, OFFLINE, PAUSED
    last_checked_at: Optional[datetime] = None
    next_check_at: Optional[datetime] = None
    last_success_at: Optional[datetime] = None
    consecutive_failures: int = Field(default=0)
    average_response_time_ms: Optional[int] = None
    retry_count: int = Field(default=0)
    timeout_seconds: int = Field(default=10)
    
    competitor: Competitor = Relationship(back_populates="sources")
    checks: List["MonitoringCheck"] = Relationship(back_populates="source")

class MonitoringCheck(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    source_id: str = Field(foreign_key="monitoringsource.id")
    started_at: datetime = Field(default_factory=utcnow)
    completed_at: Optional[datetime] = None
    status: str = Field(index=True) # RUNNING, SUCCESS, FAILED
    response_time_ms: Optional[int] = None
    error_message: Optional[str] = None
    articles_found: int = Field(default=0)
    
    source: MonitoringSource = Relationship(back_populates="checks")

class Article(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    competitor_id: str = Field(foreign_key="competitor.id")
    title: str
    url: str
    canonical_url: Optional[str] = None
    fingerprint: str = Field(index=True, unique=True)
    published_at: Optional[datetime] = None
    first_discovered_at: datetime = Field(default_factory=utcnow)
    detected_at: datetime = Field(default_factory=utcnow)
    detection_latency_seconds: Optional[int] = None
    target_met: Optional[bool] = None
    source_method: str # RSS, SITEMAP, DIRECT
    author: Optional[str] = None
    content_summary: Optional[str] = None
    image_url: Optional[str] = None
    is_demo: bool = Field(default=False)
    
    competitor: Competitor = Relationship(back_populates="articles")
    enrichment: Optional["AIEnrichment"] = Relationship(back_populates="article")

class AIEnrichment(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    article_id: str = Field(foreign_key="article.id", unique=True)
    summary: str
    topics: str # Comma separated for now
    keywords: str
    category: str
    created_at: datetime = Field(default_factory=utcnow)
    
    article: Article = Relationship(back_populates="enrichment")

class SystemEvent(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    event_type: str = Field(index=True) # MONITOR_START, NEW_ARTICLE, SOURCE_FAILED, TARGET_EXCEEDED, SYSTEM_WARNING
    severity: str = Field(default="INFO") # INFO, WARNING, ERROR, CRITICAL
    description: str
    timestamp: datetime = Field(default_factory=utcnow)
    metadata_json: Optional[str] = None
    is_read: bool = Field(default=False)

class WorkerRun(SQLModel, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    worker_id: str
    job_type: str
    target_id: Optional[str] = None
    started_at: datetime = Field(default_factory=utcnow)
    completed_at: Optional[datetime] = None
    status: str # RUNNING, SUCCESS, FAILED
    error_message: Optional[str] = None
