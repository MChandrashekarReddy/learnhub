class InsufficientData(Exception):
    def __init__(self, message="Insufficient data"):
        self.message = message
        super().__init__(self.message)
        
class InvalidData(Exception):
    def __init__(self, message="Invalid data"):
        self.message = message
        super().__init__(self.message)

class UserAlreadyExists(Exception):
    def __init__(self, message="User already exists"):
        self.message = message
        super().__init__(self.message)

class UnsupportedRole(Exception):
    def __init__(self, message="Unsupported role"):
        self.message = message
        super().__init__(self.message)

class UserNotFound(Exception):
    def __init__(self, message="User Not Found"):
        self.message = message
        super().__init__(self.message)

class NoUsersFoundException(Exception):
    def __init__(self, message="No users found in the database"):
        self.message = message
        super().__init__(self.message)

class PermissionDeniedException(Exception):
    def __init__(self, message="Only instructors are allowed to add new course."):
        self.message = message
        super().__init__(self.message)

class NoEnrollmentsFoundException(Exception):
    def __init__(self, message="No enrollments found for this user."):
        self.message = message
        super().__init__(self.message)

class NoCourseAddedException(Exception):
    def __init__(self, message="No courses have been added by this instructor."):
        self.message = message
        super().__init__(self.message)

class CourseAlreadyRegisteredException(Exception):
    def __init__(self, message="User is already registered for this course."):
        self.message = message
        super().__init__(self.message)

class CourseNotFound(Exception):
    def __init__(self, message="Course Not Found"):
        self.message = message
        super().__init__(self.message)

class ContentNotFound(Exception):
    def __init__(self, message="Content Not Found"):
        self.message = message
        super().__init__(self.message)

class CategoryNotFound(Exception):
    def __init__(self, message="Category not found"):
        self.message = message
        super().__init__(self.message)

class CourseAlreadyExistsException(Exception):
    def __init__(self, course_name):
        self.course_name = course_name
        self.message = f"The course '{self.course_name}' already exists."
        super().__init__(self.message)

class CategoryAlreadyExistsException(Exception):
    def __init__(self, message="Category already exists"):
        self.message = message
        super().__init__(self.message)

class NoCourseFoundInWishlistException(Exception):
    def __init__(self, message="No course found in the wishlist."):
        self.message = message
        super().__init__(self.message)
class NoContentFoundException(Exception):
    def __init__(self, message="No conent found for this course"):
        self.message = message
        super().__init__(self.message)
class NoNotificationsFoundException(Exception):
    def __init__(self, message="No notifications found for this User"):
        self.message = message
        super().__init__(self.message)
class NotificationNotFoundException(Exception):
    def __init__(self, message="No notifications found for this User"):
        self.message = message
        super().__init__(self.message)
class CourseAlreadyInWishlistException(Exception):
    def __init__(self, message="Course is already added to the wishlist."):
        self.message = message
        super().__init__(self.message)
        
class VideoProcessingException(Exception):
    def __init__(self, message="An error occurred while processing the video."):
        self.message = message
        super().__init__(self.message)
        
class NoRequestFoundException(Exception):
    def __init__(self, message="No request found"):
        self.message = message
        super().__init__(self.message)
class NoPaymentFoundException(Exception):
    def __init__(self,message="No Paymnets Found"):
        self.message=message
class NoEnrollmentFoundException(Exception):
    def __init__(self, message="No Enrollment Found"):
        self.message=message
class OTPDuplicateException(Exception):
     def __init__(self, message="Already user has OTP request"):
        self.message=message
class NoOTPRequestFound(Exception):
     def __init__(self, message="No OTP request Found"):
        self.message=message
class NoReviewsFound(Exception):
     def __init__(self, message="No reviews available for this course."):
        self.message=message


