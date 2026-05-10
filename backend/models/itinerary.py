from datetime import datetime
from db.database import db

class TripSection(db.Model):
    __tablename__ = 'trip_sections'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False, index=True)
    city_name = db.Column(db.String(140), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    position = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    trip = db.relationship('Trip', back_populates='sections')
    activities = db.relationship('Activity', back_populates='section', cascade='all, delete-orphan', order_by='Activity.activity_time')

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'city_name': self.city_name,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'notes': self.notes,
            'position': self.position,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'activities': [activity.to_dict() for activity in self.activities]
        }

class Activity(db.Model):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('trip_sections.id'), nullable=True, index=True)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=True, index=True)
    activity_name = db.Column(db.String(160), nullable=False)
    description = db.Column(db.Text, nullable=True)
    estimated_cost = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    activity_time = db.Column(db.Time, nullable=False)
    category = db.Column(db.String(60), nullable=False, default='experience')
    duration = db.Column(db.String(80), nullable=True)
    rating = db.Column(db.Numeric(3, 2), nullable=True)
    image = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    section = db.relationship('TripSection', back_populates='activities')
    city = db.relationship('City', back_populates='activities')

    def to_dict(self):
        return {
            'id': self.id,
            'section_id': self.section_id,
            'city_id': self.city_id,
            'activity_name': self.activity_name,
            'title': self.activity_name,
            'description': self.description,
            'estimated_cost': float(self.estimated_cost),
            'activity_time': self.activity_time.strftime('%H:%M'),
            'category': self.category,
            'duration': self.duration,
            'rating': float(self.rating) if self.rating is not None else None,
            'image': self.image,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
