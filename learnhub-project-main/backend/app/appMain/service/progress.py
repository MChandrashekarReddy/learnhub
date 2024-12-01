from flask_jwt_extended import get_jwt_identity
from app.appMain.service.user import UserService
from app.appMain.models.progress import Progress
from app.appMain.service.course import CourseService
from app.appMain.service.enrollment import EnrollmentSevice
from app.appMain.utils.exceptions import InvalidData,InsufficientData,CourseNotFound,PermissionDeniedException
from app.appMain import db

class ProgressService:
    @staticmethod
    def updateProgress(data):
        if not UserService.is_student():
            raise PermissionDeniedException("Only Enrolled user can update is progress")
        course_name=data.get("course_name")
        content_id=data.get("content_id")
        user_id=get_jwt_identity()
        progress_percentage=data.get("progress_percentage")
        if not all([content_id,course_name,progress_percentage]):
            raise InsufficientData
        course_id= CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound
        if not EnrollmentSevice.is_registered_for_course(user_id,course_id):
            raise PermissionDeniedException("Only Enrolled user can update is progress")
        if progress_percentage<0 or progress_percentage>100:
            raise InvalidData
        progress=Progress.query.filter_by(user_id=user_id,content_id=content_id,course_id=course_id).first()
        if progress:
            
            progress.progress_percentage=progress_percentage
            db.session.commit()
        else:
            progress=Progress(user_id=user_id,course_id=course_id,content_id=content_id,progress_percentage=progress_percentage)
            try:
                db.session.add(progress)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
            finally:
                db.session.close()
    @staticmethod
    def deleteProgress(course_name,content_id):
        if not UserService.is_student():
            raise PermissionDeniedException("Only Enrolled user can update is progress")
        user_id=get_jwt_identity()
        if not all([content_id,course_name]):
            raise InsufficientData
        course_id= CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound
        if not EnrollmentSevice.is_registered_for_course(user_id,course_id):
            raise PermissionDeniedException("Only Enrolled user can update is progress")
        progress=Progress.query.filter_by(user_id=user_id,content_id=content_id,course_id=course_id).first()
        if progress:
            try:
                db.session.delete(progress)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
            finally:
                db.session.close()
        else:
            raise InvalidData

    @staticmethod
    def getCourseProgress(course_name):
        if not UserService.is_student():
            raise PermissionDeniedException("Only User Can Know is progress")
        course=CourseService.getCourse(course_name)
        if not course:
            raise CourseNotFound
        user_id=get_jwt_identity()
        course_id=course.course_id
        if not EnrollmentSevice.is_registered_for_course(user_id,course_id):
            raise PermissionDeniedException("You Not registered for course")
        total_contents=len(course.contents)
        if total_contents==0:
            return 0
        completed_contents=len(Progress.query.filter_by(course_id=course_id,user_id=user_id,progress_percentage=100).all())
        completion_percentage=(completed_contents/total_contents)*100
        return completion_percentage
    @staticmethod
    def getContentProgress(course_name,content_id):
        if not UserService.is_student():
            raise PermissionDeniedException("Only Enrolled user can get is progress")
        user_id=get_jwt_identity()
        if not all([content_id,course_name]):
            raise InsufficientData
        course_id= CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound
        if not EnrollmentSevice.is_registered_for_course(user_id,course_id):
            raise PermissionDeniedException("Only Enrolled user can update is progress")
        progress=Progress.query.filter_by(user_id=user_id,content_id=content_id,course_id=course_id).first()
        if(progress):
            return progress.progress_percentage
        return 0