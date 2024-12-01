from flask import jsonify,make_response,request
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.appMain.utils.exceptions import InsufficientData,InvalidData
from app.appMain.service.answer import AnswerService
from app.appMain.dto.answers import AnswerDto

answer_blueprint=AnswerDto.answer_api

@answer_blueprint.route('')
class AnswersOperations(Resource):
    @jwt_required()
    def post(self):
        data=request.get_json()
        try:
            AnswerService.add_answer(data)
            return "Successfull your answer added",201
        except InsufficientData as e:
           return make_response(jsonify({"message": str(e)}), 422)
        except InvalidData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)