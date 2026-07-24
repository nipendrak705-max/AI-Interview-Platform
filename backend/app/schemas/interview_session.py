from pydantic import BaseModel

class InterviewSession(BaseModel):
    interview_id: int
    skills: list[str]
    questions: list[str]