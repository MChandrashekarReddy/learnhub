from flask_restx import Namespace

class ReviewDto:
    review_api=Namespace('reviews',description="API's for reviews")
  