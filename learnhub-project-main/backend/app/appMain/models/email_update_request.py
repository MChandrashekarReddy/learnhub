import uuid
from datetime import timedelta
from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.appMain import db

class EmailUpdateRequest(db.Model):
    __tablename__ = 'email_update_request'
    request_id=db.Column(UUID(as_uuid=True),primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(400), nullable=False, unique=True)
    requested_at = db.Column(DateTime(timezone=True), default=func.now(),nullable=False)
    expire_at = db.Column(DateTime(timezone=True),nullable=False)
    updated_at = db.Column(DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now())