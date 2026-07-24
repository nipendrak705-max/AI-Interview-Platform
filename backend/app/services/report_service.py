from sqlalchemy.orm import Session

from app.database.interview_session_model import InterviewSession
from app.database.interview_answer_model import InterviewAnswer


def get_interview_report(
    db: Session,
    session_id: int
):

    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if session is None:
        return None

    answers = (
        db.query(InterviewAnswer)
        .filter(InterviewAnswer.session_id == session_id)
        .order_by(InterviewAnswer.question_number)
        .all()
    )

    total_score = sum(answer.score for answer in answers)

    average_score = (
        total_score / len(answers)
        if answers else 0
    )

    answer_list = []

    for answer in answers:

        answer_list.append({
            "id": answer.id,
            "question_number": answer.question_number,
            "question": answer.question,
            "answer": answer.answer,
            "score": answer.score,
            "feedback": answer.feedback
        })

    return {
        "session_id": session.id,
        "candidate_id": session.candidate_id,
        "skills": session.skills,
        "average_score": round(average_score, 2),
        "total_questions": len(answers),
        "answers": answer_list
    }