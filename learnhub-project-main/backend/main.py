from app.appMain import create_app
from flask_cors import CORS
from app import blueprint

app=create_app()
CORS(app)
app.register_blueprint(blueprint)
app.app_context().push()


if __name__=='__main__':
    app.run(debug=True)