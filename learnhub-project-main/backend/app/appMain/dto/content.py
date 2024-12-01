from flask_restx import Namespace

class ContentDto:
    content_api=Namespace('contents',description="API's for contents")