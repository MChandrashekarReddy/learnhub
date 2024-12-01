from flask_restx import Namespace

class RoleDto:
    role_api=Namespace('roles',description="API's for roles")