from flask_restx import Namespace

class EmailDto:
    email_api=Namespace('email',description="API's for emails")