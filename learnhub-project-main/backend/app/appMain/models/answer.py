import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.appMain import db

class Answer(db.Model):
    __tablename__='answers'
    answer_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    question_id=db.Column(UUID(as_uuid=True),db.ForeignKey("questions.question_id"),nullable=False)
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey("users.user_id"),nullable=False)
    user=db.relationship('User',backref=db.backref('questions',lazy=True))
    answer_content=db.Column(db.String(1000),nullable=False)
    answer_at=db.Column(db.DateTime(timezone=True),default=func.now())

    question=db.relationship('Question',backref=db.backref('answers',lazy=True))
    user=db.relationship('User',backref=db.backref('answers',lazy=True))
