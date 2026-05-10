import os
from dotenv import load_dotenv
load_dotenv()

from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGIN = os.getenv('FRONTEND_ORIGIN')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024

    if not SECRET_KEY or not JWT_SECRET_KEY or not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError('SECRET_KEY, JWT_SECRET_KEY, and DATABASE_URL must be configured.')
