from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.interview_answer_model import InterviewAnswer


def save_answer(
    db: Session,
    session_id: int,
    question_number: int,
    question: str,
    answer: str,
    score: float,
    feedback: str
):
    obj = InterviewAnswer(
        session_id=session_id,
        question_number=question_number,
        question=question,
        answer=answer,
        score=score,
        feedback=feedback
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    return obj


def calculate_average_score(
    db: Session,
    session_id: int
):
    average = db.query(
        func.avg(InterviewAnswer.score)
    ).filter(
        InterviewAnswer.session_id == session_id
    ).scalar()

    if average is None:
        return 0.0

    return round(float(average), 2)