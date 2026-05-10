from datetime import datetime
from db.database import db

class City(db.Model):
    __tablename__ = 'cities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140), nullable=False, index=True)
    country = db.Column(db.String(120), nullable=False, index=True)
    region = db.Column(db.String(120), nullable=True, index=True)
    image = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=False)
    popularity_score = db.Column(db.Integer, nullable=False, default=80)
    avg_budget = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    best_season = db.Column(db.String(120), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    activities = db.relationship('Activity', back_populates='city', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'country': self.country,
            'region': self.region,
            'image': self.image,
            'description': self.description,
            'popularity_score': self.popularity_score,
            'avg_budget': float(self.avg_budget),
            'best_season': self.best_season,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
