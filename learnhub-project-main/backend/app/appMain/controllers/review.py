from flask_jwt_extended import jwt_required
from flask import jsonify, make_response, request
from flask_restx import Resource
from app.appMain.utils.exceptions import CourseNotFound, InsufficientData,NoReviewsFound, PermissionDeniedException,InvalidData
from app.appMain.dto.review import ReviewDto
from app.appMain.service.review import ReviewService

review_blueprint = ReviewDto.review_api

@review_blueprint.route('/<string:courseName>')
class CourseRatings(Resource):
    def get(self,courseName):
        try:
            reviews = ReviewService.getReviews(courseName)
            return make_response(jsonify(reviews), 200)
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except NoReviewsFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}), 500)
    @jwt_required()
    def post(self,courseName):
        try:
            data=request.get_json()
            ReviewService.addReview(data,courseName)
            return "Successfully review added to course",201
        except CourseNotFound as e:
            return make_response(jsonify({"message": str(e)}), 404)
        except InsufficientData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except InvalidData as e:
            return make_response(jsonify({"message": str(e)}), 422)
        except PermissionDeniedException as e:
            return make_response(jsonify({"message": str(e)}), 403)
        except Exception as e:
            return make_response(jsonify({"message":str(e)}), 500)
