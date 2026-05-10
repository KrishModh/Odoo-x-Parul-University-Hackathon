from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.database import db
from models.journal import Journal
from models.trip import Trip
from services.cloudinary_service import upload_journal_image

ALLOWED_NOTE_TYPES = {'trip', 'city', 'activity', 'day'}


def _owned_trip(trip_id, user_id):
    return Trip.query.filter_by(id=trip_id, user_id=user_id).first()


def _owned_note(note_id, user_id):
    return Journal.query.filter_by(id=note_id, user_id=user_id).first()


@jwt_required()
def get_journal(trip_id):
    user_id = int(get_jwt_identity())
    if not _owned_trip(trip_id, user_id):
        return jsonify({'message': 'Trip not found.'}), 404

    notes = Journal.query.filter_by(trip_id=trip_id, user_id=user_id).order_by(Journal.created_at.desc()).all()
    return jsonify({'notes': [note.to_dict() for note in notes]}), 200


@jwt_required()
def create_journal():
    user_id = int(get_jwt_identity())
    data = request.form.to_dict() if request.form else (request.get_json() or {})
    trip_id = data.get('trip_id')
    title = (data.get('title') or '').strip()
    content = (data.get('content') or '').strip()
    note_type = (data.get('note_type') or 'trip').strip().lower()

    if not trip_id or not _owned_trip(trip_id, user_id):
        return jsonify({'message': 'Trip not found.'}), 404
    if len(title) < 3:
        return jsonify({'message': 'Journal title must be at least 3 characters.'}), 400
    if len(content) < 5:
        return jsonify({'message': 'Journal content must be at least 5 characters.'}), 400
    if note_type not in ALLOWED_NOTE_TYPES:
        return jsonify({'message': 'Invalid journal note type.'}), 400

    try:
        image = upload_journal_image(request.files.get('image')) if request.files else None
    except Exception:
        return jsonify({'message': 'Unable to upload journal image.'}), 502

    note = Journal(
        trip_id=int(trip_id),
        user_id=user_id,
        title=title,
        content=content,
        note_type=note_type,
        image=image
    )
    db.session.add(note)
    db.session.commit()
    return jsonify({'message': 'Journal note created.', 'note': note.to_dict()}), 201


@jwt_required()
def update_journal():
    user_id = int(get_jwt_identity())
    data = request.form.to_dict() if request.form else (request.get_json() or {})
    note = _owned_note(data.get('note_id'), user_id)
    if not note:
        return jsonify({'message': 'Journal note not found.'}), 404

    title = data.get('title')
    content = data.get('content')
    note_type = data.get('note_type')

    if title is not None:
        if len(title.strip()) < 3:
            return jsonify({'message': 'Journal title must be at least 3 characters.'}), 400
        note.title = title.strip()
    if content is not None:
        if len(content.strip()) < 5:
            return jsonify({'message': 'Journal content must be at least 5 characters.'}), 400
        note.content = content.strip()
    if note_type is not None:
        note_type = note_type.strip().lower()
        if note_type not in ALLOWED_NOTE_TYPES:
            return jsonify({'message': 'Invalid journal note type.'}), 400
        note.note_type = note_type

    if request.files and request.files.get('image'):
        try:
            note.image = upload_journal_image(request.files.get('image'))
        except Exception:
            return jsonify({'message': 'Unable to upload journal image.'}), 502

    db.session.commit()
    return jsonify({'message': 'Journal note updated.', 'note': note.to_dict()}), 200


@jwt_required()
def delete_journal():
    user_id = int(get_jwt_identity())
    note = _owned_note((request.get_json() or {}).get('note_id'), user_id)
    if not note:
        return jsonify({'message': 'Journal note not found.'}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({'message': 'Journal note deleted.'}), 200
