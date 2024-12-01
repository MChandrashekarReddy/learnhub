from flask_jwt_extended import get_jwt_identity
from app.appMain import db
from app.appMain.utils.exceptions import CourseNotFound, InsufficientData, PermissionDeniedException,NoReviewsFound
from app.appMain.models.review import Review
from app.appMain.service.course import CourseService
from app.appMain.service.user import UserService
from app.appMain.service.enrollment import EnrollmentSevice

class ReviewService:
    @staticmethod
    def getReviews(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")
        reviews_list = Review.query.filter_by(course_id=course_id).all()
        if len(reviews_list)<=0:
            raise NoReviewsFound
        total_ratings = 0
        rating_counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
        reviews = []
        for review in reviews_list:
            total_ratings += review.review_rating
            rating_counts[review.review_rating] += 1
            reviews.append({
                'user_img':review.users.user_img,
                'user_name': review.users.user_name,
                'review_content': review.review_content,
                'review_at': str(review.review_at),
                'rating': review.review_rating
            })
        average_rating = total_ratings / len(reviews_list) if reviews_list else 0
        rating_summary = {
            'average_rating': average_rating,
            'one_star_ratings': rating_counts[1],
            'two_star_ratings': rating_counts[2],
            'three_star_ratings': rating_counts[3],
            'four_star_ratings': rating_counts[4],
            'five_star_ratings': rating_counts[5],
            'one_star_ratings_per':rating_counts[1]/len(reviews_list)*100,
            'two_star_ratings_per':rating_counts[2]/len(reviews_list)*100,
            'three_star_ratings_per':rating_counts[3]/len(reviews_list)*100,
            'four_star_ratings_per':rating_counts[4]/len(reviews_list)*100,
            'five_star_ratings_per':rating_counts[5]/len(reviews_list)*100,
            'reviews': reviews
        }
        return rating_summary
    @staticmethod
    def addReview(data,course_name):
        from app.appMain.service.notifications import NotificationService
        review_content=data.get("review_content")
        review_rating=int(data.get("review_rating"))
        if not all([course_name, review_content, review_rating]):
            raise InsufficientData
        course = CourseService.getCourse(course_name)
        if not course:
            raise CourseNotFound("Course not found")
        course_id=course.course_id
        if UserService.is_student:
            user_id=get_jwt_identity()
            if not EnrollmentSevice.is_registered_for_course(user_id,course_id):
                raise PermissionDeniedException("Only enrolled users can add reviews.")
            review=Review(
                user_id=user_id,
                course_id=course_id,
                review_content=review_content,
                review_rating=review_rating
                )
            try:
                db.session.add(review)
                db.session.commit()
                NotificationService.notify_instructor_of_new_review(user_id,course.course_name)
            except Exception as e:
                db.session.rollback()
                raise e
            finally:
                db.session.close()
        else:
          raise PermissionDeniedException("Only enrolled users can add reviews.")
    @staticmethod
    def get_course_avg_rating(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")
        reviews_list = Review.query.filter_by(course_id=course_id).all()
        if len(reviews_list)<1:
            return 2
        total_rating= sum(review.review_rating for review in reviews_list)
        avg_rating =total_rating/len(reviews_list)
        return avg_rating