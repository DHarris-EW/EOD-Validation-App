from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from ..models import db, User, Validation, Team

validation = Blueprint("validation", __name__, url_prefix="/validation")


@validation.route("/create", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_create():
    title, date_from, date_to, teams = request.json.values()
    print(title, date_from, date_to, teams)

    try:
        validation = Validation(title=title, date_from=date_from.split("T")[0], date_to=date_to.split("T")[0])
        db.session.add(validation)
        db.session.flush()
        for team_num, team_data in teams.items():
            team = Team(team_num=team_num, validation_id=validation.id)
            db.session.add(team)
            db.session.flush()
            for member_data in team_data["teamMembers"].values():
                service_number, name, valid = member_data.values()
                user = User.query.filter_by(service_number=service_number).one_or_none()
                team.users.append(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": {"text": "Please enter a unique title", "type": "danger"}})

    return jsonify({"msg": {"text": f"{title}, created successfully!", "type": "success"}})


@validation.route("/lookup", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_lookup():
    team_members = request.json.get("teamMembers")
    users = {}
    for member_id, member_data in team_members.items():
        service_number, name, valid = member_data.values()

        user = User.query.filter_by(service_number=service_number).one_or_none()
        if user:
            users[member_id] = True
        else:
            users[member_id] = False

    if users:
        return jsonify({"msg": "Member lookup successful", "userLookup": users})
    else:
        return jsonify({"msg": "Member lookup unsuccessful"})






