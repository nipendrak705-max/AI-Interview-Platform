from fastapi import APIRouter
from app.schemas.candidate import Candidate

router = APIRouter()


@router.post("/register")
def register(candidate: Candidate):

    return {
        "message": "Registration Successful",
        "candidate": {
            "name": candidate.name,
            "email": candidate.email
        }
    }