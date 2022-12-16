from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..models import User, Validation

val_assess = Blueprint("validation2", __name__, url_prefix="/validation/assess")


@val_assess.route("/validation-list", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_collect():
    validations = Validation.query.all()
    validation_json = {}
    for i, validation in enumerate(validations):
        temp = validation.__dict__
        temp.pop("_sa_instance_state")
        validation_json[i + 1] = temp

    return jsonify(validation_json)


@val_assess.route("/<title>", methods=["POST"])
@jwt_required(locations=["cookies"])
def validation_team(title):
    validation_teams = Validation.query.filter_by(title=title).one_or_none().teams
    response = {}

    for team in validation_teams:
        response[team.team_num] = {"teamNum": team.team_num, "members": {}}
        for i, user in enumerate(team.users):
            user = User.query.with_entities(User.id, User.service_number, User.name).filter_by(id=user.id).first()
            response[team.team_num]["members"][str(i + 1)] = {"id": user.id, "serviceNumber": user.service_number,
                                                              "name": user.name}

    return jsonify(response)
