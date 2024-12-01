import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.appMain import db

class Course(db.Model):
    __tablename__='courses'
    course_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    course_name=db.Column(db.String(500),nullable=False,unique=True)
    course_img=db.Column(db.Text,nullable=False)
    course_description=db.Column(db.String(1000),nullable=False)
    course_instructor_id=db.Column(UUID(as_uuid=True),db.ForeignKey('users.user_id'),nullable=False)
    category_id=db.Column(UUID(as_uuid=True),db.ForeignKey('category.category_id'),nullable=False)
    course_price=db.Column(db.Numeric(10,2),nullable=False)
    course_created_at=db.Column(DateTime(timezone=True),default=func.now(),nullable=False)
    
    instructor=db.relationship("User",backref='courses')
    category=db.relationship("Category",backref='courses')

    def __init__(self,course_name,course_img,course_price,instructor,category,course_description=None):
        self.course_name=course_name
        self.course_img=course_img
        self.course_price=course_price
        self.course_description=course_description
        self.instructor=instructor
        self.category=category
        self.course_instructor_id=instructor.user_id
        self.category_id=category.category_id
    def to_dict(self):
        return {
            'course_name': self.course_name,
            'course_img': self.course_img,
            'course_description': self.course_description,
            'course_instructor_name':self.instructor.user_name,
            'course_category_name':self.category.category_name,
            'course_price': str(self.course_price),
            'course_created_at': self.course_created_at.isoformat(),
            'no_of_enrollments':len(self.enrollments),
            'ratings':1
        }
    