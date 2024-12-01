import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.appMain import db

class Category(db.Model):
    __tablename__='category'
    category_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    category_name=db.Column(db.String(300),nullable=False,unique=True)
    category_created_at = db.Column(DateTime(timezone=True), default=func.now())  
    def __init__(self,category_name):
        self.category_name=category_name
    
    def to_dict(self):
        return{
            'category_name':self.category_name,
            'no_of_courses':len(self.courses)
        }