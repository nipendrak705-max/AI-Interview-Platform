from sqlalchemy.orm import Session
from app.database.interview_model import Interview


def save_interview(db: Session, candidate_id: int, score: float, feedback: str):

    interview = Interview(
        candidate_id=candidate_id,
        score=score,
        feedback=feedback
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview


def get_my_interviews(db: Session, candidate_id: int):

    return (
        db.query(Interview)
        .filter(Interview.candidate_id == candidate_id)
        .all()
    )