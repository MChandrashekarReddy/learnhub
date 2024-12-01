from flask import jsonify,make_response,request
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.appMain.service.question import QuestionService
from app.appMain.dto.question import QuestionDto
from app.appMain.utils.exceptions import CourseNotFound, PermissionDeniedException,InvalidData,InsufficientData

question_blueprint=QuestionDto.question_api

@question_blueprint.route('')
class QuestionOperations(Resource):
    @jwt_required()
    def post(self):
        data=request.get_json()
        try:
            QuestionService.add_question(data)
            return make_response(jsonify({"message":"Successfully added"}),201)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except InvalidData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
    @jwt_required()
    def get(self):
        try:
           questions=QuestionService.get_questions()
           return make_response(jsonify(questions),200)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@question_blueprint.route('/<string:courseName>/discussions')
class Discussions(Resource):
    @jwt_required()
    def get(self, courseName):
        try:
            discussions = QuestionService.getDiscussions(courseName)
            return make_response(jsonify(discussions), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message": "An unexpected error occurred."}), 500)
