from flask import Blueprint, jsonify

public = Blueprint("public", __name__)


@public.route("/Home", methods=["GET"])
def home():
    return jsonify({"msg": "Hello"})
