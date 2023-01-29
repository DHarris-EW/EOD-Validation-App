from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user

from ..models import User, PinkVersion, UserPinkECM, UserPinkEOD, db, UserPinkECMSection, UserPinkEODSection, \
    UserPinkECMCriteria, UserPinkEODCriteria, Validation

pink = Blueprint("pink", __name__, url_prefix="/pink-management")


@pink.route("/user/<user_id>/create", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_create(user_id):
    pink_data = request.json
    sections = pink_data.pop("sections")
    user_pink = ""

    if "ECM" in pink_data["version"]["name"]:
        user_pink = UserPinkECM(user_id=user_id,
                                pink_version_id=pink_data["version"]["id"],
                                authorisation_exercise=pink_data["authorisationExercise"],
                                assessor_id=pink_data["assessor"]["id"],
                                brief_task_description=pink_data["briefTaskDescription"],
                                task_number=pink_data["taskNumber"],
                                assessment_number=pink_data["assessmentNumber"],
                                score=pink_data["score"],
                                passed=pink_data["passed"])
    elif "EOD" in pink_data["version"]["name"]:
        re_score = ""
        try:
            re_score = pink_data["reScore"]
        except KeyError:
            re_score = ""
        user_pink = UserPinkEOD(user_id=user_id,
                                pink_version_id=pink_data["version"]["id"],
                                authorisation_exercise=pink_data["authorisationExercise"],
                                assessor_id=pink_data["assessor"]["id"],
                                brief_task_description=pink_data["briefTaskDescription"],
                                task_number=pink_data["taskNumber"],
                                assessment_number=pink_data["assessmentNumber"],
                                score=pink_data["score"],
                                passed=pink_data["passed"],
                                time_of_arrival=pink_data["timeOfArrival"],
                                time_of_action=pink_data["timeOfFirstEODAction"],
                                subjective_score=pink_data["subjectiveScore"],
                                re_score=re_score)

    db.session.add(user_pink)
    db.session.flush()

    criteria_list = {}
    for sectionName, section_data in sections.items():
        ups = ""
        if "ECM" in pink_data["version"]["name"]:
            ups = UserPinkECMSection(user_pink_id=user_pink.id,
                                     section_id=section_data["id"],
                                     score=section_data["score"],
                                     performance_comments=section_data["performanceComments"],
                                     percentage_adjustment=section_data["percentageAdjustment"])

        elif "EOD" in pink_data["version"]["name"]:
            ups = UserPinkEODSection(user_pink_id=user_pink.id,
                                     section_id=section_data["id"],
                                     score=section_data["score"],
                                     performance_comments=section_data["performanceComments"],
                                     percentage_adjustment=section_data["percentageAdjustment"])
        db.session.add(ups)

        for criteria, criteria_info in section_data["criteriaGroup"].items():
            upc = ""
            if (criteria in criteria_list.keys() and criteria_info["score"] != criteria_list[criteria]) or (
                    criteria not in criteria_list.keys()):
                criteria_list[criteria] = criteria_info["score"]
                if "ECM" in pink_data["version"]["name"]:
                    upc = UserPinkECMCriteria(user_pink_id=user_pink.id,
                                              criteria_id=criteria_info["id"],
                                              score=criteria_info["score"])

                elif "EOD" in pink_data["version"]["name"]:
                    upc = UserPinkEODCriteria(user_pink_id=user_pink.id,
                                              criteria_id=criteria_info["id"],
                                              score=criteria_info["score"])
                db.session.add(upc)

    db.session.commit()

    return jsonify(
        {"msg": {"text": f"Pink submitted successfully to {pink_data['operator']['serviceNumber']}",
                 "type": "success"}})


@pink.route("/pink/<pink_id>/read", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_by_id(pink_id):
    user_pink = ""

    if "ECM" in current_user.job_role:
        user_pink = UserPinkECM.query.filter_by(id=pink_id).one()
    elif "EOD" in current_user.job_role:
        user_pink = UserPinkEOD.query.filter_by(id=pink_id).one()

    if user_pink.user_id == current_user.id or user_pink.assessor_id == current_user.id:
        sections = {}
        header_ids = []
        for i, criteria in enumerate(user_pink.pink_version.criteria):

            for j, section in enumerate(criteria.section):

                if section.id not in header_ids:
                    header_ids.append(section.id)

                    sections[section.name] = {"index": len(header_ids) - 1,
                                              "id": section.id,
                                              "passed": True,
                                              "score": user_pink.sections[len(header_ids) - 1].score,
                                              "percentageAdjustment": user_pink.sections[
                                                  len(header_ids) - 1].percentage_adjustment,
                                              "performanceComments": user_pink.sections[
                                                  len(header_ids) - 1].performance_comments,
                                              "criteriaGroup": {}}

                sections[section.name]["criteriaGroup"][criteria.name] = {"id": criteria.id,
                                                                          "safety": criteria.safety,
                                                                          "score": user_pink.criteria[i].score}

        generic_pink_headers = {"authorisationExercise": user_pink.authorisation_exercise,
                                "operator": {"id": user_pink.operator.id,
                                             "serviceNumber": user_pink.operator.service_number},
                                "assessor": {"id": user_pink.assessor.id,
                                             "serviceNumber": user_pink.assessor.service_number},
                                "briefTaskDescription": user_pink.brief_task_description,
                                "taskNumber": user_pink.task_number,
                                "version": {"name": user_pink.pink_version.name, "id": user_pink.pink_version.id},
                                "assessmentNumber": user_pink.assessment_number,
                                "totalScore": user_pink.pink_version.total_score,
                                "score": user_pink.score,
                                "passed": user_pink.passed,
                                "ready": False,
                                "sections": sections}

        additional_eod_headers = {}
        if "EOD" in current_user.job_role:
            additional_eod_headers = {"timeOfArrival": user_pink.time_of_arrival,
                                      "timeOfFirstEODAction": user_pink.time_of_action,
                                      "subjectiveScore": user_pink.subjective_score,
                                      "reScore": user_pink.re_score}

        response = {**generic_pink_headers, **additional_eod_headers}

        return jsonify(response)

    else:
        return jsonify("You are trying to open a pink that does not belong to you or that you are not the assessor of!")


@pink.route("/pink/<pink_id>/edit", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_edit(pink_id):
    pink_data = request.json
    sections = pink_data.pop("sections")
    user_pink = ""

    if "ECM" in current_user.job_role:
        user_pink = UserPinkECM.query.filter_by(id=pink_id).one()

        if user_pink.time_of_arrival != pink_data["timeOfArrival"]:
            user_pink.time_of_arrival = pink_data["timeOfArrival"]

        if user_pink.time_of_action != pink_data["timeOfFirstEODAction"]:
            user_pink.time_of_action = pink_data["timeOfFirstEODAction"]

    elif "EOD" in current_user.job_role:
        user_pink = UserPinkEOD.query.filter_by(id=pink_id).one()

    if user_pink.brief_task_description != pink_data["briefTaskDescription"]:
        user_pink.brief_task_description = pink_data["briefTaskDescription"]

    if user_pink.task_number != pink_data["taskNumber"]:
        user_pink.task_number = pink_data["taskNumber"]

    if user_pink.score != pink_data["score"]:
        user_pink.score = pink_data["score"]

    if user_pink.passed != pink_data["passed"]:
        user_pink.passed = pink_data["passed"]

    for header, header_info in sections.items():
        saved_header = ""
        if "ECM" in current_user.job_role:
            saved_header = UserPinkECMSection.query.filter_by(user_pink_id=pink_id,
                                                              section_id=header_info["id"]).one()
        elif "EOD" in current_user.job_role:
            saved_header = UserPinkEODSection.query.filter_by(user_pink_id=pink_id,
                                                              section_id=header_info["id"]).one()
        saved_header_score = saved_header.score
        new_header_score = header_info["score"]

        if saved_header_score != new_header_score:
            saved_header.score = new_header_score

        if saved_header.performance_comments != header_info["performanceComments"]:
            saved_header.performance_comments = header_info["performanceComments"]

        if saved_header.percentage_adjustment != header_info["percentageAdjustment"]:
            saved_header.percentage_adjustment = header_info["percentageAdjustment"]

        for criteria, criteria_info in header_info["criteriaGroup"].items():
            saved_criteria = ""
            if "ECM" in current_user.job_role:
                saved_criteria = UserPinkECMCriteria.query.filter_by(user_pink_id=pink_id,
                                                                     criteria_id=criteria_info["id"]).one()
            elif "EOD" in current_user.job_role:
                saved_criteria = UserPinkEODCriteria.query.filter_by(user_pink_id=pink_id,
                                                                     criteria_id=criteria_info["id"]).one()
            saved_criteria_score = abs(saved_criteria.score)
            new_criteria_score = criteria_info["score"]

            if saved_criteria_score != new_criteria_score:
                saved_criteria.score = new_criteria_score

    db.session.commit()

    return jsonify({"msg": {"text": f"Pink edited successfully!", "type": "success"}})


@pink.route("/validation/<validation_id>/user/<user_id>/blank-pink", methods=["POST"])
@jwt_required(locations=["cookies"])
def pink_blank(validation_id, user_id):
    operator = User.query.filter_by(id=user_id).one()
    validation = Validation.query.filter_by(id=validation_id).one_or_none()
    pink_version = PinkVersion.query.filter(PinkVersion.name.contains(operator.job_role)) \
        .order_by(PinkVersion.id.desc()).first()

    sections = {}
    section_ids = []
    for criteria in pink_version.criteria:
        for section in criteria.section:
            if section.id not in section_ids:
                section_ids.append(section.id)
                sections[section.name] = {"index": len(section_ids) - 1,
                                          "id": section.id,
                                          "passed": True,
                                          "score": 0,
                                          "percentageAdjustment": 0,
                                          "performanceComments": "",
                                          "criteriaGroup": {}}

            sections[section.name]["criteriaGroup"][criteria.name] = {"id": criteria.id,
                                                                      "safety": criteria.safety,
                                                                      "score": 0}

    generic_pink_headers = {"authorisationExercise": validation.title,
                            "operator": {"id": operator.id, "serviceNumber": operator.service_number},
                            "assessor": {"id": current_user.id, "serviceNumber": current_user.service_number},
                            "briefTaskDescription": "",
                            "taskNumber": "",
                            "assessmentNumber": "",
                            "version": {"name": pink_version.name, "id": pink_version.id},
                            "totalScore": pink_version.total_score,
                            "score": 0,
                            "passed": True,
                            "ready": False,
                            "sections": sections}

    additional_eod_headers = {}
    if "EOD" in pink_version.name:
        additional_eod_headers = {"timeOfArrival": "",
                                  "timeOfFirstEODAction": ""}

    response = {**generic_pink_headers, **additional_eod_headers}

    return jsonify(response)


@pink.route("/validation/<validation_id>/user/<user_id>/read", methods=["POST"])
@jwt_required(locations=["cookies"])
def user_pinks_by_validation(validation_id, user_id):
    response = []
    user = User.query.filter_by(id=user_id).one_or_none()
    user_pink = ""

    if "ECM" in user.job_role:
        user_pink = UserPinkECM.query.filter_by(user_id=user_id,
                                                id=validation_id).all()
    elif "EOD" in user.job_role:
        user_pink = UserPinkEOD.query.filter_by(user_id=user_id,
                                                id=validation_id).all()

    for pink in user_pink:
        temp = {"id": pink.id, "taskNumber": pink.task_number, "assessor": pink.assessor.service_number,
                "briefTaskDescription": pink.brief_task_description, "version": user.job_role}
        response.append(temp)

    return jsonify(response)
