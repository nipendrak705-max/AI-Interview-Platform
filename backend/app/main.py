from admin.admin_routes import router as admin_router
import re
import json

from app.services.report_service import get_interview_report
from app.schemas.submit_answer import SubmitAnswer
from app.services.answer_service import (
    save_answer,
    calculate_average_score
)
from app.database.interview_session_model import InterviewSession
from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import shutil
import os

from app.database.database import engine, Base
from app.database.deps import get_db
from app.database.models import Candidate

from app.schemas.login import Login
from app.schemas.questions import SkillRequest
from app.schemas.answer import AnswerRequest
from app.schemas.interview_result import InterviewResult
from app.services.dashboard_service import get_dashboard_data

from app.auth.auth import get_current_user

from app.services.candidate_service import (
    create_candidate,
    login_candidate
)

from app.services.interview_service import (
    save_interview,
    get_my_interviews
)
from app.services.session_service import create_session

from app.ai.gemini_service import (
    generate_questions,
    evaluate_answer
)

from app.resume.resume_parser import extract_text
from app.resume.skill_extractor import extract_skills

from app.utils.jwt_handler import create_access_token


Base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-interview-platform-dlvk.vercel.app",
        "https://ai-interview-platform-ten-tan.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


class CandidateCreate(BaseModel):
    name: str
    email: str
    password: str


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Interview Platform"
    }


@app.post("/register")
def register(user: CandidateCreate, db: Session = Depends(get_db)):

    candidate = create_candidate(
        db=db,
        name=user.name,
        email=user.email,
        password=user.password
    )

    if candidate is None:
        return {
            "message": "Email already registered"
        }

    return {
        "message": "User Registered Successfully",
        "candidate": {
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email
        }
    }


@app.post("/login")
def login(user: Login, db: Session = Depends(get_db)):

    candidate = login_candidate(
        db=db,
        email=user.email,
        password=user.password
    )

    if candidate is None:
        return {
            "message": "Email not registered"
        }

    if candidate is False:
        return {
            "message": "Incorrect password"
        }

    access_token = create_access_token(
        data={
            "sub": candidate.email
        }
    )

    return {
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "bearer",
        "candidate": {
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email
        }
    }


@app.get("/profile")
def profile(current_user: Candidate = Depends(get_current_user)):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }


@app.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    current_user: Candidate = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{current_user.id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text(file_path)

    skills = extract_skills(resume_text)

    questions = generate_questions(skills)

    
    session = create_session(
    db=db,
    candidate_id=current_user.id,
    skills=skills,
    questions=questions
)

    current_user.resume = file_path

    db.commit()

    return {
    "message": "Interview Started",
    "interview_id": session.id,
    "filename": file.filename,
    "skills": skills,
    "questions": questions
}


@app.post("/generate-questions")
def generate(skill_request: SkillRequest):

    questions = generate_questions(skill_request.skills)

    return {
        "skills": skill_request.skills,
        "questions": questions
    }


@app.post("/evaluate-answer")
def evaluate(request: AnswerRequest):

    result = evaluate_answer(
        request.question,
        request.answer
    )

    return {
        "evaluation": result
    }


@app.post("/save-interview")
def save_result(
    result: InterviewResult,
    current_user: Candidate = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    interview = save_interview(
        db=db,
        candidate_id=current_user.id,
        score=result.score,
        feedback=result.feedback
    )

    return {
        "message": "Interview Saved Successfully",
        "interview_id": interview.id
    }


@app.get("/my-interviews")
def my_interviews(
    current_user: Candidate = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    interviews = get_my_interviews(
        db=db,
        candidate_id=current_user.id
    )

    return interviews
@app.post("/submit-answer")
def submit_answer(
    request: SubmitAnswer,
    db: Session = Depends(get_db)
):

    session = db.query(InterviewSession).filter(
        InterviewSession.id == request.session_id
    ).first()

    if session is None:
        return {
            "message": "Interview session not found"
        }

    evaluation = evaluate_answer(
        request.question,
        request.answer
    )

    match = re.search(r"Score:\s*(\d+(\.\d+)?)", evaluation)

    score = float(match.group(1)) if match else 0.0

    save_answer(
        db=db,
        session_id=request.session_id,
        question_number=request.question_number,
        question=request.question,
        answer=request.answer,
        score=score,
        feedback=evaluation
    )

    questions = json.loads(session.questions)

    # Interview is still in progress
    if request.question_number < len(questions):
        return {
            "message": "Answer Saved",
            "next_question": request.question_number + 1,
            "last_answer_score": score,
            "last_feedback": evaluation
        }

    # Interview completed
    average = calculate_average_score(
        db,
        request.session_id
    )

    return {
        "message": "Interview Completed",
        "total_questions": len(questions),
        "average_score": average,
        "last_answer_score": score,
        "last_feedback": evaluation
    }
@app.get("/interview-report/{session_id}")
def interview_report(
    session_id: int,
    db: Session = Depends(get_db)
):

    report = get_interview_report(
        db=db,
        session_id=session_id
    )

    if report is None:
        return {
            "message": "Interview report not found"
        }

    return report
@app.get("/dashboard")
def dashboard(
    current_user: Candidate = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_dashboard_data(
        db,
        current_user.id
    )

app.include_router(admin_router)