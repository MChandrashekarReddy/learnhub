import datetime
import random
import pytz
from app.appMain import db
from app.appMain.models.otp import Otp
from app.appMain.utils.exceptions import OTPDuplicateException,NoOTPRequestFound
class OtpService:
    @staticmethod
    def add_otp(email):
        otp=f"{random.randint(1000, 9999)}"
        otp_record=Otp.query.filter_by(email=email).first()
        expire_at=datetime.datetime.now() + datetime.timedelta(minutes=5)
        if otp_record is not None:
            otp_record.otp=otp
            otp_record.expire_at=expire_at
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
            return otp
        else:
            otp_record=Otp(email=email,otp=otp,expire_at=expire_at)
            try:
                db.session.add(otp_record)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
            return otp
    @staticmethod
    def validate_otp(email,otp):
        otp_record=Otp.query.filter_by(email=email).first()
        if otp_record is not None:
            if otp_record.expire_at<datetime.datetime.now(pytz.utc):
                try:
                    db.session.delete(otp_record)
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                return False
            elif otp_record.otp==otp and otp_record.expire_at>=datetime.datetime.now(pytz.utc):
                try:
                    db.session.delete(otp_record)
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                return True
        return False
        
        

