from pydantic import BaseModel, EmailStr


class Candidate(BaseModel):
    name: str
    email: EmailStr
    password: str