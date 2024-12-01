from flask_restx import Namespace

class EnrollmentDto:
    enrollment_api=Namespace('enrollements',description="API's for enrollements")