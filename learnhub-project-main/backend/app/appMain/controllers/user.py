from flask import request,jsonify,make_response
from flask_jwt_extended import jwt_required,get_jwt
from app.appMain.service.user import UserService
from app.appMain.dto.user import UserDto
from app.appMain.utils.exceptions import UserAlreadyExists,InsufficientData,UnsupportedRole,UserNotFound,NoUsersFoundException,PermissionDeniedException,NoEnrollmentsFoundException,InvalidData
from flask_restx import Resource

user_blueprint=UserDto.user_api

@user_blueprint.route('')
class UserOperations(Resource):
    def post(self):
        data = request.get_json()
        try:
            UserService.create_user(data)
            return {"message": "User added successfully"}, 201
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except InvalidData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except UserAlreadyExists as e:
            return make_response(jsonify({"message": str(e)}), 409)
        except UnsupportedRole as e:
            return make_response(jsonify({"message": str(e)}), 400)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
    @jwt_required()
    def put(self):
        try:
            data = request.get_json()
            UserService.update_current_user(data)
            return make_response(jsonify({"message": "Successfully Updated"}), 200)
        except InsufficientData:
            return make_response(jsonify({"message":str(e)}),422)
        except UserNotFound:
            return make_response(jsonify({"message":str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}), 500)

@user_blueprint.route('/login')
class UserLogIn(Resource):
    def post(self):
        try:
            data = request.get_json()
            response= UserService.user_login(data)
            return make_response(jsonify(response), 200)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except InvalidData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except UserNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)

@user_blueprint.route("/profile")
class UserProfile(Resource):
    @jwt_required()
    def get(self):
        try:
            user_info = UserService.get_profile()
            return make_response(jsonify(user_info), 200)
        except UserNotFound:
            return make_response(jsonify({"message":str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)

@user_blueprint.route('/forgotpassword')
class UpdatePassword(Resource):
    def post(self):
        data=request.get_json()
        try:
            UserService.updatePassword(data)
            return "Password updated successfully",200
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}), 422)
        except InvalidData as e:
            return make_response(jsonify({"message":str(e) }), 422)
        except UserNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@user_blueprint.route('/updateemail')
class UpdateEmail(Resource):
    @jwt_required()
    def put(self):
        data=request.get_json()
        try:
            UserService.update_email(data)
            return "Email updated successfully",200
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except InvalidData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except UserNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except UserAlreadyExists as e:
            return make_response(jsonify({"message": str(e)}), 409)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@user_blueprint.route('/update-phone-number')
class UpdateEmail(Resource):
    @jwt_required()
    def put(self):
        data=request.get_json()
        try:
            UserService.update_phone_number(data)
            return "Phone Number updated successfully",200
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except InvalidData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except UserNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except UserAlreadyExists as e:
            return make_response(jsonify({"message": str(e)}), 409)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@user_blueprint.route('/enrollments')
class UserTransactions(Resource):
    @jwt_required()
    def get(self):
        try:
            userTransactions=UserService.get_transactions()
            return make_response(jsonify(userTransactions))
        except UserNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except NoEnrollmentsFoundException as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@user_blueprint.route('/details')
class UsersDetails(Resource):
    @jwt_required()
    def get(self):
        try:
            response = UserService.get_all_users_details()
            return make_response(jsonify(response), 200)
        except Exception as e:
            return {"message": str(e)}, 500
        
@user_blueprint.route('/count')
class TotalUsers(Resource):
    @jwt_required()
    def get(self):
        try:
            response = UserService.getTotalUsers()
            return make_response(jsonify(response), 200)
        except Exception as e:
            return {"message": str(e)}, 500
        
@user_blueprint.route('/courses')
class MyCourses(Resource):
    @jwt_required()
    def get(self):
        try:
            courses=UserService.get_all_mycourses()
            return make_response(jsonify(courses),200)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@user_blueprint.route("/<string:user_email>")
class userDetails(Resource):
    @jwt_required()
    def get(self,user_email):
        try:
            user=UserService.getUserDetailByEmail(user_email)
            return make_response(jsonify(user),200)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)


