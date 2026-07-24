from pydantic import BaseModel

class SkillRequest(BaseModel):
    skills: list[str]