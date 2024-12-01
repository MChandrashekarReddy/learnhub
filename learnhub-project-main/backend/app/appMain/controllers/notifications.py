from flask_restx import Resource
from flask import make_response,jsonify
from flask_jwt_extended import jwt_required
from app.appMain.dto.notifications import NotificationDto
from app.appMain.service.notifications import NotificationService
from app.appMain.utils.exceptions import NotificationNotFoundException,NoNotificationsFoundException,PermissionDeniedException,InsufficientData

notification_blueprint=NotificationDto.notification_api

@notification_blueprint.route('')
class Notifications(Resource):
    @jwt_required()
    def get(self):
        try:
            notifications=NotificationService.get_my_notifications()
            return make_response(jsonify(notifications),200)
        except NoNotificationsFoundException as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)},500))
    @jwt_required()
    def delete(self):
        try:
            NotificationService.clear_my_notifications()
            return "successfully cleared",200
        except NoNotificationsFoundException as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)},500))
    @jwt_required()
    def put(self):
        try:
            NotificationService.mark_all_notifications_as_read()
            return "successfully done",200
        except NoNotificationsFoundException as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)},500))
@notification_blueprint.route("/<string:notification_id>")
class NoticationsOperations(Resource):
    @jwt_required()
    def delete(self,notification_id):
        try:
            NotificationService.delete_notifcation(notification_id)
            return "Successfully deleted",200
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)},403))
        except NotificationNotFoundException as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)},500))
    @jwt_required()
    def put(self,notification_id):
        try:
            NotificationService.mark_notifaction_as_read(notification_id)
            return "Successfully updated",200
        except InsufficientData as e:
            return make_response(jsonify({"message":str(e)}),422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message":str(e)},403))
        except NotificationNotFoundException as e:
            return make_response(jsonify({"message":str(e)}),404)
        except Exception as e:
            return make_response(jsonify({"message":str(e)},500))
@notification_blueprint.route('/count')
class NotificationCount(Resource):
    @jwt_required()
    def get(self):
        try:
            count=NotificationService.getCount()
            return count,200
        except Exception as e:
            return make_response(jsonify({"message":str(e)},500))