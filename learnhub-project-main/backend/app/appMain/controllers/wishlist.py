from flask import request,jsonify,make_response
from flask_restx import Resource
from flask_jwt_extended import jwt_required
from app.appMain.utils.exceptions import NoCourseFoundInWishlistException,CourseAlreadyInWishlistException,CourseNotFound, InsufficientData, PermissionDeniedException
from app.appMain.service.wishlist import WishlistServices
from app.appMain.dto.wishlist import WishlistDto

wishlist_blueprint=WishlistDto.wishlist_api

@wishlist_blueprint.route("")
class Wishlist(Resource):
    @jwt_required()
    def post(self):
        data=request.get_json()
        try:
            WishlistServices.add_course_to_whishlist(data)
            return "successfully added to wishlist",201
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except CourseAlreadyInWishlistException as e:
            return make_response(jsonify({"message": str(e)}), 409)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
    @jwt_required()
    def get(self):
        try:
            courses=WishlistServices.get_all_wishlist_courses()
            return make_response(jsonify(courses),200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except NoCourseFoundInWishlistException as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
        
@wishlist_blueprint.route("/<string:course_name>",methods=['DELETE'])
class Wishlist(Resource):
    @jwt_required()
    def delete(self,course_name):
        try:
            WishlistServices.delete_course_from_whishlist(course_name)
            return "successfully delete from wishlist",201
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except NoCourseFoundInWishlistException as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500) 