from datetime import timedelta
from flask_jwt_extended import get_jwt_identity
from app.appMain.models.course import Course
from app.appMain.service.user import UserService
from app.appMain.service.category import CategoryService
from app.appMain import db
from app.appMain.utils.exceptions import PermissionDeniedException,InsufficientData, CourseAlreadyExistsException,CourseNotFound

class CourseService:
    @staticmethod
    def get_course_by_name(course_name):
        course=Course.query.filter_by(course_name=course_name).first()
        if course:
            return {
            'course': course.to_dict(),
            'enrollments': [enrollment.to_dict() for enrollment in course.enrollments]  
        }
        else:
            raise CourseNotFound
    @staticmethod
    def is_course_avalibale(course_name):
        return Course.query.filter_by(course_name=course_name).first()
    @staticmethod
    def add_course(data):
        from app.appMain.service.notifications import NotificationService
        if UserService.is_instructor():
            user=UserService.get_current_user()
            course_name=data.get('course_name')
            course=Course.query.filter_by(course_name=course_name).first()
            if course:
                raise CourseAlreadyExistsException(course_name)
            course_image=data.get('course_img')
            course_price=data.get('course_price')
            course_description=data.get('course_description')
            instructor=UserService.get_current_user()
            category_name=data.get('category')
            if not all([course_name,course_image,course_price,category_name]):
                raise InsufficientData
            try:
                category=CategoryService.get_category_by_name(category_name)
                course=Course(course_name,course_image,course_price,instructor,category,course_description)
                db.session.add(course)
                db.session.commit()
                NotificationService.notify_students_and_instructor_of_new_course(instructor.user_id,instructor.user_name,course_name)
            except Exception as e:
                db.session.rollback()
                raise e
            finally:
                db.session.close()

        else:
            raise PermissionDeniedException    
    @staticmethod
    def update_course(data):
        if not UserService.is_instructor():
            raise PermissionDeniedException("You Don't have permission to edit the course")
        course_name=data.get('course_name')
        course_image=data.get('course_img')
        course_price=data.get('course_price')
        course_description=data.get('course_description')
        if not all([course_name,course_image,course_price,course_description]):
            raise InsufficientData
        course=Course.query.filter_by(course_name=course_name).first()
        if not course:
            raise CourseNotFound
        if not CourseService.is_valid_instructor(course_name):
            raise PermissionDeniedException("You Don't have permission to edit course")
        course.course_image=course_image
        course.course_price=course_price
        course.course_description=course_description
        db.session.commit()
    @staticmethod
    def getCourseOverview(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course = Course.query.filter_by(course_name=course_name).first()
        if not course:
            raise CourseNotFound("Course not found")
        sum_ratings = sum(review.review_rating for review in course.reviews)
        avg_rating = sum_ratings / len(course.reviews) if course.reviews else 0
        total_seconds=sum(CourseService.convert_to_seconds(content.content_video_duration) for content in course.contents)
        total_duration = str(timedelta(seconds=total_seconds))
        overview = {
            'course_name': course.course_name,
            'course_description': course.course_description,
            'course_img': course.course_img,
            'avg_rating': avg_rating,
            'no_of_reviews': len(course.reviews),
            'no_of_enrollments': len(course.enrollments),
            'no_of_lessons': len(course.contents),
            'total_duration':total_duration,
            'category':course.category.category_name,
            'created_at':course.course_created_at,
            'price':course.course_price
        }
        return overview
    @staticmethod
    def convert_to_seconds(time_str):
        minutes, seconds = map(int, time_str.split(':'))
        return minutes * 60 + seconds 
    @staticmethod
    def getCourseId(course_name):
        course = Course.query.filter_by(course_name=course_name).first()
        if not course:
            return None
        return course.course_id
    @staticmethod
    def getCourse(course_name):
         course = Course.query.filter_by(course_name=course_name).first()
         return course
    @staticmethod
    def get_all_courses_by_instructor():
        course_instructor_id=get_jwt_identity()
        return Course.query.filter_by(course_instructor_id=course_instructor_id).all()
    @staticmethod
    def is_valid_instructor(course_name):
        if UserService.is_instructor():
            course_instructor_id=get_jwt_identity()
            course = Course.query.filter_by(course_name=course_name, course_instructor_id=course_instructor_id).first()
            if course:
                return True
            else:
                return False
        return False
    @staticmethod
    def get_all_courses():
        from app.appMain.service.review import ReviewService
        courses= Course.query.all()
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
                'ratings':ReviewService.get_course_avg_rating(course.course_name)
            }
            for course in courses
        ]
    @staticmethod
    def get_total_courses():
        if UserService.is_admin():
            courses= Course.query.all()
            return [len(courses)]
        return PermissionDeniedException
    @staticmethod
    def get_all_courses_to_register():
        from app.appMain.service.wishlist import WishlistServices
        from app.appMain.service.review import ReviewService
        enrollments=UserService.get_current_user().enrollments
        courses=[enrollment.course for enrollment in enrollments]
        course_ids=[course.course_id for course in courses]
        courses = Course.query.filter(Course.course_id.notin_(course_ids)).all()
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
                'ratings':ReviewService.get_course_avg_rating(course.course_name),
                'wishlist':WishlistServices.is_course_this_cours_in_wishlist(course.course_name,)
            }
            for course in courses
        ]
    @staticmethod
    def get_all_registered_courses():
        from app.appMain.service.progress import ProgressService
        from app.appMain.service.review import ReviewService
        enrollments = UserService.get_current_user().enrollments
        course_ids = [enrollment.course_id for enrollment in enrollments]
        courses = Course.query.filter(Course.course_id.in_(course_ids)).all()
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
                'completion_percentage': ProgressService.getCourseProgress(course.course_name)  
            } 
            for course in courses
        ]

        

       