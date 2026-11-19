from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class GoogleAuthRequest(BaseModel):
    id_token: str = Field(
        ..., description="Google ID Token issued by Google Sign-In"
    )


class UserOut(BaseModel):
    id: UUID
    google_sub: str
    email: str
    full_name: str
    avatar_url: str | None = None
    role: str
    college_id: str | None = None
    department: str | None = None
    academic_year: str | None = None
    division: str | None = None
    bio: str | None = None
    dm_enabled: bool
    is_profile_complete: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_profile_complete: bool
    user: UserOut


class OnboardingRequest(BaseModel):
    college_id: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="PRN for students or Employee ID for staff",
    )
    department: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Department name (e.g. Computer Engineering)",
    )
    academic_year: str | None = Field(
        default=None,
        max_length=20,
        description="Academic Year (e.g. FY, SY, TY, Final)",
    )
    division: str | None = Field(
        default=None, max_length=10, description="Division/Section"
    )
    bio: str | None = Field(
        default=None, max_length=280, description="Personal bio"
    )
