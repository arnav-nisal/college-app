import pytest
import jwt
from google.auth.exceptions import GoogleAuthError
from app.config import settings


@pytest.mark.asyncio
async def test_valid_despu_first_time_login(client, monkeypatch):
    """1. Valid @despu.edu.in first-time login creates user with is_profile_complete=False and returns valid JWT."""
    mock_payload = {
        "sub": "google-sub-12345",
        "email": "student1@despu.edu.in",
        "email_verified": True,
        "hd": "despu.edu.in",
        "name": "Aarav Sharma",
        "picture": "https://lh3.googleusercontent.com/avatar1.jpg",
    }

    monkeypatch.setattr(
        "app.routers.auth.verify_google_id_token",
        lambda token: mock_payload,
    )

    response = await client.post(
        "/auth/google", json={"id_token": "mock-valid-google-token"}
    )
    assert response.status_code == 200
    data = response.json()

    assert data["token_type"] == "bearer"
    assert data["is_profile_complete"] is False
    assert "access_token" in data
    assert data["access_token"] != ""

    user = data["user"]
    assert user["email"] == "student1@despu.edu.in"
    assert user["full_name"] == "Aarav Sharma"
    assert user["role"] == "student"
    assert user["avatar_url"] == "https://lh3.googleusercontent.com/avatar1.jpg"
    assert user["is_profile_complete"] is False
    assert user["college_id"] is None
    assert user["dm_enabled"] is True

    # Verify the issued JWT
    decoded = jwt.decode(
        data["access_token"],
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM],
    )
    assert decoded["sub"] == user["id"]
    assert decoded["role"] == "student"


