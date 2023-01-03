from datetime import timedelta, datetime, timezone

import redis as redis
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, unset_access_cookies
from flask_jwt_extended import set_access_cookies, current_user

from .. import jwt, bcrypt
from ..models import User, db

from .decorators import admin_required

users = Blueprint("users", __name__)


jwt_redis_blocklist = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


@users.after_request
def refresh_expiring_jwts(response):
    print("refresh after_request")
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            print("refreshing...")
            access_token = create_access_token(identity=current_user, additional_claims={"is_admin": current_user.is_admin})
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


# Callback function to check if a JWT exists in the redis blocklist
@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None


def msg(text):
    return jsonify({"msg": text})


@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    response = msg("Session timed out")
    unset_access_cookies(response)
    return response, 401


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@users.route("/auth", methods=["POST"])
@jwt_required(optional=True)
def auth():
    claims = get_jwt()
    if claims:
        return jsonify({"auth": {"name": current_user.name, "serviceNumber": current_user.service_number, "id": current_user.id, "is_admin": claims["is_admin"]}}), 200
    else:
        return jsonify({"msg": "no auth"}), 403


@users.route("/registration", methods=["POST"])
@jwt_required()
@admin_required()
def registration():
    if not request.files:
        return jsonify({"msg": "no files in request"})
    file = request.files["file"]
    csv_file = file.read().decode("utf-8-sig")
    rows = csv_file.splitlines()

    accounts_created = []
    for row, data in enumerate(rows):
        if row > 0:
            row_data = data.split(",")
            service_number = row_data[0]
            rank = row_data[1]
            name = row_data[2]
            if not User.query.filter_by(service_number=service_number).first():
                hashed_password = bcrypt.generate_password_hash(name[:2] + service_number[-4:]).decode('utf-8')
                user = User(service_number=service_number, name=name, password=hashed_password)
                db.session.add(user)
                accounts_created.append(service_number)
    db.session.commit()

    if accounts_created:
        return jsonify({"accounts": accounts_created, "msg": {"text": f"{len(accounts_created)} accounts created succesfully!", "type": "success"}})
    else:
        return jsonify({"msg": {"text": "No accounts created", "type": "danger"}})


@users.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return msg("Missing JSON in request"), 400

    service_number = request.json.get("serviceNumber")
    password = request.json.get("password")

    if not service_number:
        return msg("Missing username parameter"), 400
    if not password:
        return msg("Missing password parameter"), 400

    user = User.query.filter_by(service_number=service_number).one_or_none()

    if password == user.password:
        response = jsonify({"msg": {"text": "Login Successful!", "type": "success"}, "auth": {"id": user.id, "name": user.name, "serviceNumber": user.service_number, "is_admin": user.is_admin}})
        access_token = create_access_token(identity=user, additional_claims={"is_admin": user.is_admin})
        set_access_cookies(response, access_token)

        return response
    else:
        return jsonify({"msg": {"text": "Login Unsuccessful!", "type": "danger"}}), 401


@users.route("/logout", methods=["DELETE"])
@jwt_required(verify_type=False)
def logout():
    print("logout")
    jti = get_jwt()["jti"]
    jwt_redis_blocklist.set(jti, "", ex=timedelta(hours=1))
    response = jsonify({"msg": {"text": "Logged out successfully!", "type": "success"}})
    unset_access_cookies(response)
    return response
