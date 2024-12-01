from flask_jwt_extended import get_jwt_identity
from sqlalchemy import desc
from app.appMain import db
from app.appMain.models.notifications import Notifications
from app.appMain.service.course import CourseService
from app.appMain.service.enrollment import EnrollmentSevice
from app.appMain.service.role import RoleService
from app.appMain.utils.exceptions import NoNotificationsFoundException,InsufficientData,NotificationNotFoundException,PermissionDeniedException

class NotificationService:
    @staticmethod
    def notify_students_and_instructor_of_new_course(instructor_id,instructor_name,course_name):      #verified
        student_notification_title = f"New Course Alert: {course_name} is Live!"
        student_notification_message = (
            f"Great news! The course '{course_name}' is now available on our platform. "
            "Enhance your skills with expert-led content and start your learning journey today. "
            "Don't miss out on this opportunity Enroll now!"
        )
        admin_notification_title = "New Course Added"
        admin_notification_message = (
            f"A new course, '{course_name}', has been added by instructor '{instructor_name}'. "
        )
        students=RoleService.get_all_students()
        admin=RoleService.get_admin()
        if len(students)!=0:
            try:
                for student in students:
                    student_notification=Notifications(user_id=student.user_id,notification_title=student_notification_title,notification_message=student_notification_message)
                    db.session.add(student_notification)
                admin_notification=Notifications(user_id=admin.user_id,notification_title=admin_notification_title,notification_message=admin_notification_message)
                db.session.add(admin_notification)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
            finally:
                db.session.close()    
    @staticmethod
    def notify_enrolled_students_of_new_content(course_name):      #verified
        course=CourseService.getCourse(course_name)
        if course:
            notification_title = f"New Content Added to Your Course: {course_name}!"
            notification_message = (
                f"New content has been added to your course '{course_name}'. "
                "We've updated the course with fresh, exciting material to enhance your learning experience. "
            )
            enrollemnts=EnrollmentSevice.get_enrollments(course.course_id)
            try:
                for enrollemnt in enrollemnts:
                    notification=Notifications(user_id=enrollemnt.user_id,notification_title=notification_title,notification_message=notification_message)
                    db.session.add(notification)
                    db.session.commit()
            except Exception as e:
                db.session.rollback()
            finally:
                db.session.close() 
    @staticmethod
    def notify_student_of_answer_to_question(user_id,course_name):      #verified
        notification_title = f"Your Question in {course_name} Has an Answer!"
        notification_message = (
            f"Good news! Someone has answered your question in '{course_name}'. "
            "Go to the course to view the answer and join the discussion!"
        )
        try:
            notification=Notifications(user_id=user_id,notification_title=notification_title,notification_message=notification_message)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()

        finally:
            db.session.close() 
    @staticmethod
    def notify_user_of_successful_email_update(user_id):      #verified
        notification_title = "Email Update Successful"
        notification_message = (
            f"Your email has been successfully updated. "
            "You will now receive notifications at your new Email."
        )
        try:
            notification=Notifications(user_id=user_id,notification_title=notification_title,notification_message=notification_message)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        finally:
            db.session.close() 
    @staticmethod
    def notify_user_of_successful_phone_update(user_id):      #verified
        notification_title = "Phone Number Update Successful"
        notification_message = (
            "Your phone number has been successfully updated in your account."
        )
        try:
            notification=Notifications(user_id=user_id,notification_title=notification_title,notification_message=notification_message)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        finally:
            db.session.close() 
    @staticmethod
    def notify_instructor_of_new_review(user_id, course_name,):      #verified
        notification_title = f"New Review on Your Course: {course_name}"
        notification_message = (
            f"Good news! A new review has been added to your course '{course_name}'. "
            "Check it out to see what your students are saying!"
        )
        try:
            notification=Notifications(user_id=user_id,notification_title=notification_title,notification_message=notification_message)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        finally:
            db.session.close() 
    @staticmethod
    def notify_instructor_of_new_question(user_id, course_name):      #verified
        notification_title = f"New Question in {course_name}"
        notification_message = (
            "A student has posted a new question in your course. "
            "Please go to course and provide an answer."
        )
        try:
            notification=Notifications(user_id=user_id,notification_title=notification_title,notification_message=notification_message)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        finally:
            db.session.close() 
    @staticmethod
    def notify_users_of_new_enrollment(instructor_id,studnet_id,student_name,course_name):      #verified
        instrucotr_notification_title = f"New Enrollment in {course_name}"
        instrucotr_notification_message = (
            "A new student has enrolled in your course. "
        )
        admin_notification_title = f"New Enrollment in {course_name}"
        admin_notification_message = (
            f"Student '{student_name}' has enrolled in the course '{course_name}'. "
        )
        student_notification_title = f"Enrollment Successful: Welcome to {course_name}!"
        stduent_notification_message = (
                f"Congratulations ! You've successfully enrolled in the course '{course_name}'. "
                "Start learning now and enjoy the course!"
            )
        admin=RoleService.get_admin()
        try:
            instrucotr_notification=Notifications(user_id=instructor_id,notification_title=instrucotr_notification_title,notification_message=instrucotr_notification_message)
            admin_notification=Notifications(user_id=admin.user_id,notification_title=admin_notification_title,notification_message=admin_notification_message)
            stduent_notification=Notifications(user_id=studnet_id,notification_title=student_notification_title,notification_message=stduent_notification_message)
            db.session.add(instrucotr_notification)
            db.session.add(admin_notification)
            db.session.add(stduent_notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        finally:
            db.session.close()
    @staticmethod
    def notify_instructor_of_new_category(category_name):  #verifed
        notification_title = f"New Category Added: {category_name}"
        notification_message = (
            f"A new category '{category_name}' has been added to the platform. "
            "Explore this category to create courses and reach more students!"
        )
        instructors=RoleService.get_all_instructors()
        if len(instructors)!=0:
            try:
                for instructor in instructors:
                    notification=Notifications(user_id=instructor.user_id,notification_title=notification_title,notification_message=notification_message)
                    db.session.add(notification)
                    db.session.commit()
            except Exception as e:
                db.session.rollback()
            finally:
                db.session.close() 
    @staticmethod
    def notify_admin_of_new_user(user_name,user_role):  #verifed
        notification_title = "New User Registration"
        notification_message = (
            f"A new user, '{user_name}' with the role of '{user_role}', has just registered on the platform. "
        )
        admin=RoleService.get_admin()
        try:
            notification=Notifications(user_id=admin.user_id,notification_title=notification_title,notification_message=notification_message)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        finally:
            db.session.close() 
    @staticmethod
    def notify_admin_of_new_course(course_name,instructor_name):
        notification_title = "New Course Added"
        notification_message = (
            f"A new course, '{course_name}', has been added by instructor '{instructor_name}'. "
        )
        admin=RoleService.get_admin()
        try:
            notification=Notifications(user_id=admin.user_id,notification_title=notification_title,notification_message=notification_message)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
        finally:
            db.session.close()
    @staticmethod
    def get_my_notifications():
        user_id=get_jwt_identity()
        notifications_list = Notifications.query.filter_by(user_id=user_id, is_deleted=False).order_by(desc(Notifications.created_at)).all()
        # if not notifications_list:
        #     raise NoNotificationsFoundException("No Notifcations")
        notifications=[notification.to_dict() for notification in notifications_list]
        return notifications
    @staticmethod
    def mark_notifaction_as_read(notification_id):
        if not notification_id:
            raise InsufficientData
        user_id=get_jwt_identity()
        notification=Notifications.query.filter_by(notification_id=notification_id,user_id=user_id).first()
        if not notification:
            raise NotificationNotFoundException("Noticication Not found")
        notification.notification_read_status=True
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
    @staticmethod
    def mark_all_notifications_as_read():
        user_id = get_jwt_identity()
        updated_count = Notifications.query.filter(Notifications.user_id == user_id).update({Notifications.notification_read_status: True})
        if updated_count == 0:
            raise NoNotificationsFoundException("No notifications to mark as read.")
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e  
        finally:
            db.session.close()

    @staticmethod
    def delete_notifcation(notification_id):
        if not notification_id:
            raise InsufficientData
        user_id=get_jwt_identity()
        notification=Notifications.query.filter_by(notification_id=notification_id,user_id=user_id).first()
        if not notification:
            raise NotificationNotFoundException("Noticication Not found")
        notification.is_deleted=True
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
    @staticmethod
    def clear_my_notifications():
        user_id=get_jwt_identity()
        cleared_notifcations=Notifications.query.filter_by(user_id=user_id, is_deleted=False).update({Notifications.is_deleted: True})
        if cleared_notifcations==0:
            raise NotificationNotFoundException("No Notifications to clear")
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
    @staticmethod
    def getCount():
        user_id=get_jwt_identity()
        count=Notifications.query.filter_by(user_id=user_id,is_deleted=False,notification_read_status=False).count()
        return count





