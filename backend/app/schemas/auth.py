from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import UserRole

# Login Request Schema
class LoginRequest(BaseModel):
    email: str
    password: str

# Signup Request Schema
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole = UserRole.agent

# User Response Schema
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: UserRole
    created_at: datetime

# Auth Response Schema
class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
