from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import OnboardingRequest, UserOut

router = APIRouter()


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me/onboarding", response_model=UserOut)
async def complete_onboarding(
    body: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    college_id = body.college_id.strip()
    department = body.department.strip()

    if not college_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="College ID cannot be empty",
        )
    if not department:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Department cannot be empty",
        )

    # Check if college_id is already claimed by another account
    stmt = select(User).where(
        User.college_id == college_id, User.id != current_user.id
    )
    res = await db.execute(stmt)
    existing_user = res.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="College ID is already claimed by another account",
        )

    current_user.college_id = college_id
    current_user.department = department
    if body.academic_year is not None:
        current_user.academic_year = (
            body.academic_year.strip() if body.academic_year else None
        )
    if body.division is not None:
        current_user.division = (
            body.division.strip() if body.division else None
        )
    if body.bio is not None:
        current_user.bio = body.bio.strip() if body.bio else None

    current_user.is_profile_complete = True

    await db.commit()
    await db.refresh(current_user)
    return current_user
