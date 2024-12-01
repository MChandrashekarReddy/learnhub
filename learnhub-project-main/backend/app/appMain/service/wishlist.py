from flask_jwt_extended import get_jwt_identity
from app.appMain import db
from app.appMain.service.course import CourseService
from app.appMain.service.user import UserService
from app.appMain.service.enrollment import EnrollmentSevice
from app.appMain.models.wishlist import Wishlist
from app.appMain.utils.exceptions import CourseAlreadyInWishlistException,NoCourseFoundInWishlistException,InsufficientData,CourseNotFound,PermissionDeniedException

class WishlistServices:
    @staticmethod
    def add_course_to_whishlist(data):
        if not UserService.is_student():
            raise PermissionDeniedException("Only student can add/delete course from wishlist")
        course_name=data.get('course_name')
        if not course_name:
            raise InsufficientData
        course=CourseService.getCourse(course_name)
        if not course:
            raise CourseNotFound
        course_id=course.course_id
        user_id=get_jwt_identity()
        if EnrollmentSevice.is_registered_for_course(user_id,course_id):
            raise PermissionDeniedException("Only students can add courses to the wishlist that they are not enrolled in.")
        wishlist=Wishlist.query.filter_by(user_id=user_id,course_id=course_id).first()
        if wishlist:
            raise CourseAlreadyInWishlistException
        try:
            wishlist=Wishlist(user_id=user_id,course_id=course_id)
            db.session.add(wishlist)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise str(e)
        finally:
            db.session.close()
    @staticmethod
    def delete_course_from_whishlist(course_name):
        if not UserService.is_student():
            raise PermissionDeniedException("Only student can add/delete course from wishlist")
        if not course_name:
            raise InsufficientData
        course=CourseService.getCourse(course_name)
        if not course:
            raise CourseNotFound
        course_id=course.course_id
        user_id=get_jwt_identity()
        wishlist=Wishlist.query.filter_by(user_id=user_id,course_id=course_id).first()
        if not wishlist:
            raise NoCourseFoundInWishlistException
        try:
            db.session.delete(wishlist)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise str(e)
        finally:
            db.session.close()
    @staticmethod
    def is_course_this_cours_in_wishlist(course_name):
        if not UserService.is_student():
           return False
        course=CourseService.getCourse(course_name)
        if not course:
            return False
        course_id=course.course_id
        user_id=get_jwt_identity()
        if EnrollmentSevice.is_registered_for_course(user_id,course_id):
            return False
        wishlist=Wishlist.query.filter_by(user_id=user_id,course_id=course_id).first()
        if not wishlist:
            return False
        return True
    @staticmethod
    def get_all_wishlist_courses():
        from app.appMain.service.review import ReviewService
        if not UserService.is_student():
            raise PermissionDeniedException
        user_id=get_jwt_identity()
        wishlists=Wishlist.query.filter_by(user_id=user_id).all()
        if len(wishlists)<1:
            raise NoCourseFoundInWishlistException("WishList is Empty add course to wishlist")
        courses=[wishlist.course for wishlist in wishlists]
        return [
            {
                'course_name': course.course_name,
                'course_img': course.course_img,
                'course_description': course.course_description,
                'course_instructor_name': course.instructor.user_name,
                'course_category_name': course.category.category_name,
                'course_price': str(course.course_price),
                'course_created_at': course.course_created_at.isoformat(),
                'no_of_enrollments': len(course.enrollments),
                'ratings': ReviewService.get_course_avg_rating(course.course_name),
                'wishlist':True
            }
            for course in courses
        ]


