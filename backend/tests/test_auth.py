from app.models.enums import UserRole

# signup returns token and user payload
def test_signup_returns_token_and_user_payload(client):
    response = client.post(
        "/auth/signup",
        json={
            "name": "Test User",
            "email": "new.user@test.com",
            "password": "User1234",
            "role": UserRole.agent.value,
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "new.user@test.com"
    assert body["user"]["role"] == UserRole.agent.value


def test_login_returns_token_for_valid_credentials(client):
    client.post(
        "/auth/signup",
        json={
            "name": "Login User",
            "email": "login.user@test.com",
            "password": "User1234",
            "role": UserRole.agent.value,
        },
    )

    response = client.post(
        "/auth/login",
        json={"email": "login.user@test.com", "password": "User1234"},
    )

    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["user"]["email"] == "login.user@test.com"


def test_signup_rejects_duplicate_email(client):
    payload = {
        "name": "Duplicate User",
        "email": "duplicate@test.com",
        "password": "User1234",
        "role": UserRole.agent.value,
    }
    first = client.post("/auth/signup", json=payload)
    second = client.post("/auth/signup", json=payload)

    assert first.status_code == 200
    assert second.status_code == 400
    assert second.json()["detail"] == "Email already registered"
