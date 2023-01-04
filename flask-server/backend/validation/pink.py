from collections import defaultdict

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from sqlalchemy import func, desc

from ..models import User, PinkVersion, UserPink, db, UserPinkCriteriaScore, UserPinkHeaderScore, Criteria, \
    CriteriaHeader

pink = Blueprint("pink", __name__, url_prefix="/pink-management")


@pink.route("/user/<user_id>/portal", methods=["POST"])
@jwt_required(locations=["cookies"])
def user_portal(user_id):
    response = []

    user_pinks = UserPink.query.filter_by(user_id=user_id).all()
    user = User.query.filter_by(id=user_id).one()
    pinks_passed = 0
    pinks_failed = 0

    for pink in user_pinks:
        temp = pink.__dict__
        temp.pop("_sa_instance_state")
        if temp["passed"]:
            pinks_passed += 1
        else:
            pinks_failed += 1
        response.append(temp)

    return jsonify({"operator": {"id": user.id, "name": user.name, "serviceNumber": user.service_number}, "pinks": response, "passed": pinks_passed, "failed": pinks_failed, "total": len(user_pinks)})


@pink.route("/user/admin/portal", methods=["POST"])
@jwt_required(locations=["cookies"])
def admin_portal():

    if request.data:
        print(request.json)

    criteria = Criteria.query.all()
    headers = CriteriaHeader.query.all()

    criteria_score_frequency = UserPinkCriteriaScore.query.with_entities(UserPinkCriteriaScore.criteria_id, UserPinkCriteriaScore.score, func.count(UserPinkCriteriaScore.score).label("count")).group_by(UserPinkCriteriaScore.criteria_id, UserPinkCriteriaScore.score).order_by(UserPinkCriteriaScore.score, desc("count")).all()
    header_score_avg = UserPinkHeaderScore.query.with_entities(UserPinkHeaderScore.criteria_header_id, func.avg(UserPinkHeaderScore.score)).group_by(UserPinkHeaderScore.criteria_header_id).all()
    csf = defaultdict(dict)
    hsa = defaultdict(dict)
    for criteria_id, score, count in criteria_score_frequency:
        csf[score][criteria[criteria_id-1].name] = count

    for header_id, score in header_score_avg:
        hsa[headers[header_id-1].name] = round((score / len(headers[header_id-1].criteria)) * 100, 0)


    return jsonify({"stats": {"criteriaScoreFrequency": dict(csf), "headerScoreAvg": dict(hsa)}})


@pink.route("/user/<user_id>/create", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_create(user_id):
    pink_data = request.json
    sections = pink_data.pop("sections")

    user_pink = UserPink(user_id=user_id,
                         pink_version_id=pink_data["version"]["id"],
                         authorisation_exercise=pink_data["authorisationExercise"],
                         assessor_id=pink_data["assessor"]["id"],
                         brief_task_description=pink_data["briefTaskDescription"],
                         task_number=pink_data["taskNumber"],
                         score=pink_data["score"],
                         passed=pink_data["passed"])

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

    return jsonify(
        {"msg": {"text": f"Pink submitted successfully to {pink_data['operator']['serviceNumber']}", "type": "success"}})


@pink.route("/pink/<pink_id>/edit", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_edit(pink_id):
    pink_data = request.json
    sections = pink_data.pop("sections")

    user_pink = UserPink.query.filter_by(id=pink_id).one()

    if user_pink.brief_task_description != pink_data["briefTaskDescription"]:
        user_pink.brief_task_description = pink_data["briefTaskDescription"]

    if user_pink.task_number != pink_data["taskNumber"]:
        user_pink.task_number = pink_data["taskNumber"]

    if user_pink.score != pink_data["score"]:
        user_pink.score = pink_data["score"]

    if user_pink.passed != pink_data["passed"]:
        user_pink.passed = pink_data["passed"]

    for header, header_info in sections.items():
        saved_header = UserPinkHeaderScore.query.filter_by(user_pink_id=pink_data["id"],
                                                           criteria_header_id=header_info["id"]).one()
        saved_header_score = saved_header.score
        new_header_score = header_info["score"]

        if saved_header_score != new_header_score:
            saved_header.score = new_header_score

        for criteria, criteria_info in header_info["criteriaGroup"].items():
            saved_criteria = UserPinkCriteriaScore.query.filter_by(user_pink_id=pink_data["id"],
                                                                   criteria_id=criteria_info["id"]).one()
            saved_criteria_score = abs(saved_criteria.score)
            new_criteria_score = criteria_info["score"]

            if saved_criteria_score != new_criteria_score:
                saved_criteria.score = new_criteria_score

    db.session.commit()


@pink.route("/validation/<validation_title>/user/<user_id>/blank-pink", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_blank(validation_title, user_id):
    operator = User.query.filter_by(id=user_id).one()
    pink_version = PinkVersion.query.filter(PinkVersion.name.contains(operator.assessment_type)) \
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

    response = {"authorisationExercise": validation_title,
                "operator": {"id": operator.id, "serviceNumber": operator.service_number},
                "assessor": {"id": current_user.id, "serviceNumber": current_user.service_number},
                "briefTaskDescription": "", "taskNumber": "",
                "version": {"name": pink_version.name, "id": pink_version.id},
                "totalScore": pink_version.total_score,
                "score": 0,
                "passed": True,
                "ready": False,
                "sections": sections}

    return jsonify(response)


@pink.route("/validation/<validation_title>/user/<user_id>/read", methods=["POST"])
@jwt_required(locations=["cookies"])
def user_pinks_by_validation(validation_title, user_id):
    response = []

    user_pink = UserPink.query.filter_by(user_id=user_id,
                                         authorisation_exercise=validation_title).all()

    for pink in user_pink:
        temp = {"id": pink.id, "taskNumber": pink.task_number, "assessor": pink.assessor.service_number,
                "briefTaskDescription": pink.brief_task_description}
        response.append(temp)

    return jsonify(response)


@pink.route("/pink/<pink_id>/read", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_by_id(pink_id):

    user_pink = UserPink.query.filter_by(id=pink_id).one()
    
    if user_pink.operator.service_number == current_user.service_number or user_pink.assessor.service_number == current_user.service_number:
        sections = {}
        header_ids = []
    
        for criteria in user_pink.pink_version.criteria:
            if criteria.header.id not in header_ids:
                header_ids.append(criteria.header.id)
                sections[criteria.header.name] = {"index": len(header_ids) - 1,
                                                  "id": criteria.header.id,
                                                  "passed": True,
                                                  "score": user_pink.header_scores[criteria.header.id - 1].score,
                                                  "criteriaGroup": {}}
    
            sections[criteria.header.name]["criteriaGroup"][criteria.name] = {"id": criteria.id,
                                                                              "safety": criteria.safety,
                                                                              "score": user_pink.criteria_scores[
                                                                                  criteria.id - 1].score}
    
        response = {"authorisationExercise": user_pink.authorisation_exercise,
                    "operator": {"id": user_pink.operator.id, "serviceNumber": user_pink.operator.service_number},
                    "assessor": {"id": user_pink.assessor.id, "serviceNumber": user_pink.assessor.service_number},
                    "briefTaskDescription": user_pink.brief_task_description, "taskNumber": user_pink.task_number,
                    "version": {"name": user_pink.pink_version.name, "id": user_pink.pink_version.id},
                    "totalScore": user_pink.pink_version.total_score,
                    "score": user_pink.score,
                    "passed": user_pink.passed,
                    "ready": False,
                    "sections": sections}
    
        return jsonify(response)
    
    else:
        return jsonify("You are trying to open a pink that does not belong to you or that you are not the assessor of!")
