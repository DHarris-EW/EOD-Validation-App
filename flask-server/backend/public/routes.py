from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user

public = Blueprint("public", __name__)


@public.route("/Home", methods=["GET"])
def home():
    return jsonify({"msg": "Hello"})
