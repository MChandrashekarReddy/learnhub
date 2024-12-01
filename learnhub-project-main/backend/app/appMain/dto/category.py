from flask_restx import Namespace

class CategoryDto:
    category_api=Namespace('category',description="API's for category")
    