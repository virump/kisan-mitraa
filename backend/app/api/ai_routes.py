from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List
import uuid

from app.database.connection import get_db
from app.models.models import ChatHistory, User
from app.schemas.schemas import AIChatRequest, AIChatResponse, AIDiagnoseResponse
from app.services.ai_service import ask_kisan_ai, diagnose_crop_image
from app.auth.jwt import get_optional_current_user

router = APIRouter(prefix="/api/ai", tags=["Kisan AI Assistant & Image Diagnosis"])

@router.post("/chat", response_model=AIChatResponse)
def chat_with_kisan_ai(
    payload: AIChatRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    conv_id = payload.conversation_id or str(uuid.uuid4())
    result = ask_kisan_ai(
        query=payload.message,
        language=payload.language or "en",
        conversation_id=conv_id
    )

    # Save to chat history if user or session exists
    try:
        user_msg = ChatHistory(
            user_id=current_user.id if current_user else None,
            conversation_id=conv_id,
            role="user",
            message=payload.message,
            language=payload.language or "en"
        )
        ai_msg = ChatHistory(
            user_id=current_user.id if current_user else None,
            conversation_id=conv_id,
            role="assistant",
            message=result["response"],
            language=result["language"]
        )
        db.add(user_msg)
        db.add(ai_msg)
        db.commit()
    except Exception:
        db.rollback()

    return result

@router.post("/diagnose", response_model=AIDiagnoseResponse)
async def diagnose_crop(
    file: Optional[UploadFile] = File(None),
    crop_name: Optional[str] = Form(None)
):
    filename = file.filename if file else ""
    return diagnose_crop_image(filename=filename, crop_hint=crop_name)

@router.get("/history")
def get_chat_history(
    conversation_id: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    if not current_user and not conversation_id:
        return []

    query = db.query(ChatHistory)
    if conversation_id:
        query = query.filter(ChatHistory.conversation_id == conversation_id)
    elif current_user:
        query = query.filter(ChatHistory.user_id == current_user.id)

    records = query.order_by(ChatHistory.created_at.asc()).limit(50).all()
    return [
        {
            "id": r.id,
            "role": r.role,
            "message": r.message,
            "language": r.language,
            "created_at": r.created_at
        }
        for r in records
    ]
