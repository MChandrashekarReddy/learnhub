from datetime import date, datetime
import requests
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import Date, cast
from app.appMain import db
from app.appMain.models.payment import Payment
from app.appMain.service.user import UserService
from app.appMain.service.course import CourseService
from app.appMain.service.payment import PaymentService
from app.appMain.utils.exceptions import CourseAlreadyRegisteredException, InvalidData,NoEnrollmentFoundException, NoPaymentFoundException,PermissionDeniedException,InsufficientData,CourseNotFound
from app.appMain.models.enrollment import Enrollment

class EnrollmentSevice:

    @staticmethod
    def is_registered_for_course(user_id, course_id):
        return Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first() is not None
     
    @staticmethod
    def register_course(data):
        from app.appMain.service.wishlist import WishlistServices
        from app.appMain.service.email import EmailService
        from app.appMain.service.notifications import NotificationService
        if UserService.is_student():
            user=UserService.get_current_user()
            course_name=data.get("course_name")
            payment_mode=data.get("payment_mode")
            if not all([course_name,payment_mode]):
                raise InsufficientData
            course=CourseService.getCourse(course_name)
            if not course:
                raise CourseNotFound
            course_id=course.course_id
            user_id=user.user_id
            if EnrollmentSevice.is_registered_for_course(user_id,course_id):
                raise CourseAlreadyRegisteredException
            try:
                payment_id = PaymentService.initiate_payment(float(course.course_price),payment_mode)
                enrollment=Enrollment(user_id=user_id,course_id=course_id,payment_id=payment_id)
                db.session.add(enrollment)
                db.session.commit()
                NotificationService.notify_users_of_new_enrollment(course.course_instructor_id,user_id,user.user_name,course_name)
                if WishlistServices.is_course_this_cours_in_wishlist(course_name):
                    WishlistServices.delete_course_from_whishlist(course_name)
                EmailService.send_course_enrollment_confirmation(course_name,payment_id)
                return {
                    "payment_status": "Payment done successfully",
                    "payment_id": payment_id,
                    "enrollment": "Successfully registered to course!"
                }
            except requests.RequestException as e:
                raise Exception(f"Payment API error: {str(e)}")
            except Exception as e:
                raise Exception(str(e))
        else:
            raise PermissionDeniedException
    @staticmethod
    def getTotalEnrollments():
        if UserService.is_admin():
            enrollments=Enrollment.query.all()
            revenue=0
            for enrollement in enrollments:
                revenue=revenue+enrollement.payment.price
            return {"enrollments":len(enrollments),"revenue":str(revenue)}
        raise PermissionDeniedException
    @staticmethod
    def get_enrollments(course_id):
        enrollments=Enrollment.query.filter_by(course_id=course_id).all()
        return enrollments



    



