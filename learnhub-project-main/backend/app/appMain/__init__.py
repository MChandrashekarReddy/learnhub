from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db=SQLAlchemy()
ma=Marshmallow()
jwt=JWTManager()
migrate=Migrate()

def create_app():
    app=Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:postgres@localhost/flask'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
    app.config['JWT_SECRET_KEY']= "mc@123"
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app,db)
    return app


