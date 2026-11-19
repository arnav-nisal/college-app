from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import create_access_token, verify_google_id_token
from app.database import get_db
from app.models import User
from app.schemas import GoogleAuthRequest, TokenResponse, UserOut

router = APIRouter()


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    body: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    id_info = verify_google_id_token(body.id_token)

    google_sub = str(id_info.get("sub"))
    email = (id_info.get("email") or "").lower()
    full_name = id_info.get("name") or email.split("@")[0]
    avatar_url = id_info.get("picture")

    stmt = select(User).where(
        (User.google_sub == google_sub) | (User.email == email)
    )
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if user:
        if user.google_sub != google_sub:
            user.google_sub = google_sub
        if avatar_url and user.avatar_url != avatar_url:
            user.avatar_url = avatar_url
    else:
        user = User(
            google_sub=google_sub,
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            role="student",
            is_profile_complete=False,
            dm_enabled=True,
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(user.id, user.role)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        is_profile_complete=user.is_profile_complete,
        user=UserOut.model_validate(user),
    )
