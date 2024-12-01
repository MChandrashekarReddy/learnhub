import uuid
from sqlalchemy import DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.appMain import db

class Notifications(db.Model):
    __tablename__='notifications'
    notification_id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey("users.user_id"),nullable=False)
    notification_title=db.Column(db.String(500),nullable=False)
    notification_message=db.Column(db.Text,nullable=False)
    notification_read_status=db.Column(db.Boolean,default=False)
    is_deleted=db.Column(db.Boolean,default=False)
    created_at=db.Column(DateTime(timezone=True),default=func.now())
    updated_at = db.Column(DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now())

    user = db.relationship('User', backref='notifications')

    def to_dict(self):
        return {
            "notification_id": str(self.notification_id),
            "notification_title": self.notification_title,
            "notification_message": self.notification_message,
            "notification_read_status": self.notification_read_status,
            "created_at": self.created_at.isoformat()
        }