from flask_restx import Namespace

class PaymentDto:
    payment_api=Namespace('payments',description="API's for payments")
