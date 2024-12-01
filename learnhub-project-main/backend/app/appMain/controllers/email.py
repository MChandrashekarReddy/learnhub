from flask_restx import Resource
from flask import request,make_response,jsonify
from flask_jwt_extended import jwt_required
from app.appMain.dto.email import EmailDto
from app.appMain.utils.exceptions import InsufficientData,InvalidData,UserNotFound,UserAlreadyExists

email_blueprint=EmailDto.email_api

@email_blueprint.route('')
class EmailOperations(Resource):
    def post(self):
        from app.appMain.service.email import EmailService
        data=request.get_json()
        try:
            meassge=EmailService.send_otp_email_for_new_account(data)
            return make_response(jsonify({"message":meassge}),200)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except InvalidData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)

@email_blueprint.route('/forgotpassword')
class EmailOperations(Resource):
    def post(self):
        from app.appMain.service.email import EmailService
        data=request.get_json()
        try:
            meassge=EmailService.send_otp_email_for_password_reset(data)
            return make_response(jsonify({"message":meassge}),200)
        except UserNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except InvalidData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        
@email_blueprint.route('/verify')
class EmailOperations(Resource):
    def post(self):
        from app.appMain.service.email import EmailService
        data=request.get_json()
        try:
            meassge=EmailService.verify_otp(data)
            return make_response(jsonify({"otp":meassge}),200)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except InvalidData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
        
@email_blueprint.route("/request-email-update")
class EmailUpdateOperations(Resource):
    @jwt_required()
    def post(self):
        from app.appMain.service.email import EmailService
        data=request.get_json()
        try:
            message=EmailService.add_request(data)
            return message,200
        except UserNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@email_blueprint.route("/resend-email-update-otp")
class EmailUpdateOperations(Resource):
    @jwt_required()
    def get(self):
        from app.appMain.service.email import EmailService
        try:
            message=EmailService.sent_otp_email_for_email_update()
            return message,200
        except UserNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@email_blueprint.route("/request-phonenumber-update-otp")
class EmailUpdateOperations(Resource):
    @jwt_required()
    def get(self):
        from app.appMain.service.email import EmailService
        try:
            message=EmailService.send_otp_for_phone_number_update()
            return message,200
        except UserNotFound as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@email_blueprint.route('/verify-email')
class EmailOperations(Resource):
    @jwt_required()
    def post(self):
        from app.appMain.service.email import EmailService
        data=request.get_json()
        try:
            meassge=EmailService.sent_otp_for_new_email_verify(data)
            return make_response(jsonify({"message":meassge}),200)
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except UserAlreadyExists as e:
            return make_response(jsonify({"message":str(e)}),409)
        except InvalidData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)