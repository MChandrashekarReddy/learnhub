from datetime import datetime
import uuid
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import Date, cast
from app.appMain import db
from app.appMain.models.enrollment import Enrollment
from app.appMain.models.payment import Payment
from app.appMain.utils.exceptions import InsufficientData,PermissionDeniedException,InvalidData,NoPaymentFoundException
from app.appMain.service.user import UserService

class PaymentService:
    @staticmethod
    def initiate_payment(price,payment_mode):
        if not all([price,payment_mode]):
            raise InsufficientData
        payment_id=str(uuid.uuid4())
        payment=Payment(price=price,payment_mode=payment_mode,payment_id=payment_id)
        try:
            db.session.add(payment)
            return payment_id
        except Exception as e:
            raise e
    @staticmethod
    def getAllTransactins():
        if UserService.is_admin():
            payments=Payment.query.all()
            return payments
        raise PermissionDeniedException("No Permisson")
    @staticmethod
    def my_payments(data):
        if UserService.is_admin() or UserService.is_instructor():
            raise PermissionDeniedException("Only user can see his payments")
        user_id=get_jwt_identity()
        sort= data.get('sort', None)  
        order = data.get('order', 'asc')    
        payment_mode= data.get('payment_mode', None)
        start_date = data.get('start_date', None)
        end_date = data.get('end_date', None)    
        page = int(data.get('page', 1))        
        limit = int(data.get('limit', 10))
        if not sort:
           sort='payment_at'
        elif not hasattr(Payment,sort):
            raise InvalidData("Invalid sorting")
        query=Payment.query.join(Enrollment,Payment.payment_id==Enrollment.payment_id).filter_by(user_id=user_id)
        if query.all()==0:
            raise NoPaymentFoundException("No Payments Found With this User")
        if payment_mode:
            query = query.filter(Payment.payment_mode == payment_mode)
        if start_date:
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d")
                query = query.filter(Payment.payment_at >= start_date)
            except ValueError:
                raise InvalidData("Invalid date format")
        if end_date:
            try:
                end_date = datetime.strptime(end_date, "%Y-%m-%d")
                query = query.filter(cast(Payment.payment_at,Date) <= end_date)
            except ValueError:
                raise InvalidData("Invalid date format")
        if order == 'desc':
            query = query.order_by(getattr(Payment, sort).desc())
        else:
            query = query.order_by(getattr(Payment, sort).asc())
        payments = query.paginate(page=page, per_page=limit)
        payments_data = [payment.to_dict() for payment in payments.items]
        pagination_info = {
            "has_next": payments.has_next,
            "has_prev": payments.has_prev,
            "next_page": payments.next_num if payments.has_next else None,
            "prev_page": payments.prev_num if payments.has_prev else None,
            "total_pages": payments.pages,
            "total_payments": payments.total
        }
        return {"pagination_info":pagination_info,"payments_data":payments_data}