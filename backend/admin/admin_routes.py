from fastapi import APIRouter

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/dashboard")
def admin_dashboard():
    return {
        "total_users": 45,
        "total_interviews": 320,
        "average_score": 8.4,
        "recent_users": []
    }