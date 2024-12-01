import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.appMain import db

class Content(db.Model):
    __tablename__="contents"
    content_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    course_id=db.Column(UUID(as_uuid=True),db.ForeignKey('courses.course_id'),nullable=False)
    content_name=db.Column(db.String(1000),nullable=False)
    content_doc_path=db.Column(db.String(500),nullable=False)
    content_video_path=db.Column(db.String(500),nullable=False)
    content_video_duration = db.Column(db.String(5), nullable=False)
    content_quiz_path=db.Column(db.String(500))
    content_assignment_path=db.Column(db.String(500))
    content_created_at=db.Column(DateTime(timezone=True),default=func.now())
    
    course=db.relationship('Course',backref='contents')


    def to_dict(self):
        return {
            'content_name': self.content_name,
            'content_doc_path': self.content_doc_path,
            'content_video_path': self.content_video_path,
            'content_quiz_path': self.content_quiz_path,
            'content_assignment_path': self.content_assignment_path
        }