from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class Candidate(Base):

    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

    resume = Column(String, nullable=True)

    interviews = relationship(
        "Interview",
        back_populates="candidate"
    )

    sessions = relationship(
        "InterviewSession",
        back_populates="candidate"
    )