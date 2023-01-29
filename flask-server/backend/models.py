from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# VALIDATION

class Validation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    date_from = db.Column(db.String(15), nullable=False)
    date_to = db.Column(db.String(15), nullable=False)
    teams = db.relationship("Team", back_populates="validation")


# PINK

class UserPinkECMCriteria(db.Model):
    user_pink_id = db.Column(db.Integer, db.ForeignKey("user_pink_ecm.id"), nullable=False, primary_key=True)
    pink = db.relationship("UserPinkECM", back_populates="criteria")
    criteria_id = db.Column(db.Integer, db.ForeignKey("criteria.id"), nullable=False, primary_key=True)
    score = db.Column(db.Float, nullable=False)


class UserPinkECMSection(db.Model):
    user_pink_id = db.Column(db.Integer, db.ForeignKey("user_pink_ecm.id"), nullable=False, primary_key=True)
    pink = db.relationship("UserPinkECM", back_populates="sections")
    section_id = db.Column(db.Integer, db.ForeignKey("section.id"), nullable=False, primary_key=True)
    score = db.Column(db.Float, nullable=False)
    performance_comments = db.Column(db.String(250), nullable=False)
    percentage_adjustment = db.Column(db.Float, nullable=False)


class UserPinkEODCriteria(db.Model):
    user_pink_id = db.Column(db.Integer, db.ForeignKey("user_pink_eod.id"), nullable=False, primary_key=True)
    pink = db.relationship("UserPinkEOD", back_populates="criteria")
    criteria_id = db.Column(db.Integer, db.ForeignKey("criteria.id"), nullable=False, primary_key=True)
    score = db.Column(db.Float, nullable=False)


class UserPinkEODSection(db.Model):
    user_pink_id = db.Column(db.Integer, db.ForeignKey("user_pink_eod.id"), nullable=False, primary_key=True)
    pink = db.relationship("UserPinkEOD", back_populates="sections")
    section_id = db.Column(db.Integer, db.ForeignKey("section.id"), nullable=False, primary_key=True)
    score = db.Column(db.Float, nullable=False)
    performance_comments = db.Column(db.String(250), nullable=False)
    percentage_adjustment = db.Column(db.Float, nullable=False)


class UserPinkECM(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    pink_version_id = db.Column(db.Integer, db.ForeignKey("pink_version.id"), nullable=False)
    authorisation_exercise = db.Column(db.String(50), nullable=False)
    assessor_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    brief_task_description = db.Column(db.String(100), nullable=False)
    task_number = db.Column(db.String(50), nullable=False)
    assessment_number = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    passed = db.Column(db.Boolean, nullable=False)
    operator = db.relationship("User", foreign_keys=[user_id])
    assessor = db.relationship("User", foreign_keys=[assessor_id])
    pink_version = db.relationship("PinkVersion")
    criteria = db.relationship("UserPinkECMCriteria", back_populates="pink")
    sections = db.relationship("UserPinkECMSection", back_populates="pink")


class UserPinkEOD(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    pink_version_id = db.Column(db.Integer, db.ForeignKey("pink_version.id"), nullable=False)
    authorisation_exercise = db.Column(db.String(50), nullable=False)
    assessor_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    brief_task_description = db.Column(db.String(100), nullable=False)
    task_number = db.Column(db.String(50), nullable=False)
    assessment_number = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    time_of_arrival = db.Column(db.String(25), nullable=False)
    time_of_action = db.Column(db.String(25), nullable=False)
    subjective_score = db.Column(db.String(25), nullable=False)
    re_score = db.Column(db.String(25), nullable=False)
    passed = db.Column(db.Boolean, nullable=False)
    operator = db.relationship("User", foreign_keys=[user_id])
    assessor = db.relationship("User", foreign_keys=[assessor_id])
    pink_version = db.relationship("PinkVersion")
    criteria = db.relationship("UserPinkEODCriteria", back_populates="pink")
    sections = db.relationship("UserPinkEODSection", back_populates="pink")


pink_criteria = db.Table(
    "pink_criteria",
    db.Column("pink_version_id", db.Integer, db.ForeignKey("pink_version.id"), nullable=False),
    db.Column("criteria_id", db.Integer, db.ForeignKey("criteria.id"), nullable=False)
)

criteria_section = db.Table(
    "criteria_section",
    db.Column("criteria_id", db.Integer, db.ForeignKey("criteria.id"), nullable=False),
    db.Column("section_id", db.Integer, db.ForeignKey("section.id"), nullable=False)
)


class PinkVersion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    criteria = db.relationship("Criteria", secondary=pink_criteria, back_populates="pink_version")


class Criteria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    safety = db.Column(db.Boolean, nullable=False)
    section = db.relationship("Section", secondary=criteria_section, back_populates="criteria")
    pink_version = db.relationship("PinkVersion", secondary=pink_criteria, back_populates="criteria")


class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    criteria = db.relationship("Criteria", secondary=criteria_section, back_populates="section")


# USER

user_teams = db.Table(
    "user_teams",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("team_id", db.Integer, db.ForeignKey("team.id"))
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_number = db.Column(db.String(8), unique=True, nullable=False)
    name = db.Column(db.String(15), nullable=False)
    job_role = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(15), nullable=False)
    is_admin = db.Column(db.Boolean(), nullable=False)
    is_ds = db.Column(db.Boolean(), nullable=False)
    teams = db.relationship("Team", secondary=user_teams, back_populates="users")


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_num = db.Column(db.Integer, nullable=False)
    validation_id = db.Column(db.Integer, db.ForeignKey("validation.id"), nullable=False)
    validation = db.relationship("Validation", back_populates="teams")
    users = db.relationship("User", secondary=user_teams, back_populates="teams")
