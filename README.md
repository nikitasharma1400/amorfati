# Amor Fati

Write something only your future self deserves to read.

## Structure

```
client/   React + Vite + Tailwind frontend
server/   FastAPI + PostgreSQL backend
```

## Local setup

### Server

```
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Generate a Fernet key and put it in `.env`:

```
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Run it:

```
uvicorn app.main:app --reload
```

### Client

```
cd client
npm install
cp .env.example .env
npm run dev
```

## Deployment

- Frontend: Vercel, root directory `client`
- Backend: Railway or Render, root directory `server`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Database: Neon or Railway PostgreSQL, set `DATABASE_URL`
- Email: Resend API key in `RESEND_API_KEY`, set `EMAIL_FROM` to a verified domain sender
- On the backend set `ALLOWED_ORIGINS` to your Vercel URL, and on the frontend set `VITE_API_URL` to your Railway URL

## Notes

- Letters are stored encrypted with Fernet symmetric encryption. Only the server holds the key.
- A background job checks every hour for letters whose unlock date has passed and emails the recipient.
- Opening a letter requires the id, the secret token from the sealing link, and the password if one was set.
- Photos are stored on local disk under `server/uploads`. For production, point `UPLOAD_DIR` at a persistent volume or swap in S3-compatible storage.
