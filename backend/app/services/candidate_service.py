from sqlalchemy.orm import Session

from app.database.models import Candidate
from app.utils.password import hash_password, verify_password


def create_candidate(db: Session, name: str, email: str, password: str):

    # Check if email already exists
    existing_user = db.query(Candidate).filter(
        Candidate.email == email
    ).first()

    if existing_user:
        return None

    # Create new candidate
    candidate = Candidate(
        name=name,
        email=email,
        password=hash_password(password)
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return candidate


def login_candidate(db: Session, email: str, password: str):

    candidate = db.query(Candidate).filter(
        Candidate.email == email
    ).first()

    if candidate is None:
        return None

    if not verify_password(password, candidate.password):
        return False

    return candidate