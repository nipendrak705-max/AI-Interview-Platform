import json
from sqlalchemy.orm import Session

from app.database.interview_session_model import InterviewSession


def create_session(
    db: Session,
    candidate_id: int,
    skills: list,
    questions: list
):
    session = InterviewSession(
        candidate_id=candidate_id,
        skills=json.dumps(skills),
        questions=json.dumps(questions)
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session