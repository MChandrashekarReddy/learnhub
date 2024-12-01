import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.appMain import db

class Review(db.Model):
    __tablename__="reviews"
    review_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey("users.user_id"),nullable=False)
    course_id=db.Column(UUID(as_uuid=True),db.ForeignKey("courses.course_id"),nullable=False)
    review_content=db.Column(db.String(1000),nullable=False)
    review_rating= db.Column(db.Integer)
    review_at=db.Column(db.DateTime(timezone=True),default=func.now())

    users=db.relationship('User',backref=db.backref('reviews',lazy=True))
    courses=db.relationship('Course',backref=db.backref('reviews',lazy=True))
    