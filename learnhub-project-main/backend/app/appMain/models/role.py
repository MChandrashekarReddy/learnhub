import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.appMain import db

class Role(db.Model):
    __tablename__='roles'
    role_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    role_name=db.Column(db.String(200),nullable=False,unique=True)

    def __init__(self,role_name):
        self.role_name=role_name