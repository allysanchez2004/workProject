from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List

class Settings(BaseSettings):
    app_name: str = Field(default="mypiggybankmobile-api", alias="APP_NAME")

    jwt_secret: str = Field(default="change-me", alias="JWT_SECRET")
    jwt_alg: str = Field(default="HS256", alias="JWT_ALG")
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    cors_origins: str = Field(default="http://localhost:19006,http://localhost:8081", alias="CORS_ORIGINS")
    database_url: str = Field(default="sqlite:///./mypiggybank.db", alias="DATABASE_URL")
    # settings.py additions

    jwt_issuer: str = Field(default="mypiggybankmobile", alias="JWT_ISSUER")
    jwt_audience: str = Field(default="mypiggybankmobile-users", alias="JWT_AUDIENCE")
    
    refresh_jwt_secret: str = Field(default="change-me-refresh", alias="REFRESH_JWT_SECRET")
    refresh_token_expire_days: int = Field(default=14, alias="REFRESH_TOKEN_EXPIRE_DAYS")
    
    jwt_leeway_seconds: int = Field(default=30, alias="JWT_LEEWAY_SECONDS")

    @property
    def cors_list(self) -> List[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
