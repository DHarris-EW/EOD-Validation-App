from collections import defaultdict

import nltk
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from nltk import BigramCollocationFinder, TrigramCollocationFinder
from sqlalchemy import func

from ..models import User, UserPinkECM, UserPinkEOD, Criteria, Section, UserPinkEODSection, UserPinkEODCriteria, \
    UserPinkECMCriteria, UserPinkECMSection

portal = Blueprint("portal", __name__, url_prefix="/portal-management")


@portal.route("/user/<user_id>/portal", methods=["POST"])
@jwt_required(locations=["cookies"])
def user_portal(user_id):
    response = []
    user = User.query.filter_by(id=user_id).one_or_none()
    user_pinks = ""
    if "ECM" in user.job_role:
        user_pinks = UserPinkECM.query.filter_by(user_id=user_id).all()
    elif "EOD" in user.job_role:
        user_pinks = UserPinkEOD.query.filter_by(user_id=user_id).all()
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

    return jsonify(
        {"operator": {"id": user.id, "name": user.name, "serviceNumber": user.service_number}, "pinks": response,
         "passed": pinks_passed, "failed": pinks_failed, "total": len(user_pinks)})


@portal.route("/user/<userID>/admin-portal", methods=["POST"])
@jwt_required(locations=["cookies"])
def admin_portal(userID):
    if request.data:
        print(request.json)

    criteria = Criteria.query.all()
    sections = Section.query.all()

    # criteria_score_frequency = UserPinkCriteria.query.with_entities(UserPinkCriteria.criteria_id,
    #                                                                 UserPinkCriteria.score,
    #                                                                 func.count(UserPinkCriteria.score).label(
    #                                                                     "count")).group_by(UserPinkCriteria.criteria_id,
    #                                                                                        UserPinkCriteria.score).order_by(
    #     UserPinkCriteria.score, desc("count")).all()

    section_score_avg = ""
    criteria_score_avg = ""

    all_job_roles = ["ECM", "EOD"]
    trends = {}

    for role in all_job_roles:

        if role == "EOD":
            section_score_avg = UserPinkEODSection.query.with_entities(UserPinkEODSection.section_id,
                                                                       func.avg(UserPinkEODSection.score)).group_by(
                                                                       UserPinkEODSection.section_id).all()

            criteria_score_avg = UserPinkEODCriteria.query.with_entities(UserPinkEODCriteria.criteria_id,
                                                                         func.avg(UserPinkEODCriteria.score),
                                                                         func.count(UserPinkEODCriteria.criteria_id)
                                                                         ).group_by(UserPinkEODCriteria.criteria_id).all()

            p_list = [data[0] for data in UserPinkEODSection.query.with_entities(UserPinkEODSection.performance_comments).all()]

        elif role == "ECM":
            section_score_avg = UserPinkECMSection.query.with_entities(UserPinkECMSection.section_id,
                                                                       func.avg(UserPinkECMSection.score)).group_by(
                                                                       UserPinkECMSection.section_id).all()

            criteria_score_avg = UserPinkECMCriteria.query.with_entities(UserPinkECMCriteria.criteria_id,
                                                                         func.avg(UserPinkECMCriteria.score)
                                                                         ).group_by(UserPinkECMCriteria.criteria_id).all()

        csa = defaultdict(dict)
        ssa = defaultdict(dict)

        for criteria_id, score, count in criteria_score_avg:
            for criteria_data in criteria:
                if criteria_data.id == criteria_id:
                    for section in criteria_data.section:
                        csa[section.name][criteria_data.name] = round((score / count) * 100, 0)

        for section_id, score in section_score_avg:
            for section_data in sections:
                if section_data.id == section_id:
                    print(len(csa[section_data.name]))
                    ssa[section_data.name] = round((score / len(csa[section_data.name])) * 100, 0)

        trends[role] = {"criteriaAverage": dict(csa), "sectionScoreAverage": dict(ssa)}

    ngram_list = []
    bigram_measures = nltk.collocations.BigramAssocMeasures()
    trigram_measures = nltk.collocations.TrigramAssocMeasures()

    text = "This was a very average result. Needs to work on talking. Could do better, more time needds to be spent on questioning. poor questioning techniques. needs to work on talking more time on planning. Need to ask more in depth questioning. More team involvment needed. need to ask more questions." \
           "lacking control over team. needs to consider using ASH more. very basic threat search. need to work on making a clear assessment. To slow to ask questions at the start. Hesitated when asking crucial questions. bad questioning. poor questioning. more team involvment needed. lacking bacic knowledge" \
           "poor area search. needs to spend more time on area search. did not do an ecm plan. ecm plan was weak. looking at ds. ds watching. not paying attention. needs to pay more attention to detail. kept looking at ds. ds watching"
    tokens = nltk.wordpunct_tokenize(text)

    finder = TrigramCollocationFinder.from_words(tokens)

    finder.apply_freq_filter(2)
    finder.apply_word_filter(lambda w: len(w) < 2)

    for trigram in finder.nbest(trigram_measures.pmi, 10):
        ngram_list.append(" ".join(trigram).capitalize())

    finder = BigramCollocationFinder.from_words(tokens)

    finder.apply_freq_filter(2)
    finder.apply_word_filter(lambda w: len(w) < 2)

    for bigram in finder.nbest(bigram_measures.pmi, 10):
        ngram_list.append(" ".join(bigram).capitalize())

    return jsonify({"trends": trends, "performanceTrends": ngram_list})
