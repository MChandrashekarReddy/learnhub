from flask import jsonify,make_response,request
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.appMain.service.course import CourseService
from app.appMain.utils.exceptions import PermissionDeniedException,InsufficientData,CourseNotFound,CategoryNotFound
from app.appMain.dto.course import CourseDto

course_blueprint=CourseDto.course_api

@course_blueprint.route('')
class CourseOperations(Resource):
    @jwt_required()
    def post(self):
        data=request.get_json()
        try:
            CourseService.add_course(data)
            return make_response(jsonify({"message":"addedd successfully"}),201)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)}),403)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except CategoryNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
    
    def get(self):
        courses=CourseService.get_all_courses()
        return make_response(jsonify(courses),200)
    
    @jwt_required()
    def put(self):
        data=request.get_json()
        try:
            CourseService.update_course(data)
            return make_response(jsonify({"message":"successfully updated"}),200)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)}),403)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except CourseNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        

@course_blueprint.route('/available')
class Courses(Resource):
    @jwt_required()
    def get(self):
        try:
            available_courses=CourseService.get_all_courses_to_register()
            return make_response(jsonify(available_courses),200)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        
@course_blueprint.route('/registered')
class Courses(Resource):
    @jwt_required()
    def get(self):
        try:
            registered_course=CourseService.get_all_registered_courses()
            return make_response(jsonify(registered_course),200)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@course_blueprint.route('/<string:course_name>')
class courseByName(Resource):
    @jwt_required()
    def get(self,course_name):
        try:
            course=CourseService.get_course_by_name(course_name)
            return course,200
        except CourseNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@course_blueprint.route('/total')
class TotalCourses(Resource):
    @jwt_required()
    def get(self):
        try:
           total=CourseService.get_total_courses()
           return total,200
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)}),403)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        
@course_blueprint.route('/content')
class CourseContent(Resource):
    @jwt_required()
    def get(self):
        course_name = request.args.get('course_name')
        try:
            content=CourseService.get_course_content(course_name)
            return make_response(jsonify(content),200)
        except CourseNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        
@course_blueprint.route('/<string:courseName>/overview')
class CourseOverview(Resource):
    def get(self, courseName):
        try:
            overview = CourseService.getCourseOverview(courseName)
            return make_response(jsonify(overview), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)


