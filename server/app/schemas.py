from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LetterCreate(BaseModel):
    email: EmailStr
    content: str = Field(min_length=1, max_length=20000)
    unlock_date: datetime
    password: Optional[str] = None
    anonymous: bool = False
    author_name: Optional[str] = None
    theme: str = "midnight"
    language: str = "en"
    title: Optional[str] = None
    share_enabled: bool = False


class LetterCreated(BaseModel):
    id: str
    secret_token: str
    unlock_date: datetime


class VerifyRequest(BaseModel):
    secret_token: str
    password: Optional[str] = None


class OpenRequest(BaseModel):
    secret_token: str
    password: Optional[str] = None


class LetterStatus(BaseModel):
    id: str
    unlocked: bool
    unlock_date: datetime
    opened: bool
    has_password: bool
    anonymous: bool
    author_name: Optional[str]
    theme: str
    title: Optional[str]
    seconds_remaining: int


class LetterContent(BaseModel):
    id: str
    content: str
    photo_url: Optional[str]
    author_name: Optional[str]
    anonymous: bool
    theme: str
    title: Optional[str]
    unlock_date: datetime
    share_enabled: bool
