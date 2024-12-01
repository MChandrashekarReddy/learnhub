import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.appMain import db

class Enrollment(db.Model):
    __tablename__='enrollments'
    enrollment_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey('users.user_id'),nullable=False)
    course_id=db.Column(UUID(as_uuid=True),db.ForeignKey('courses.course_id'),nullable=False)
    payment_id=db.Column(UUID(as_uuid=True),db.ForeignKey('payments.payment_id'),nullable=False,unique=True)
    enroll_date=db.Column(db.Date,default=func.current_date())
    
    user = db.relationship('User', backref='enrollments')
    course = db.relationship('Course', backref='enrollments')
    payment = db.relationship('Payment', backref='enrollments')

    def to_dict(self):
        return {
            "user_name":self.user.user_name,
            "user_email":self.user.user_email,
            "course_name":self.course.course_name,
            "course_category":self.course.category.category_name,
            "enrolle_date":self.enroll_date.isoformat(),
            "amount":str(self.payment.price),
            'payment_id': str(self.payment_id),
            "payment_mode":self.payment.payment_mode,
            "payment_at":self.payment.payment_at.isoformat()
        }
    