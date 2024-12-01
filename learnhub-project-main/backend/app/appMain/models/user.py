import uuid
from sqlalchemy.dialects.postgresql import UUID
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.appMain import db

class User(db.Model):
    __tablename__="users"
    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_img = db.Column(db.Text, nullable=True) 
    user_name = db.Column(db.String(400), nullable=False)
    user_email = db.Column(db.String(400), nullable=False, unique=True)
    user_phone_number = db.Column(db.String(15), nullable=False, unique=True)  
    _user_password = db.Column("user_password", db.String(300), nullable=False)  
    user_address = db.Column(db.String(600), nullable=False)
    user_role = db.Column(UUID(as_uuid=True), db.ForeignKey('roles.role_id'), nullable=False)
    user_created_at = db.Column(DateTime(timezone=True),nullable=False ,default=func.now())  
    user_updated_at = db.Column(DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now())

    role = db.relationship('Role', backref='users')

    def __init__(self, user_name, user_email, user_phone_number, user_password, user_address, role):
        self.user_name = user_name
        self.user_email = user_email
        self.user_phone_number = user_phone_number
        self._user_password = generate_password_hash(user_password)
        self.user_address = user_address
        self.user_role = role.role_id
        self.role=role

    @property
    def user_password(self):
        raise AttributeError("Password is not a readable attribute")

    @user_password.setter
    def user_password(self, password):
        self._user_password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self._user_password, password)
    
    def to_dict(self):
        if self.role.role_name=='student':
            return {
                'user_name': self.user_name,
                'user_email': self.user_email,
                'user_phone_number': self.user_phone_number,
                'user_address': self.user_address,
                'user_role': self.role.role_name, 
                'user_created_at': self.user_created_at.isoformat(),
                'user_updated_at': self.user_updated_at.isoformat(),
                'no_of_enrollments':len(self.enrollments)
            }
        elif self.role.role_name=='instructor':
            return{
                'user_name': self.user_name,
                'user_email': self.user_email,
                'user_phone_number': self.user_phone_number,
                'user_address': self.user_address,
                'user_role': self.role.role_name, 
                'user_created_at': self.user_created_at.isoformat(),
                'user_updated_at': self.user_updated_at.isoformat(),
                'no_of_courses':len(self.courses)
            }
        return{
                'user_img':self.user_img,
                'user_name': self.user_name,
                'user_email': self.user_email,
                'user_phone_number': self.user_phone_number,
                'user_address': self.user_address,
                'user_role': self.role.role_name,
                'user_created_at': self.user_created_at.isoformat(),
                'user_updated_at': self.user_updated_at.isoformat()
            }
