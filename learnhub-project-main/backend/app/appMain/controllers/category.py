from app.appMain.dto.category import CategoryDto
from flask import jsonify,make_response,request
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.appMain.service.category import CategoryService
from app.appMain.utils.exceptions import InsufficientData,PermissionDeniedException

category_blueprint=CategoryDto.category_api

@category_blueprint.route('')
class CategoryOperations(Resource):
    @jwt_required()
    def post(self):
        data=request.get_json()
        try:
            CategoryService.create_category(data)
            return make_response(jsonify({"message":"Added sccessfully"}),201)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
    def get(self):
        try:
             categories=CategoryService.get_all_categories()
             return make_response(jsonify([category.to_dict() for category in categories]),200)
        except Exception as e:
            return {"message":str(e)},500
        
@category_blueprint.route('/total')
class CategoryDetails(Resource):
    @jwt_required()
    def get(self):
        try:
            response=CategoryService.get_totalCategories()
            return make_response(jsonify(response),200)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        
@category_blueprint.route('/all')
class CategoryDetails(Resource):
    @jwt_required()
    def get(self):
        try:
            response=CategoryService.get_all_Categories_detail()
            return make_response(jsonify(response),200)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
   