@pytest.mark.asyncio
async def test_personal_gmail_and_mismatched_domain_rejected(monkeypatch):
    """2. Personal @gmail.com or mismatched hd domain is rejected with 403 Forbidden."""
    from app.auth import verify_google_id_token
    from fastapi import HTTPException

    # Case A: Personal gmail.com account
    monkeypatch.setattr(
        "google.oauth2.id_token.verify_oauth2_token",
        lambda token, req, client_id: {
            "sub": "999",
            "email": "random_user@gmail.com",
            "email_verified": True,
            "hd": "gmail.com",
        },
    )
    with pytest.raises(HTTPException) as exc_info:
        verify_google_id_token("token-gmail")
    assert exc_info.value.status_code == 403
    assert "@despu.edu.in" in exc_info.value.detail

    # Case B: Missing hd or other organization
    monkeypatch.setattr(
        "google.oauth2.id_token.verify_oauth2_token",
        lambda token, req, client_id: {
            "sub": "888",
            "email": "hacker@othercollege.edu.in",
            "email_verified": True,
            "hd": "othercollege.edu.in",
        },
    )
    with pytest.raises(HTTPException) as exc_info:
        verify_google_id_token("token-other-domain")
    assert exc_info.value.status_code == 403

    # Case C: Unverified email
    monkeypatch.setattr(
        "google.oauth2.id_token.verify_oauth2_token",
        lambda token, req, client_id: {
            "sub": "777",
            "email": "fake@despu.edu.in",
            "email_verified": False,
            "hd": "despu.edu.in",
        },
    )
    with pytest.raises(HTTPException) as exc_info:
        verify_google_id_token("token-unverified")
    assert exc_info.value.status_code == 403

    # Case D: Invalid/expired token raises 401
    def raise_expired(*args, **kwargs):
        raise GoogleAuthError("Token expired")

    monkeypatch.setattr(
        "google.oauth2.id_token.verify_oauth2_token", raise_expired
    )
    with pytest.raises(HTTPException) as exc_info:
        verify_google_id_token("token-expired")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_me(client, monkeypatch):
    """3. GET /users/me with valid JWT succeeds; missing/tampered JWT returns 401."""
    mock_payload = {
        "sub": "sub-test-me",
        "email": "me@despu.edu.in",
        "email_verified": True,
        "hd": "despu.edu.in",
        "name": "Current User",
    }
    monkeypatch.setattr(
        "app.routers.auth.verify_google_id_token",
        lambda token: mock_payload,
    )

    # 1. Login to get a valid token
    login_res = await client.post(
        "/auth/google", json={"id_token": "valid-token"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    user_id = login_res.json()["user"]["id"]

    # 2. GET /users/me with valid token -> 200
    res = await client.get(
        "/users/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    user_data = res.json()
    assert user_data["id"] == user_id
    assert user_data["email"] == "me@despu.edu.in"
    assert user_data["full_name"] == "Current User"

    # 3. GET /users/me with missing Authorization header -> 401
    res_no_auth = await client.get("/users/me")
    assert res_no_auth.status_code == 401
    assert "credentials" in res_no_auth.json()["detail"].lower()

    # 4. GET /users/me with tampered token -> 401
    res_tampered = await client.get(
        "/users/me", headers={"Authorization": "Bearer tampered.token.here"}
    )
    assert res_tampered.status_code == 401
    assert "credentials" in res_tampered.json()["detail"].lower()


@pytest.mark.asyncio
async def test_onboarding_lifecycle_and_subsequent_login(client, monkeypatch):
    """4. PATCH /users/me/onboarding completes profile, and subsequent logins return is_profile_complete=True."""
    mock_payload = {
        "sub": "sub-onboarding-user",
        "email": "student2@despu.edu.in",
        "email_verified": True,
        "hd": "despu.edu.in",
        "name": "Priya Patil",
        "picture": "https://lh3.googleusercontent.com/priya.jpg",
    }
    monkeypatch.setattr(
        "app.routers.auth.verify_google_id_token",
        lambda token: mock_payload,
    )

    # First login -> is_profile_complete is False
    res1 = await client.post("/auth/google", json={"id_token": "priya-token"})
    assert res1.status_code == 200
    assert res1.json()["is_profile_complete"] is False
    token = res1.json()["access_token"]

    # Complete onboarding
    onboard_payload = {
        "college_id": "PRN20261001",
        "department": "Computer Science & Engineering",
        "academic_year": "TY",
        "division": "B",
        "bio": "Competitive programmer and ML enthusiast.",
    }
    patch_res = await client.patch(
        "/users/me/onboarding",
        headers={"Authorization": f"Bearer {token}"},
        json=onboard_payload,
    )
    assert patch_res.status_code == 200
    updated_user = patch_res.json()
    assert updated_user["is_profile_complete"] is True
    assert updated_user["college_id"] == "PRN20261001"
    assert updated_user["department"] == "Computer Science & Engineering"
    assert updated_user["academic_year"] == "TY"
    assert updated_user["division"] == "B"
    assert updated_user["bio"] == "Competitive programmer and ML enthusiast."

    # Verify subsequent login returns is_profile_complete=True
    res2 = await client.post("/auth/google", json={"id_token": "priya-token"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["is_profile_complete"] is True
    assert data2["user"]["is_profile_complete"] is True
    assert data2["user"]["college_id"] == "PRN20261001"


@pytest.mark.asyncio
async def test_onboarding_duplicate_college_id_conflict(client, monkeypatch):
    """Verify duplicate college_id returns 409 Conflict."""
    # User 1
    monkeypatch.setattr(
        "app.routers.auth.verify_google_id_token",
        lambda token: {
            "sub": "sub-user-1",
            "email": "user1@despu.edu.in",
            "email_verified": True,
            "hd": "despu.edu.in",
            "name": "User One",
        },
    )
    res1 = await client.post("/auth/google", json={"id_token": "tok1"})
    token1 = res1.json()["access_token"]

    await client.patch(
        "/users/me/onboarding",
        headers={"Authorization": f"Bearer {token1}"},
        json={"college_id": "PRN9999", "department": "IT"},
    )

    # User 2
    monkeypatch.setattr(
        "app.routers.auth.verify_google_id_token",
        lambda token: {
            "sub": "sub-user-2",
            "email": "user2@despu.edu.in",
            "email_verified": True,
            "hd": "despu.edu.in",
            "name": "User Two",
        },
    )
    res2 = await client.post("/auth/google", json={"id_token": "tok2"})
    token2 = res2.json()["access_token"]

    # Try claiming same PRN9999
    res_conflict = await client.patch(
        "/users/me/onboarding",
        headers={"Authorization": f"Bearer {token2}"},
        json={"college_id": "PRN9999", "department": "Mechanical"},
    )
    assert res_conflict.status_code == 409
    assert "already claimed" in res_conflict.json()["detail"].lower()
