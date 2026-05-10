from datetime import datetime
from db.database import db


class Journal(db.Model):
    __tablename__ = 'journal_entries'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(160), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(500), nullable=True)
    note_type = db.Column(db.String(40), nullable=False, default='trip')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    trip = db.relationship('Trip', back_populates='journal_entries')

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'image': self.image,
            'note_type': self.note_type,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
