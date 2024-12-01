from flask_restx import Namespace

class UserDto:
    user_api=Namespace('users',description="API's for users")