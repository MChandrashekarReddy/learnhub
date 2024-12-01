from  flask import jsonify,make_response,request
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.appMain.dto.enrollments import EnrollmentDto
from app.appMain.service.enrollment import EnrollmentSevice
from app.appMain.utils.exceptions import CourseAlreadyExistsException,CourseNotFound,InsufficientData,PermissionDeniedException

enrollment_blueprint=EnrollmentDto.enrollment_api

@enrollment_blueprint.route('')
class EnrollmentOperations(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        try:
            response = EnrollmentSevice.register_course(data)
            return make_response(jsonify(response), 201)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except CourseAlreadyExistsException as e:
            return make_response(jsonify({"message": str(e)}), 409)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)

@enrollment_blueprint.route('/total')
class EnrollmentOperations(Resource):
    @jwt_required()
    def get(self):
        try:
            enrollments=EnrollmentSevice.getTotalEnrollments()
            return enrollments,200
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        