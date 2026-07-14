import os
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Letter
from app.schemas import (
    LetterCreated,
    VerifyRequest,
    OpenRequest,
    LetterStatus,
    LetterContent,
)
from app.services.encryption import encrypt_text, decrypt_text
from app.services.security import generate_secret_token, hash_value, verify_value
from app.services.email import send_unlock_email
from app.config import UPLOAD_DIR

router = APIRouter(prefix="/api/letters", tags=["letters"])

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("", response_model=LetterCreated)
async def create_letter(
    email: str = Form(...),
    content: str = Form(...),
    unlock_date: datetime = Form(...),
    password: str | None = Form(default=None),
    anonymous: bool = Form(default=False),
    author_name: str | None = Form(default=None),
    theme: str = Form(default="midnight"),
    language: str = Form(default="en"),
    title: str | None = Form(default=None),
    share_enabled: bool = Form(default=False),
    photo: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
):
    if unlock_date <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Unlock date must be in the future")

    photo_path = None
    if photo is not None and photo.filename:
        extension = os.path.splitext(photo.filename)[1]
        stored_name = f"{uuid.uuid4()}{extension}"
        destination = os.path.join(UPLOAD_DIR, stored_name)
        contents = await photo.read()
        with open(destination, "wb") as f:
            f.write(contents)
        photo_path = stored_name

    secret_token = generate_secret_token()

    letter = Letter(
        email=email,
        encrypted_content=encrypt_text(content),
        unlock_date=unlock_date,
        secret_token=secret_token,
        password_hash=hash_value(password) if password else None,
        anonymous=anonymous,
        author_name=None if anonymous else author_name,
        theme=theme,
        language=language,
        photo_path=photo_path,
        share_enabled=share_enabled,
        title=title,
    )
    db.add(letter)
    db.commit()
    db.refresh(letter)

    return LetterCreated(id=letter.id, secret_token=secret_token, unlock_date=letter.unlock_date)


@router.get("/{letter_id}/status", response_model=LetterStatus)
def get_status(letter_id: str, db: Session = Depends(get_db)):
    letter = db.query(Letter).filter(Letter.id == letter_id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")

    now = datetime.utcnow()
    unlocked = now >= letter.unlock_date
    remaining = max(0, int((letter.unlock_date - now).total_seconds()))

    return LetterStatus(
        id=letter.id,
        unlocked=unlocked,
        unlock_date=letter.unlock_date,
        opened=letter.opened,
        has_password=letter.password_hash is not None,
        anonymous=letter.anonymous,
        author_name=letter.author_name,
        theme=letter.theme,
        title=letter.title,
        seconds_remaining=remaining,
    )


@router.post("/{letter_id}/verify")
def verify_letter(letter_id: str, payload: VerifyRequest, db: Session = Depends(get_db)):
    letter = db.query(Letter).filter(Letter.id == letter_id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.secret_token != payload.secret_token:
        raise HTTPException(status_code=403, detail="Invalid secret token")
    if letter.password_hash and (not payload.password or not verify_value(payload.password, letter.password_hash)):
        raise HTTPException(status_code=403, detail="Invalid password")
    return {"ok": True, "unlocked": datetime.utcnow() >= letter.unlock_date}


@router.post("/{letter_id}/open", response_model=LetterContent)
def open_letter(letter_id: str, payload: OpenRequest, db: Session = Depends(get_db)):
    letter = db.query(Letter).filter(Letter.id == letter_id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    if letter.secret_token != payload.secret_token:
        raise HTTPException(status_code=403, detail="Invalid secret token")
    if letter.password_hash and (not payload.password or not verify_value(payload.password, letter.password_hash)):
        raise HTTPException(status_code=403, detail="Invalid password")
    if datetime.utcnow() < letter.unlock_date:
        raise HTTPException(status_code=423, detail="Letter is still sealed")

    if not letter.opened:
        letter.opened = True
        letter.opened_at = datetime.utcnow()
        db.commit()

    photo_url = f"/uploads/{letter.photo_path}" if letter.photo_path else None

    return LetterContent(
        id=letter.id,
        content=decrypt_text(letter.encrypted_content),
        photo_url=photo_url,
        author_name=letter.author_name,
        anonymous=letter.anonymous,
        theme=letter.theme,
        title=letter.title,
        unlock_date=letter.unlock_date,
        share_enabled=letter.share_enabled,
    )
