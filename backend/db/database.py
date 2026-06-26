from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    # Enterprise Cloud-Native Adapter (PostgreSQL / CockroachDB / TimescaleDB)
    engine = create_engine(db_url, pool_size=20, max_overflow=10, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
