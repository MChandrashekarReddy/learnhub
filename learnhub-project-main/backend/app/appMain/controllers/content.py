from flask_restx import Resource
from flask import make_response,jsonify,request
from flask_jwt_extended import jwt_required
from app.appMain.dto.content import ContentDto
from app.appMain.service.contents import ContentService
from app.appMain.utils.exceptions import NoContentFoundException,CourseNotFound,InsufficientData,PermissionDeniedException

content_blueprint=ContentDto.content_api

@content_blueprint.route('')
class ContentOperations(Resource):
    @jwt_required()
    def post(self):
        data=request.get_json()
        try:
            ContentService.add_content(data)
            return make_response(jsonify({"message":"added successfully..!!"}),201)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        
@content_blueprint.route('/<string:courseName>/videos')
class CourseVideos(Resource):
    @jwt_required()
    def get(self, courseName):
        try:
            videos = ContentService.getVideos(courseName)
            return make_response(jsonify(videos), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": "An unexpected error occurred."}), 500)
        
@content_blueprint.route('/video')
class CourseVideo(Resource):
    @jwt_required()
    def get(self):
        try:
            data=request.get_json()
            video = ContentService.getVideo(data)
            return make_response(jsonify(video), 201)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": "An unexpected error occurred."}), 500)

@content_blueprint.route('/<string:courseName>/assignments')
class CourseAssignments(Resource):
    @jwt_required()
    def get(self, courseName):
        try:
            assignments = ContentService.getAssignments(courseName)
            return make_response(jsonify(assignments), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": "An unexpected error occurred."}), 500)

@content_blueprint.route('/<string:courseName>/materials')
class CourseNotes(Resource):
    @jwt_required()
    def get(self, courseName):
        try:
            notes_data = ContentService.getNotes(courseName)
            return make_response(jsonify(notes_data), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": "An unexpected error occurred."}), 500)
        
@content_blueprint.route('/<string:courseName>/content')
class CourseContents(Resource):
    @jwt_required()
    def get(self, courseName):
        try:
            notes_data = ContentService.getContent(courseName)
            return make_response(jsonify(notes_data), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": "An unexpected error occurred."}), 500)
        
@content_blueprint.route('/<string:course_name>')
class CourseContentsOverview(Resource):
    def get(self, course_name):
        try:
            notes_data = ContentService.getContentOverview(course_name)
            return make_response(jsonify(notes_data), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except NoContentFoundException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": "An unexpected error occurred."}), 500)
        
