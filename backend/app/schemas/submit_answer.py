from pydantic import BaseModel


class SubmitAnswer(BaseModel):
    session_id: int
    question_number: int
    question: str
    answer: str