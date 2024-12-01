import datetime
import pytz
from app.appMain import db
from app.appMain.models.email_update_request import EmailUpdateRequest

class EmailUpdateRequestService:
    @staticmethod
    def add_request(email):
        request=EmailUpdateRequest.query.filter_by(email=email).first()
        expiration_time = datetime.datetime.now() + datetime.timedelta(minutes=10)
        if request is None:
            request=EmailUpdateRequest(email=email,expire_at=expiration_time)
            try:
                db.session.add(request)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise 
        else:
            request.expire_at=expiration_time
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
    @staticmethod
    def check_request(email):
        request=EmailUpdateRequest.query.filter_by(email=email).first()
        if request is not None:
            if request.expire_at<datetime.datetime.now(pytz.utc):
                    try:
                        db.session.delete(request)
                        db.session.commit()
                    except Exception as e:
                        db.session.rollback()
                    return False
            elif request.expire_at>=datetime.datetime.now(pytz.utc):
                    try:
                        db.session.delete(request)
                        db.session.commit()
                    except Exception as e:
                        db.session.rollback()
                    return True
        return False  
