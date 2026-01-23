import os, hmac, hashlib
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TEMP user store (DB comes in M2)
USERS = {}

# ---------- HELPERS ----------
def verify_telegram_login(data: dict):
    check_hash = data.pop("hash", None)
    if not check_hash:
        return False

    data_check_string = "\n".join(f"{k}={data[k]}" for k in sorted(data.keys()))
    secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()
    h = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return h == check_hash

def create_jwt(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Unauthorized")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(401, "Invalid token")

# ---------- ROUTES ----------
@app.post("/auth/telegram")
def telegram_auth(payload: dict):
    data = payload.copy()
    if not verify_telegram_login(data):
        raise HTTPException(401, "Telegram auth failed")

    user_id = str(payload["id"])
    USERS[user_id] = {
        "id": user_id,
        "name": payload.get("first_name"),
        "username": payload.get("username"),
        "photo": payload.get("photo_url")
    }

    token = create_jwt(user_id)
    return {"token": token, "user": USERS[user_id]}

@app.get("/me")
def me(user_id: str = Depends(get_current_user)):
    return {"user": USERS.get(user_id)}
