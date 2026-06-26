import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "mock_key_for_testing")
    SIMULATION_MODE: str = os.getenv("SIMULATION_MODE", "PRE_INCIDENT")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sentinel.db")
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
