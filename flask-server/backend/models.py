from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


user_teams = db.Table(
    "user_teams",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("team_id", db.Integer, db.ForeignKey("team.id"))
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_number = db.Column(db.String(8), unique=True, nullable=False)
    name = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(15), nullable=False)
    is_admin = db.Column(db.Boolean(), nullable=False)
    teams = db.relationship("Team", secondary=user_teams, back_populates="users")
    pink_operator = db.relationship("UserPink", back_populates="operator", foreign_keys="UserPink.user_id")
    pink_assessor = db.relationship("UserPink", back_populates="assessor", foreign_keys="UserPink.assessor_id")


class Validation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(15), unique=True, nullable=False)
    date_from = db.Column(db.String(10), nullable=False)
    date_to = db.Column(db.String(10), nullable=False)
    teams = db.relationship("Team", back_populates="validation")


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_num = db.Column(db.Integer, nullable=False)
    validation_id = db.Column(db.Integer, db.ForeignKey("validation.id"), nullable=False)
    validation = db.relationship("Validation", back_populates="teams")
    users = db.relationship("User", secondary=user_teams, back_populates="teams")


class UserPinkCriteriaScore(db.Model):
    user_pink_id = db.Column(db.Integer, db.ForeignKey("user_pink.id"), nullable=False, primary_key=True)
    pink = db.relationship("UserPink", back_populates="criteria_scores")
    criteria_id = db.Column(db.Integer, db.ForeignKey("criteria.id"), nullable=False, primary_key=True)
    criteria = db.relationship("Criteria", back_populates="user_pink_criteria_score")
    score = db.Column(db.Float, nullable=False)


class UserPinkHeaderScore(db.Model):
    user_pink_id = db.Column(db.Integer, db.ForeignKey("user_pink.id"), nullable=False, primary_key=True)
    pink = db.relationship("UserPink", back_populates="header_scores")
    criteria_header_id = db.Column(db.Integer, db.ForeignKey("criteria_header.id"), nullable=False, primary_key=True)
    criteria_headers = db.relationship("CriteriaHeader", back_populates="user_pink_header_score")
    score = db.Column(db.Float, nullable=False)


class UserPink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    operator = db.relationship("User", foreign_keys=[user_id], back_populates="pink_operator")
    pink_version_id = db.Column(db.Integer, db.ForeignKey("pink_version.id"), nullable=False)
    authorisation_exercise = db.Column(db.String(50), nullable=False)
    assessor_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    assessor = db.relationship("User", foreign_keys=[assessor_id], back_populates="pink_assessor")
    brief_task_description = db.Column(db.String(100), nullable=False)
    task_number = db.Column(db.Integer, nullable=False)
    criteria_scores = db.relationship("UserPinkCriteriaScore", back_populates="pink")
    header_scores = db.relationship("UserPinkHeaderScore", back_populates="pink")
    score = db.Column(db.Integer, nullable=False)
    passed = db.Column(db.Boolean, nullable=False)


pink_criteria = db.Table(
    "pink_criteria",
    db.Column("pink_version_id", db.Integer, db.ForeignKey("pink_version.id"), nullable=False),
    db.Column("criteria_id", db.Integer, db.ForeignKey("criteria.id"), nullable=False)
)


class PinkVersion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15), unique=True, nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    criteria = db.relationship("Criteria", secondary=pink_criteria, back_populates="pink_version")


class Criteria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    safety = db.Column(db.Boolean, nullable=False)
    header_id = db.Column(db.Integer, db.ForeignKey("criteria_header.id"), nullable=False)
    header = db.relationship("CriteriaHeader", back_populates="criteria")
    user_pink_criteria_score = db.relationship("UserPinkCriteriaScore", back_populates="criteria")
    pink_version = db.relationship("PinkVersion", secondary=pink_criteria, back_populates="criteria")


class CriteriaHeader(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    user_pink_header_score = db.relationship("UserPinkHeaderScore", back_populates="criteria_headers")
    criteria = db.relationship("Criteria", back_populates="header")
