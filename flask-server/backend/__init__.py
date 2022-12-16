from datetime import timedelta


from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

from flask_jwt_extended import JWTManager

import os

from .models import db

load_dotenv()

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['SECRET_KEY'] = "123123123123123123123"
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=60)
app.config["JWT_SESSION_COOKIE"] = False
# production set to True
app.config["JWT_COOKIE_SECURE"] = False
app.config["UPLOAD_FOLDER"] = "static/files"
app.config['JSON_SORT_KEYS'] = False
# app.config["PROPAGATE_EXCEPTIONS"] = False

jwt = JWTManager(app)
db.init_app(app)

from .auth.user import users
from .validation.validationcreate import validation
from .validation.validationassess import val_assess
from .validation.pink import pink
from .public.routes import public

app.register_blueprint(users)
app.register_blueprint(validation)
app.register_blueprint(val_assess)
app.register_blueprint(public)
app.register_blueprint(pink)

with app.app_context():
    db.create_all()
