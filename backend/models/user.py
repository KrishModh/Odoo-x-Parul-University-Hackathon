from datetime import datetime
from db.database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(40), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(24), nullable=True)
    password_hash = db.Column(db.String(255), nullable=True)
    profile_image = db.Column(db.String(500), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    country = db.Column(db.String(100), nullable=True)
    preferred_theme = db.Column(db.String(20), nullable=False, default='dark')
    provider = db.Column(db.String(30), nullable=False, default='local')
    is_email_verified = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    trips = db.relationship('Trip', back_populates='user', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'profile_image': self.profile_image,
            'bio': self.bio,
            'country': self.country,
            'preferred_theme': self.preferred_theme,
            'provider': self.provider,
            'is_email_verified': self.is_email_verified,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
