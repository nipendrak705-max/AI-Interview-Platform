from pydantic import BaseModel


class InterviewResult(BaseModel):
    score: float
    feedback: str