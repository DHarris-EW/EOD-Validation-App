from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user

from ..models import User, PinkVersion, UserPink, db, UserPinkCriteriaScore, UserPinkHeaderScore

pink = Blueprint("pink", __name__, url_prefix="/pink")


@pink.route("/sumbit", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_sumbit():

    pink = request.json
    sections = pink.pop("sections")

    user_pink = UserPink(user_id=pink["operator"]["id"],
                         pink_version_id=pink["version"]["id"],
                         authorisation_exercise=pink["authorisationExercise"],
                         assessor_id=pink["assessor"]["id"],
                         brief_task_description=pink["briefTaskDescription"],
                         task_number=pink["taskNumber"],
                         score=pink["score"],
                         passed=pink["passed"])

    db.session.add(user_pink)
    db.session.flush()

    for header, header_info in sections.items():
        uphs = UserPinkHeaderScore(user_pink_id=user_pink.id,
                                   criteria_header_id=header_info["id"],
                                   score=header_info["score"])
        db.session.add(uphs)

        for criteria, criteria_info in header_info["criteriaGroup"].items():
            upcs = UserPinkCriteriaScore(user_pink_id=user_pink.id,
                                         criteria_id=criteria_info["id"],
                                         score=criteria_info["score"])
            db.session.add(upcs)

    db.session.commit()

    return jsonify({"msg": {"text": f"Pink submitted successfully to {pink['operator']['serviceNumber']}", "type": "success"}})


@pink.route("/fetch", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_fetch():
    pink_data = request.json
    operator = User.query.filter_by(service_number=pink_data["operator"]).one()
    pink_version = PinkVersion.query.filter(PinkVersion.name.contains(pink_data["type"]))\
        .order_by(PinkVersion.id.desc()).first()

    sections = {}
    header_ids = []

    for criteria in pink_version.criteria:
        if criteria.header.id not in header_ids:
            header_ids.append(criteria.header.id)
            sections[criteria.header.name] = {"index": len(header_ids) - 1,
                                              "id": criteria.header.id,
                                              "passed": True,
                                              "score": 0,
                                              "criteriaGroup": {}}

        sections[criteria.header.name]["criteriaGroup"][criteria.name] = {"id": criteria.id,
                                                                          "safety": criteria.safety,
                                                                          "score": 0}

    return jsonify({"authorisationExercise": pink_data["title"],
                    "operator": {"id": operator.id, "serviceNumber": operator.service_number},
                    "assessor": {"id": current_user.id, "serviceNumber": current_user.service_number},
                    "briefTaskDescription": "", "taskNumber": "",
                    "version": {"name": pink_version.name, "id": pink_version.id},
                    "totalScore": pink_version.total_score,
                    "score": 0,
                    "passed": True,
                    "ready": False,
                    "sections": sections})


@pink.route("/operator/<service_number>/list/<title>", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_view(service_number, title):
    user_data = request.json
    print(user_data)

    user_pink = UserPink.query.filter_by(user_id=user_data["id"], authorisation_exercise=title).all()

    response = []

    for pink in user_pink:
        temp = {"id": pink.id, "taskNumber": pink.task_number, "assessor": pink.assessor.service_number, "briefTaskDescription": pink.brief_task_description}
        response.append(temp)

    return jsonify(response)
