from flask_jwt_extended import get_jwt_identity
from app.appMain.models.answer import Answer
from app.appMain.utils.exceptions import InsufficientData,InvalidData
from app.appMain.service.question import QuestionService
from app.appMain import db

class AnswerService:
    @staticmethod
    def add_answer(data):
        from app.appMain.service.notifications import NotificationService
        question_id=data.get("question_id")
        answer_content=data.get('answer')
        if not question_id or not answer_content:
            raise InsufficientData
        question=QuestionService.is_question_available(question_id)
        if not question:
            raise InvalidData
        user_id=get_jwt_identity()
        try:
            answer=Answer(question_id=question_id,user_id=user_id,answer_content=answer_content)
            db.session.add(answer)
            db.session.commit()
            NotificationService.notify_student_of_answer_to_question(question.user_id,question.course.course_name)
        except Exception as e:                
            db.session.rollback()
            raise e
        finally:
            db.session.close()
        