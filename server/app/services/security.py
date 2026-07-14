import secrets
import bcrypt


def generate_secret_token() -> str:
    return secrets.token_urlsafe(32)


def hash_value(value: str) -> str:
    return bcrypt.hashpw(value.encode(), bcrypt.gensalt()).decode()


def verify_value(value: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(value.encode(), hashed.encode())
    except ValueError:
        return False
