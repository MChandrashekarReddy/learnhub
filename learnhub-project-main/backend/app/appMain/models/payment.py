import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.appMain import db

class Payment(db.Model):
    __tablename__='payments'
    payment_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    price=db.Column(db.Numeric(10,2),nullable=False)
    payment_mode=db.Column(db.String(100),nullable=False)
    payment_at=db.Column(db.DateTime(timezone=True),default=func.now(),nullable=False)

    def to_dict(self):
        return {
            'payment_id': self.payment_id,
            'price': self.price,
            'payment_mode': self.payment_mode,
            'payment_at': self.payment_at,
            'user_name': self.enrollments[0].user.user_name,  
            'course_name': self.enrollments[0].course.course_name 
        }

    
