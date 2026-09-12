import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kisan_mitra.db")
DB_FALLBACK_SQLITE = os.getenv("DB_FALLBACK_SQLITE", "True").lower() == "true"

Base = declarative_base()

def get_engine():
    global DATABASE_URL
    db_url = DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+psycopg2://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    try:
        if db_url.startswith("sqlite"):
            engine = create_engine(db_url, connect_args={"check_same_thread": False})
        else:
            engine = create_engine(db_url, pool_pre_ping=True, pool_recycle=3600)
            # Test connection
            with engine.connect() as conn:
                pass
        return engine
    except Exception as e:
        if DB_FALLBACK_SQLITE:
            logger.warning(f"Could not connect to {db_url}: {e}. Falling back to SQLite.")
            fallback_url = "sqlite:///./kisan_mitra.db"
            return create_engine(fallback_url, connect_args={"check_same_thread": False})
        raise e

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
