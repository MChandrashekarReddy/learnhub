from flask_restx import Resource
from flask import request,jsonify,make_response
from app.appMain.dto.role import RoleDto
from app.appMain.service.role import RoleService
from app.appMain.utils.exceptions import InsufficientData

role_blueprint=RoleDto.role_api
@role_blueprint.route('')
class RoleOpertions(Resource):
    def post(self):
        data=request.get_json()
        try:
            RoleService.create_role(data)
            return make_response(jsonify({"message":"Role created successfully..!!"}),201)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        