from flask_restx import Namespace

class NotificationDto:
    notification_api=Namespace('notifications',description="API's for notifications")