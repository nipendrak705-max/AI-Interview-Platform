from pydantic import BaseModel


class ResumeResponse(BaseModel):
    filename: str
    message: str