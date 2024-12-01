from flask_jwt_extended import get_jwt_identity
from app.appMain import db
from app.appMain.service.course import CourseService
from app.appMain.service.user import UserService
from app.appMain.models.question import Question
from app.appMain.service.enrollment import EnrollmentSevice
from app.appMain.utils.exceptions import CourseNotFound, PermissionDeniedException,InsufficientData,NoCourseAddedException

class QuestionService:
    @staticmethod
    def add_question(data):
        if UserService.is_student:
            from app.appMain.service.notifications import NotificationService
            question_content=data.get("question_content")
            course_name=data.get("course_name")
            if not course_name or not question_content:
                raise InsufficientData
            course=CourseService.getCourse(course_name)
            if not course:
                raise CourseNotFound
            user_id=get_jwt_identity()
            course_id=course.course_id
            question=Question(user_id=user_id,course_id=course_id,question_content=question_content)
            try:
                db.session.add(question)
                db.session.commit()
                NotificationService.notify_instructor_of_new_question(user_id,course_name)
            except:
                db.rollback
                raise Exception
            finally:
                db.session.close()       
        else:
            raise PermissionDeniedException
    @staticmethod
    def get_questions():
        if UserService.is_instructor():
            courses=CourseService.get_all_courses_by_instructor()
            if courses:
                course_ids = [course.course_id for course in courses]
                questions = Question.query.filter(Question.course_id.in_(course_ids)).all()
                questions_json = [{
                    "course_name":question.course.course_name,
                    "content_name":question.content.content_name,
                    "question":question.question_content,
                    "Date of ask":str(question.question_at),
                } for question in questions]
                return questions_json
            else:
                raise NoCourseAddedException
        else:
            raise PermissionDeniedException
    @staticmethod
    def getDiscussions(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")
        questions_list = Question.query.filter_by(course_id=course_id).all()

        if UserService.is_instructor():
            permission = CourseService.is_valid_instructor(course_name)
        else:
            user_id=get_jwt_identity()
            permission =EnrollmentSevice.is_registered_for_course(user_id,course_id)
        if not permission:
            raise PermissionDeniedException("You don't have permission to access this course")
        questions = []
        for question in questions_list:
            answers = [{'answer': answer.answer_content, 'answered_at': answer.answer_at,'answer_by':answer.user.user_name,'answered_img':answer.user.user_img,'role':answer.user.role.role_name} for answer in question.answers]
            questions.append({'question': question.question_content,'question_id':question.question_id ,'answers': answers, 'asked_at': question.question_at,'questioned_by':question.user.user_name,'questioner_img':question.user.user_img})
        return questions           
    @staticmethod
    def is_question_available(question_id):
        question=Question.query.get(question_id)
        return question 

