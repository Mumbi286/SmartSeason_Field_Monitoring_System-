from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # Comma-separated browser origins"
    CORS_ALLOW_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,https://smart-season-field-monitoring-syste-pink.vercel.app"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        # Render/Neon URLs are often provided as postgresql://...
        # SQLAlchemy with psycopg driver expects postgresql+psycopg://...
        if isinstance(value, str) and value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
