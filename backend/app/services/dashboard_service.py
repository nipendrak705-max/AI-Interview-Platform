from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.interview_session_model import InterviewSession
from app.database.interview_answer_model import InterviewAnswer


def get_dashboard_data(db: Session, candidate_id: int):

    sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.candidate_id == candidate_id)
        .all()
    )

    total_interviews = len(sessions)

    avg_score = (
        db.query(func.avg(InterviewAnswer.score))
        .join(
            InterviewSession,
            InterviewAnswer.session_id == InterviewSession.id
        )
        .filter(
            InterviewSession.candidate_id == candidate_id
        )
        .scalar()
    )

    if avg_score is None:
        avg_score = 0

    total_answers = (
        db.query(InterviewAnswer)
        .join(
            InterviewSession,
            InterviewAnswer.session_id == InterviewSession.id
        )
        .filter(
            InterviewSession.candidate_id == candidate_id
        )
        .count()
    )

    return {
        "total_interviews": total_interviews,
        "average_score": round(avg_score, 2),
        "total_answers": total_answers
    }