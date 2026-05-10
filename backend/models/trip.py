from datetime import datetime
from db.database import db

class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    trip_name = db.Column(db.String(140), nullable=False)
    destination = db.Column(db.String(140), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    estimated_budget = db.Column(db.Numeric(12, 2), nullable=False)
    travelers_count = db.Column(db.Integer, nullable=False)
    travel_type = db.Column(db.String(30), nullable=False)
    visibility = db.Column(db.String(20), nullable=False, default='private')
    cover_image = db.Column(db.String(500), nullable=True)
    tags = db.Column(db.JSON, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='trips')
    sections = db.relationship('TripSection', back_populates='trip', cascade='all, delete-orphan', order_by='TripSection.position')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'trip_name': self.trip_name,
            'destination': self.destination,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'description': self.description,
            'estimated_budget': float(self.estimated_budget),
            'travelers_count': self.travelers_count,
            'travel_type': self.travel_type,
            'visibility': self.visibility,
            'cover_image': self.cover_image,
            'tags': self.tags or [],
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'sections': [section.to_dict() for section in self.sections]
        }
