import httpx
from app.config import RESEND_API_KEY, EMAIL_FROM, FRONTEND_URL

RESEND_URL = "https://api.resend.com/emails"


def build_unlock_email(letter_id: str, secret_token: str, title: str | None) -> dict:
    open_url = f"{FRONTEND_URL}/letter/{letter_id}?token={secret_token}"
    subject = title or "A letter has arrived from your past self"
    html = f"""
    <div style="background:#0b0b0f;padding:48px;font-family:Georgia,serif;color:#eae7dc;">
      <div style="max-width:480px;margin:0 auto;text-align:center;">
        <p style="letter-spacing:4px;font-size:12px;color:#8a8578;text-transform:uppercase;">Amor Fati</p>
        <h1 style="font-size:24px;font-weight:400;margin:24px 0;">{subject}</h1>
        <p style="color:#b8b3a4;line-height:1.6;">The moment you sealed has arrived. Your letter is waiting on the other side of time.</p>
        <a href="{open_url}" style="display:inline-block;margin-top:32px;padding:14px 32px;border:1px solid #eae7dc;color:#eae7dc;text-decoration:none;letter-spacing:1px;">Open Your Letter</a>
      </div>
    </div>
    """
    return {"subject": subject, "html": html}


def send_unlock_email(to_email: str, letter_id: str, secret_token: str, title: str | None) -> bool:
    if not RESEND_API_KEY:
        return False
    payload = build_unlock_email(letter_id, secret_token, title)
    with httpx.Client(timeout=15) as client:
        response = client.post(
            RESEND_URL,
            headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
            json={
                "from": EMAIL_FROM,
                "to": [to_email],
                "subject": payload["subject"],
                "html": payload["html"],
            },
        )
        return response.status_code < 300
