from app.appMain import db
from app.appMain.service.user import UserService
from app.appMain.models.category import Category
from app.appMain.utils.exceptions import InsufficientData,PermissionDeniedException,CategoryAlreadyExistsException

class CategoryService:
    @staticmethod
    def create_category(data):
        from app.appMain.service.notifications import NotificationService
        if  UserService.is_admin():
            category_name=data.get('category_name')
            if CategoryService.get_category_by_name(category_name):
                raise CategoryAlreadyExistsException
            if not category_name:
                raise InsufficientData
            try:
                category=Category(category_name)
                db.session.add(category)
                db.session.commit()
                NotificationService.notify_instructor_of_new_category(category_name)
            except Exception as e:
                db.session.rollback()
                raise e
            finally:
                db.session.close()
        else:
            raise PermissionDeniedException
    @staticmethod
    def get_category_by_name(category):
        return Category.query.filter_by(category_name=category).first()
    @staticmethod
    def get_all_categories():
        return Category.query.all()
    @staticmethod
    def get_totalCategories():
        if  UserService.is_admin():
            totalcategories=Category.query.all()
            categories={}
            categories_revenue={}
            for category in totalcategories:
                    category_name = category.category_name
                    courses = category.courses
                    categories[category_name] = len(courses)
                    revenue = 0
                    for course in courses:
                        revenue += course.course_price * len(course.enrollments)
                    categories_revenue[category_name] = revenue
            return {"categories": categories, "categories_revenue": categories_revenue}
        raise PermissionDeniedException
    @staticmethod
    def get_all_Categories_detail():
        if  UserService.is_admin():
            categories=Category.query.all()
            categoriesList=[]
            for category in categories:
                courses=category.courses
                enrollments=0
                revenue=0
                for course in courses:
                    enrollments=enrollments+len(course.enrollments)
                    revenue=revenue+(course.course_price*enrollments)
                new_categorie={'category_name':category.category_name,'category_created_at':category.category_created_at,"courses":str(len(courses)),'enrollments':str(enrollments),'revenue':revenue}
                categoriesList.append(new_categorie)
            return categoriesList
        raise PermissionDeniedException
