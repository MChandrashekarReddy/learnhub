from email.message import EmailMessage
import smtplib
from app.appMain.service.otp import OtpService
from app.appMain.utils.exceptions import InsufficientData,InvalidData,UserAlreadyExists,UserNotFound,NoRequestFoundException
from app.appMain.service.user import UserService
from app.appMain.service.otp import OtpService
from app.appMain.service.email_update_request import EmailUpdateRequestService

class EmailService:
    @staticmethod
    def send_otp_email_for_new_account(data):
        reciver_email=data.get('email')
        reciver_name=data.get('name')
        if not all([reciver_email,reciver_name]):
            raise InsufficientData
        if not UserService.is_valid_email(reciver_email):
            raise InvalidData("InVailid Email")
        user=UserService.get_user_by_email(reciver_email)
        if user:
            raise UserAlreadyExists
        otp=OtpService.add_otp(reciver_email)
        subject="Complete Your LearnHub Account Creation with OTP Verification"
        body = f"""
Hello {reciver_name},

Welcome to LearnHub! To complete your account setup, please verify your email address with the One-Time Password (OTP) below:

**Your OTP Code:** {otp}

This code is valid for the next **5 minutes**. Enter it in the verification section to activate your account and start exploring LearnHub.

If you didn't request this, please ignore this email. For any questions, feel free to reach out to our support team.

Thank you,  
LearnHub Team
"""
        EmailService.send_email(reciver_email,body,subject)
        return f"We have sent code to {reciver_email}"
    
    @staticmethod
    def verify_otp(data):
        reciver_email=data.get('email')
        otp=data.get('otp')
        if not all([reciver_email,otp]):
            raise InsufficientData
        if not UserService.is_valid_email(reciver_email):
            raise InvalidData("InVailid Email")
        user=UserService.get_user_by_email(reciver_email)
        if user:
            raise UserAlreadyExists
        status=OtpService.validate_otp(reciver_email,otp)
        if status:
            return "OTP matched successfully."
        else:
            return "Invalid OTP."
    @staticmethod
    def send_email_success_account_creation(reciver_email,receiver_name):
        if not all([reciver_email,receiver_name]):
            raise InsufficientData
        if not UserService.is_valid_email(reciver_email):
            raise InvalidData("InVailid Email")
        subject = "Welcome to LearnHub! Your Account is Successfully Created"
        body = f"""
Hello {receiver_name},

Congratulations on successfully creating your LearnHub account! We're excited to have you on board.

You can now log in and start exploring all the courses and features LearnHub has to offer. Discover a wide range of topics, track your learning progress, and join discussions with our community of learners and instructors.

If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!

Thank you for joining us, and happy learning!

Best regards,  
LearnHub Team
        """
        EmailService.send_email(reciver_email,body,subject)

    @staticmethod
    def send_otp_email_for_password_reset(data):
        reciver_email = data.get('email')
        if not reciver_email:
            raise InsufficientData
        if not UserService.is_valid_email(reciver_email):
            raise InvalidData("Invalid Email")
        
        user = UserService.get_user_by_email(reciver_email)
        if not user:
            raise UserNotFound
        
        otp = OtpService.add_otp(reciver_email)
        subject = "Reset Your LearnHub Account Password with OTP Verification"
        body = f"""
Hello,

We received a request to reset the password for your LearnHub account. To proceed with this reset, please verify your request by entering the following One-Time Password (OTP):

**Your OTP Code:** {otp}

This code is valid for the next **5 minutes**. Enter it in the password reset section to continue with updating your password.

If you did not request a password reset, please ignore this email or contact our support team.

Thank you,  
LearnHub Team
"""
        EmailService.send_email(reciver_email, body, subject)
        return f"OTP successfully sent to {reciver_email}"
    
    @staticmethod
    def sent_otp_email_for_email_update():
        user=UserService.get_current_user()
        if not user:
            raise UserNotFound
        user_email=user.user_email
        otp= OtpService.add_otp(user_email)
        subject = "Update Your LearnHub Account Email with OTP Verification"
        body = f"""
Hello,

We received a request to update the email address associated with your LearnHub account. To proceed with this update, please verify your request by entering the following One-Time Password (OTP):

**Your OTP Code:** {otp}

This code is valid for the next **5 minutes**. Enter it in the email update section to continue with updating your email address.

If you did not request an email update, please contact our support team.

Thank you,  
LearnHub Team
"""
        EmailService.send_email(user_email, body, subject)
        return f"OTP successfully sent to {user_email}"
    
    @staticmethod
    def add_request(data):
        otp=data.get('otp')
        user=UserService.get_current_user()
        if not user:
            raise UserNotFound
        user_email=user.user_email
        status=OtpService.validate_otp(user_email,otp)
        if not status:
            raise InvalidData("The OTP you entered is either incorrect or has expired. Please check and try again.")
        EmailUpdateRequestService.add_request(user_email)
        return "request got added"
    @staticmethod
    def sent_otp_for_new_email_verify(data):
        new_email = data.get("new_email")
        confirm_email=data.get("confirm_email")
        if new_email!=confirm_email:
            raise InvalidData("Email Mismatch")
        if not UserService.is_valid_email(new_email):
            raise InvalidData("Email does not meet required conditions")
        user=UserService.get_current_user()
        if user.user_email==new_email:
            raise InvalidData("New Email Should not match with exists one")
        if UserService.get_user_by_email(new_email):
            raise UserAlreadyExists("Duplicate Email")
        if not  EmailUpdateRequestService.check_request(user.user_email):
            raise NoRequestFoundException
        otp = OtpService.add_otp(new_email)
        subject = "Update Your LearnHub Account Email with OTP Verification"
        body = f"""
Hello,

We received a request to update the email address associated with your LearnHub account. To proceed with this update, please verify your request by entering the following One-Time Password (OTP):

**Your OTP Code:** {otp}

This code is valid for the next **5 minutes**. Enter it in the email update section to continue with updating your email address.

If you did not request an email update, please contact our support team.

Thank you,  
LearnHub Team
"""
        EmailService.send_email(new_email, body, subject)
        return f"OTP successfully sent to {new_email}"
    @staticmethod
    def send_otp_for_phone_number_update():
        user=UserService.get_current_user()
        if not user:
            raise UserNotFound
        user_email=user.user_email
        otp= OtpService.add_otp(user_email)
        subject = "Update Your LearnHub Account Phone Number with OTP Verification"
        body = f"""
Hello,

We received a request to update the phone number associated with your LearnHub account. To proceed with this update, please verify your request by entering the following One-Time Password (OTP):

**Your OTP Code:** {otp}

This code is valid for the next **5 minutes**. Enter it in the phone number update section to continue with updating your phone number.

If you did not request a phone number update, please contact our support team.

Thank you,  
LearnHub Team
"""
        EmailService.send_email(user.user_email, body, subject)
        return f"OTP successfully sent to {user.user_email}"
    @staticmethod
    def send_course_enrollment_confirmation(course_name, payment_id):
        user = UserService.get_current_user()
        if not user:
            raise UserNotFound
        user_email = user.user_email
        subject = "Your Course Enrollment Confirmation - LearnHub"
        body = f"""
Hello {user.user_name},

Congratulations! You have successfully enrolled in the course: **{course_name}**. 

Here are your enrollment details:
- **Course Name:** {course_name}
- **Payment ID:** {payment_id}

We are thrilled to have you on board and look forward to seeing you make progress. You can access your course and start learning right away!

If you have any questions or need assistance, feel free to reach out to our support team.

Thank you,  
LearnHub Team
"""
        EmailService.send_email(user_email, body, subject)
        return f"Enrollment confirmation email successfully sent to {user_email}"

    @staticmethod
    def send_email(receiver_email, body, subject="No Subject"):
            sender_email = "info.learnhubteam@gmail.com"
            app_password ="xrfq smjr cyvu pqxa"
            message = EmailMessage()
            message.set_content(body)
            message["Subject"] = subject
            message["From"] = sender_email
            message["To"] = receiver_email
            try:
                with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                    server.login(sender_email, app_password)
                    server.send_message(message)
                    return "Email sent successfully!"
            except Exception as e:
                raise Exception("Invaild Email")