from flask import jsonify,make_response,request
from flask_jwt_extended import jwt_required
from flask_restx import Resource
from app.appMain.utils.exceptions import CourseNotFound, InsufficientData, PermissionDeniedException
from app.appMain.service.progress import ProgressService
from app.appMain.dto.progress import ProgressDto

progress_blueprint=ProgressDto.progress_api

@progress_blueprint.route('')
class ProgressOperations(Resource):
    @jwt_required()
    def post(self):
        data=request.get_json()
        try:
            ProgressService.updateProgress(data)
            return "successfully updated",201
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)}),403)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except CourseNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
      
@progress_blueprint.route('/<string:course_name>')
class CourseProgress(Resource):
    @jwt_required()
    def get(self,course_name):
        try:
            completed_percentage=ProgressService.getCourseProgress(course_name)
            return completed_percentage,200
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)}),403)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except CourseNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
    
@progress_blueprint.route("/<string:course_name>/<string:content_id>", methods=['DELETE'])
class ProgressDeleteOperations(Resource):
    @jwt_required()
    def delete(self,course_name,content_id):
        try:
            ProgressService.deleteProgress(course_name,content_id)
            return "successfully updated",200
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)}),403)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except CourseNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)