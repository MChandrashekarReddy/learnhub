import datetime
import re
import os
from flask_jwt_extended import create_access_token,get_jwt_identity
from app.appMain.models.user import User
from app.appMain.models.role import Role
from app.appMain import db
from app.appMain.service.email_update_request import EmailUpdateRequestService
from app.appMain.utils.exceptions import *

class UserService:
    @staticmethod
    def create_user(data):
        from app.appMain.service.otp import OtpService
        from app.appMain.service.email import EmailService
        from app.appMain.service.notifications import NotificationService
        user_name = data.get('user_name')
        user_email = data.get('user_email')
        user_phone_number = data.get('user_phone_number')
        user_password = data.get('user_password') 
        user_address = data.get('user_address')
        user_role = data.get('user_role')
        user_img=data.get('user_img')
        otp=data.get('otp')
        if not all([user_name, user_email, user_phone_number, user_password, user_address, user_role,otp]):
            raise InsufficientData("All fields are required.")
        if not UserService.is_valid_email(user_email):
            raise InvalidData("Invalid email format.")
        if not OtpService.validate_otp(user_email,otp):
            raise InvalidData("Invalid OTP")
        if not UserService.is_valid_name(user_name):
            raise InvalidData("Name must be between 3 and 100 characters long and can only contain letters and spaces.")
        if not UserService.is_valid_phone_number(user_phone_number):
            raise InvalidData("Phone number must be 10 digits long and start with a non-zero digit.")
        if not UserService.is_valid_password(user_password):
            raise InvalidData("Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.")
        if not UserService.is_valid_address(user_address):
            raise InvalidData("Address must be between 3 and 100 characters long and cannot contain special characters other than comma and period.")
        user = UserService.get_user_by_email(user_email) or UserService.get_user_by_phone_number(user_phone_number)
        if user:
            raise UserAlreadyExists("User with this email or phone number already exists.")
        role = Role.query.filter_by(role_name=user_role).first()
        if not role:
            raise UnsupportedRole(f"The role '{user_role}' is not supported.")
        new_user = User(
            user_name=user_name,
            user_email=user_email,
            user_phone_number=user_phone_number,
            user_password=user_password,
            user_address=user_address,
            role=role
        )
        if user_img:
            new_user.user_img = user_img
        try:
            db.session.add(new_user)
            db.session.commit()
            NotificationService.notify_admin_of_new_user(user_name,user_role)
            EmailService.send_email_success_account_creation(user_email,user_name)
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
        
    @staticmethod
    def user_login(data):
        user_email = data.get('user_email')
        user_password = data.get('user_password')
        if not all([user_email, user_password]):
            raise InsufficientData
        if not UserService.is_valid_email(user_email) or not UserService.is_valid_password(user_password):
            raise InvalidData
        user = UserService.get_user_by_email(user_email)
        if not user or not user.verify_password(user_password):
            raise UserNotFound
        token = create_access_token(identity=user.user_id, expires_delta=datetime.timedelta(hours=24))
        return {'message': 'Login success', 'token': token,'role':user.role.role_name,'img':user.user_img,'name':user.user_name}
    
    @staticmethod
    def update_current_user(data):
        user=UserService.get_user_by_id(get_jwt_identity())
        if not user:
            raise UserNotFound
        user_name=data.get("user_name")
        user_address=data.get("user_address")
        user_img=data.get("user_img")
        if not all([user_name,user_address,user_img]):
            raise InsufficientData
        if not UserService.is_valid_name(user_name):
            raise InvalidData("Invalid user name")
        if not UserService.is_valid_address(user_address):
            raise InvalidData("Invalid Address")
        if user_img!="null" and not UserService.is_valid_image(user_img):
            raise InvalidData("Invalid Img format")
        try:
            user.user_name=user_name
            user.user_address=user_address
            user.user_img=user.user_img = None if user_img == "null" else user_img
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
    @staticmethod
    def updatePassword(data):
        from app.appMain.service.otp import OtpService
        user_email = data.get("email")
        user_password = data.get("password")
        user_confirm_password = data.get("confirmpassword")
        user_otp = data.get("otp")
        if not all([user_email, user_password, user_confirm_password, user_otp]):
            raise InsufficientData
        if not UserService.is_valid_email(user_email):
            raise InvalidData("The provided email format is invalid.")
        if not UserService.is_valid_password(user_password) or not UserService.is_valid_password(user_confirm_password):
            raise InvalidData("Password does not meet the required format or strength.")
        if not UserService.is_valid_otp(user_otp):
            raise InvalidData("The provided OTP format is invalid.")
        if user_confirm_password != user_password:
            raise InvalidData("Password and confirm password do not match.")
        if not OtpService.validate_otp(user_email, user_otp):
            raise InvalidData("The provided OTP is incorrect or has expired.")
        user = User.query.filter_by(user_email=user_email).first()
        if not user:
            raise UserNotFound("No user found with the provided email address.")
        try:
            user.user_password = user_password
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise Exception(f"An error occurred while updating the password: {str(e)}")
        finally:
            db.session.close()         
    @staticmethod
    def update_email(data):
        from app.appMain.service.otp import OtpService
        from app.appMain.service.notifications import NotificationService
        new_email=data.get("new_email")
        confirm_email=data.get("confirm_email")
        otp=data.get("otp")
        if not all([new_email,confirm_email,otp]):
            raise InsufficientData
        if new_email!=confirm_email:
            raise InvalidData("Email Mismatch")
        if not UserService.is_valid_email(new_email):
            raise InvalidData("Email not mee the coditions")
        user_id=get_jwt_identity()
        user=User.query.get(user_id)
        if not user:
            raise UserNotFound
        if user.user_email==new_email:
            InvalidData("New Email must not match previous")
        if EmailUpdateRequestService.check_request(user.user_email):
            NoRequestFoundException("Email Update Request not found or Expired")
        if UserService.get_user_by_email(new_email):
            raise UserAlreadyExists("Duplicate Email")
        if not OtpService.validate_otp(new_email,otp):
            raise InvalidData("The OTP you entered is incorrect or has expired. Please check the OTP and try again or request a new one.")
        try:
            user.user_email=new_email
            db.session.commit()
            NotificationService.notify_user_of_successful_email_update(user_id)
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
    @staticmethod
    def update_phone_number(data):
        from app.appMain.service.otp import OtpService
        from app.appMain.service.notifications import NotificationService
        new_phone_number=data.get('new_phone_number')
        new_phone_number=str(new_phone_number)
        otp=data.get('otp')
        if not all([new_phone_number,otp]):
            raise InsufficientData
        if not UserService.is_valid_phone_number(new_phone_number):
            raise InvalidData("Invalid Phone Number Format")
        user_id=get_jwt_identity()
        user=User.query.get(user_id)
        if not user:
            raise UserNotFound
        user_email=user.user_email
        if user.user_phone_number==new_phone_number:
            raise InvalidData("New Phone number should not match with old one")
        duplicate_user=User.query.filter_by(user_phone_number=new_phone_number).first()
        if duplicate_user:
            raise InvalidData("This phone number is already linked to another account. Please use a different one.")
        if not OtpService.validate_otp(user_email,otp):
            raise InvalidData("The OTP you entered is incorrect or has expired. Please check the OTP and try again or request a new one.")
        try:
            user.user_phone_number=new_phone_number
            db.session.commit()
            NotificationService.notify_user_of_successful_phone_update(user_id)
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
    @staticmethod
    def get_current_user():
        user=UserService.get_user_by_id(get_jwt_identity())
        if not user:
            raise UserNotFound
        return user
    @staticmethod
    def get_profile():
        user_id=get_jwt_identity()
        user=User.query.get(user_id)
        if not user:
            raise UserNotFound
        return {"user_img":user.user_img,"user_name":user.user_name,"user_email":user.user_email,"user_phone_number":user.user_phone_number,"user_role":user.role.role_name,"user_address":user.user_address,"user_created_at":user.user_created_at,"user_updated_at":user.user_updated_at}
    @staticmethod
    def get_all_users_details():
        users= User.query.all()
        students=[user for user in users if user.role.role_name=='student']
        instructors=[user for user in users if user.role.role_name=='instructor']
        response = {
                "students": [student.to_dict() for student in students],
                "instructors": [instructor.to_dict() for instructor in instructors]
        }
        return response
    @ staticmethod
    def get_transactions():
        user=UserService.get_user_by_id(get_jwt_identity())
        if not user:
            raise UserNotFound
        enrollments=user.enrollments
        if enrollments:
            return [enrollment.to_dict() for enrollment in user.enrollments]
        else:
            raise NoEnrollmentsFoundException
    @staticmethod
    def get_all_users(role):
        if UserService.is_admin():
            if role in ["Student", "Instructor"]:  
                users = User.query.filter(User.role.has(role_name=role)).all()
                if not users:
                    raise NoUsersFoundException("No users found with the role: " + role)
                return [user.to_dict() for user in users]
            else:
                raise UnsupportedRole(f"The role '{role}' is not supported.")
        else:
            raise PermissionDeniedException("You do not have permission to perform this action.")
    @staticmethod
    def get_all_mycourses():
        if UserService.is_instructor():
            courses=UserService.get_current_user().courses
            if courses:
                return [course.to_dict() for course in courses]
            else:
                raise NoCourseAddedException
        else:
            raise UnsupportedRole
    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)
    @staticmethod
    def get_user_by_email(user_email):
        if UserService.is_valid_email(user_email):
            return User.query.filter_by(user_email=user_email).first()
        else:
            raise InvalidData
    @staticmethod
    def get_user_by_phone_number(user_phone_number):
        print(type(user_phone_number))
        user = User.query.filter_by(user_phone_number=user_phone_number).first()
        return user
    @staticmethod
    def get_enrollments_of_current_user():
        if UserService.is_student:
            enrollments=UserService.get_current_user().enrollments
            if enrollments:
                return [enrollment.course for enrollment in enrollments]
            else:
                return NoEnrollmentsFoundException
        else:
            raise PermissionDeniedException
    @staticmethod
    def getTotalUsers():
        if UserService.is_admin():
            totalStudents=0
            totalInstructors=0
            activeStudents=0
            activeInstructors=0
            inactiveStudents=0
            inactiveInstructors=0
            users= User.query.all()
            for user in users:
                if user.role.role_name=='student':
                    totalStudents=totalStudents+1
                    if len(user.enrollments)!=0:
                        activeStudents=activeStudents+1
                    else:
                        inactiveStudents=inactiveStudents+1
                else:
                    totalInstructors=totalInstructors+1
                    if len(user.courses)!=0:
                        activeInstructors=activeInstructors+1
                    else:
                        inactiveInstructors=inactiveInstructors+1
            response = {"totalStudents":totalStudents,"activeStudents": activeStudents,"inactiveStudents":inactiveStudents,"totalInstructors":totalInstructors,"activeInstructors": activeInstructors,"inactiveInstructors":inactiveInstructors}
            return response
        return PermissionDeniedException
    @staticmethod
    def getUserDetailByEmail(user_email):
        user=UserService.get_user_by_email(user_email)
        if not user_email:
            raise InsufficientData
        if not UserService.is_valid_email(user_email):
            raise InvalidData
        if user:
            if user.role.role_name=='student':
                enrollments=[enrollment.to_dict() for enrollment in user.enrollments]
                return {"user":user.to_dict(),'enrollments':enrollments}
            elif user.role.role_name=='instructor':
                courses=[course.to_dict() for course in user.courses]
                return {"user":user.to_dict(),'courses':courses}
        else:
            raise UserNotFound
    @staticmethod
    def is_instructor():
        user=UserService.get_current_user()
        return user.role.role_name=='instructor'
    @staticmethod
    def is_student():
        user=UserService.get_current_user()
        return user.role.role_name=='student'
    @staticmethod
    def is_admin():
        user=UserService.get_current_user()
        return user.role.role_name=="admin"
    @staticmethod
    def is_valid_image(filename):
        pattern = r'.*\.(jpg|jpeg|png|gif)$'
        if re.match(pattern, filename, re.IGNORECASE):
            return True
        return False
    @staticmethod
    def is_valid_name(name):
        regex = r'^[A-Za-z]+(?: [A-Za-z]+)*$'
        return len(name) >= 3 and len(name) <= 100 and re.match(regex, name) is not None
    @staticmethod
    def is_valid_email(email):
        regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$'
        return re.match(regex, email) is not None
    @staticmethod
    def is_valid_phone_number(phone_number):
        phone_number=str(phone_number)
        regex=r'^[6789]\d{9}$'
        return re.match(regex, phone_number) is not None
    @staticmethod
    def is_valid_password(password):
        regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$'
        return re.match(regex, password) is not None
    @staticmethod
    def is_valid_address(address):
        regex = r'^[a-zA-Z0-9\s,.]{3,100}$'
        return re.match(regex, address) is not None
    @staticmethod
    def is_valid_otp(otp):
        regex = r'^\d{4}$'
        return re.match(regex,otp) is not None



