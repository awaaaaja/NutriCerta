import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(req: LoginRequest):
    with httpx.Client() as client:
        resp = client.post(
            f"{settings.supabase_url}/auth/v1/token?grant_type=password",
            json={"email": req.email, "password": req.password},
            headers={"apikey": settings.supabase_anon_key},
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail=resp.json().get("error_description", "Login failed"))
        data = resp.json()
        return {
            "access_token": data["access_token"],
            "refresh_token": data["refresh_token"],
            "user": data["user"],
        }


@router.post("/register")
def register(req: RegisterRequest):
    with httpx.Client() as client:
        resp = client.post(
            f"{settings.supabase_url}/auth/v1/signup",
            json={"email": req.email, "password": req.password},
            headers={"apikey": settings.supabase_anon_key},
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail=resp.json().get("msg", "Registration failed"))
        data = resp.json()
        return {"message": "User registered", "user": data.get("user", data)}


@router.post("/logout")
def logout():
    return {"message": "Logged out"}
