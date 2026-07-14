import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, LargeBinary, Text
from app.database import Base


def generate_id():
    return str(uuid.uuid4())


class Letter(Base):
    __tablename__ = "letters"

    id = Column(String, primary_key=True, default=generate_id)
    email = Column(String, nullable=False)
    encrypted_content = Column(LargeBinary, nullable=False)
    unlock_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    opened = Column(Boolean, default=False)
    opened_at = Column(DateTime, nullable=True)
    delivered = Column(Boolean, default=False)
    secret_token = Column(String, nullable=False, unique=True, index=True)
    password_hash = Column(String, nullable=True)
    anonymous = Column(Boolean, default=False)
    author_name = Column(String, nullable=True)
    theme = Column(String, default="midnight")
    language = Column(String, default="en")
    photo_path = Column(String, nullable=True)
    share_enabled = Column(Boolean, default=False)
    title = Column(String, nullable=True)
