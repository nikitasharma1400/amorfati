from cryptography.fernet import Fernet
from app.config import FERNET_KEY

_fernet = Fernet(FERNET_KEY.encode()) if FERNET_KEY else None


def get_fernet():
    global _fernet
    if _fernet is None:
        raise RuntimeError("FERNET_KEY is not configured")
    return _fernet


def encrypt_text(plain_text: str) -> bytes:
    return get_fernet().encrypt(plain_text.encode())


def decrypt_text(token: bytes) -> str:
    return get_fernet().decrypt(token).decode()
