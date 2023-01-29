from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from ..models import User, Validation, db, Team

val_management = Blueprint("validation", __name__, url_prefix="/validation-management")


@val_management.route("/validation-list/read", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_list():
    validations = Validation.query.all()
    validation_json = {}

    for i, validation in enumerate(validations):
        temp = validation.__dict__
        temp.pop("_sa_instance_state")
        validation_json[i + 1] = temp

    return jsonify(validation_json)


@val_management.route("/<validation_id>/all-teams/read", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_teams(validation_id):
    val_teams = Validation.query.filter_by(id=validation_id).one_or_none().teams
    response = {}

    for team in val_teams:
        response[team.team_num] = {"teamNum": team.team_num, "members": {}}
        for i, user in enumerate(team.users):
            user = User.query.with_entities(User.id, User.service_number, User.name, User.job_role).filter_by(
                id=user.id).first()
            response[team.team_num]["members"][str(i + 1)] = {"id": user.id, "serviceNumber": user.service_number,
                                                              "name": user.name, "pinkType": user.job_role}

    return jsonify(response)


@val_management.route("/create", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_create():
    title, date_from, date_to, teams = request.json.values()

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


@val_management.route("/member-lookup", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_team_member_lookup():
    team_members = request.json.get("teamMembers")
    users = {}
    for member_id, member_data in team_members.items():
        service_number, valid = member_data.values()

        user = User.query.filter_by(service_number=service_number).one_or_none()
        if user:
            users[member_id] = True
        else:
            users[member_id] = False

    if users:
        return jsonify({"msg": "Member lookup successful", "userLookup": users})
    else:
        return jsonify({"msg": "Member lookup unsuccessful"})
