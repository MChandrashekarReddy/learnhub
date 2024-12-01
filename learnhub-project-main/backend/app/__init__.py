from flask import Blueprint
from flask_restx import Api
from app.appMain.controllers.answers import answer_blueprint
from app.appMain.controllers.category import category_blueprint
from app.appMain.controllers.content import content_blueprint
from app.appMain.controllers.course import course_blueprint
from app.appMain.controllers.enrollment import enrollment_blueprint
from app.appMain.controllers.payment import payment_blueprint
from app.appMain.controllers.progress import progress_blueprint
from app.appMain.controllers.question import question_blueprint
from app.appMain.controllers.review import review_blueprint
from app.appMain.controllers.role import role_blueprint
from app.appMain.controllers.user import user_blueprint
from app.appMain.controllers.wishlist import wishlist_blueprint
from app.appMain.controllers.email import email_blueprint
from app.appMain.controllers.notifications import notification_blueprint

blueprint = Blueprint('api', __name__)
api = Api(blueprint, title='learnhub')

api.add_namespace(answer_blueprint)
api.add_namespace(category_blueprint)
api.add_namespace(content_blueprint)
api.add_namespace(course_blueprint)
api.add_namespace(enrollment_blueprint)
api.add_namespace(payment_blueprint)
api.add_namespace(progress_blueprint)
api.add_namespace(question_blueprint)
api.add_namespace(review_blueprint)
api.add_namespace(role_blueprint)
api.add_namespace(user_blueprint)
api.add_namespace(wishlist_blueprint)
api.add_namespace(email_blueprint)
api.add_namespace(notification_blueprint)
