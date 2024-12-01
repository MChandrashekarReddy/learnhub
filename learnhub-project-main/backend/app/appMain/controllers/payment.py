from flask_restx import Resource
from flask import jsonify,make_response,request
from flask_jwt_extended import jwt_required
from app.appMain.service.payment import PaymentService
from app.appMain.dto.payments import PaymentDto
from app.appMain.utils.exceptions import PermissionDeniedException,InvalidData,NoPaymentFoundException

payment_blueprint=PaymentDto.payment_api

@payment_blueprint.route('')
class Payments(Resource):
    @jwt_required()
    def get(self):
        try:
            payments=PaymentService.getAllTransactins()
            return make_response(jsonify([payment.to_dict() for payment in payments]),200)
        except PermissionDeniedException as e:
           return make_response(jsonify({"message":str(e)}),409)
        except Exception as e:
           return make_response(jsonify({"message":str(e)}),500)

@payment_blueprint.route('/mypayments',methods=['GET'])
class PaymentOperations(Resource):
    @jwt_required()
    def get(self):
        try:
            payments=PaymentService.my_payments(request.args)
            return make_response(jsonify(payments),200)
        except PermissionDeniedException as e:
           return make_response(jsonify({"message":str(e)}),409)
        except InvalidData as e:
           return make_response(jsonify({"message":str(e)}),422)
        except NoPaymentFoundException as e:
           return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}),500)
