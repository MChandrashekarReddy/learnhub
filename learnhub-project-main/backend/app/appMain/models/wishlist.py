import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.appMain import db

class Wishlist(db.Model):
    __tablename__='wishlist'
    wishlist_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey("users.user_id"),nullable=False)
    course_id=db.Column(UUID(as_uuid=True),db.ForeignKey('courses.course_id'),nullable=False)
    added_at=db.Column(db.DateTime(timezone=True),default=func.now())

    user=db.relationship('User',backref=db.backref('wishlists',lazy=True))
    course=db.relationship('Course',backref='wishlists')