from flask_restx import Namespace

class QuestionDto:
    question_api=Namespace('questions',description="API's for questions")
  