from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.models import Letter
from app.services.email import send_unlock_email

scheduler = BackgroundScheduler()


def deliver_due_letters():
    db = SessionLocal()
    try:
        due_letters = (
            db.query(Letter)
            .filter(Letter.delivered == False, Letter.unlock_date <= datetime.utcnow())
            .all()
        )
        for letter in due_letters:
            sent = send_unlock_email(letter.email, letter.id, letter.secret_token, letter.title)
            if sent:
                letter.delivered = True
        db.commit()
    finally:
        db.close()


def start_scheduler():
    scheduler.add_job(deliver_due_letters, "interval", hours=1, id="unlock_checker", replace_existing=True)
    scheduler.start()
