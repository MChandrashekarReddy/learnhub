from flask_restx import Namespace

class AnswerDto:
    answer_api=Namespace('answers',description="API's for answer")
  