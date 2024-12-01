from app.appMain.models.role import Role
from app.appMain import db
from app.appMain.utils.exceptions import InsufficientData

class RoleService:
    def create_role(data):
        role_name=data.get("role_name")
        if not role_name:
            raise InsufficientData
        role=Role(role_name)
        try:
            db.session.add(role)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        finally:
            db.session.close()
    @staticmethod
    def get_all_students():
       students= Role.query.filter_by(role_name='student').first().users
       return students
    @staticmethod
    def get_all_instructors():
       instructors= Role.query.filter_by(role_name='instructor').first().users
       return instructors
    @staticmethod
    def get_admin():
        admin =Role.query.filter_by(role_name='admin').first().users[0]
        return admin


