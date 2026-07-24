from sqlalchemy import Column, Integer, ForeignKey, Float, Text
from sqlalchemy.orm import relationship

from app.database.database import Base


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id")
    )

    question_number = Column(Integer)

    question = Column(Text)

    answer = Column(Text)

    score = Column(Float)

    feedback = Column(Text)

    session = relationship(
        "InterviewSession",
        back_populates="answers"
    )