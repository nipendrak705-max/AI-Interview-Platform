from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database.database import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id")
    )

    skills = Column(Text)
    questions = Column(Text)

    candidate = relationship(
        "Candidate",
        back_populates="sessions"
    )
    answers = relationship(
    "InterviewAnswer",
    back_populates="session"
)