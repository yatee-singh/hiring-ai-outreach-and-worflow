from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User


class LoginRequest(BaseModel):
    username: str
    password: str


router = APIRouter(
    prefix="/api",
    tags=["Login"],
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


@router.post("/login")
async def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.username == payload.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    valid = pwd_context.verify(
        payload.password,
        user.password_hash
    )

    if not valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "success": True,
        "user": {
            "id": str(user.id),
            "username": user.username,
            "name": user.name,
            "role": user.role,
            "organization": {
                "id": str(user.organization.id),
                "name": user.organization.name
            }
        }
    }

