import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.appMain import db

class Progress(db.Model):
    __tablename__="progress"
    progress_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey("users.user_id"),nullable=False)
    course_id=db.Column(UUID(as_uuid=True),db.ForeignKey("courses.course_id"),nullable=False)
    content_id=db.Column(UUID(as_uuid=True),db.ForeignKey("contents.content_id"),nullable=False)
    progress_percentage=db.Column(db.Numeric(5,2),nullable=False)
    progress_update_at=db.Column(db.DateTime(timezone=True),default=func.now(),onupdate=func.now())

    user=db.relationship('User',backref=db.backref('progress',lazy=True))
    course=db.relationship('Course',backref=db.backref('progress',lazy=True))
    content=db.relationship('Content',backref=db.backref('progress',lazy=True))
