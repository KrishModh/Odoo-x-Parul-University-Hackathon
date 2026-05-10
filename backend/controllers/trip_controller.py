from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.database import db
from models.trip import Trip
from services.cloudinary_service import upload_trip_cover
from utils.trip_validators import validate_trip_payload


def get_owned_trip_or_404(trip_id, user_id):
    return Trip.query.filter_by(id=trip_id, user_id=user_id).first()


def _fetch_user_trips(user_id):
    trips = Trip.query.filter_by(user_id=user_id).order_by(Trip.created_at.desc()).all()
    return [trip.to_dict() for trip in trips]


@jwt_required()
def create_trip():
    user_id = int(get_jwt_identity())
    data = request.form.to_dict()

    try:
        trip_data = validate_trip_payload(data)
        cover_file = request.files.get('cover_image')
        if not cover_file:
            return jsonify({'message': 'Trip cover image is required.'}), 400
        cover_image = upload_trip_cover(cover_file)
    except ValueError as error:
        return jsonify({'message': str(error)}), 400
    except Exception:
        return jsonify({'message': 'Unable to upload trip cover image.'}), 502

    trip = Trip(user_id=user_id, cover_image=cover_image, **trip_data)
    db.session.add(trip)
    db.session.commit()

    return jsonify({'message': 'Trip created successfully.', 'trip': trip.to_dict()}), 201


@jwt_required()
def list_trips():
    user_id = int(get_jwt_identity())
    return jsonify({'trips': _fetch_user_trips(user_id)}), 200


@jwt_required()
def list_user_trips():
    # ✅ Fix: directly fetch karo, list_trips() mat call karo
    # list_trips() bhi @jwt_required() se wrapped hai — double check = 401
    user_id = int(get_jwt_identity())
    return jsonify({'trips': _fetch_user_trips(user_id)}), 200


@jwt_required()
def get_trip(trip_id):
    user_id = int(get_jwt_identity())
    trip = get_owned_trip_or_404(trip_id, user_id)
    if not trip:
        return jsonify({'message': 'Trip not found.'}), 404
    return jsonify({'trip': trip.to_dict()}), 200


@jwt_required()
def update_trip(trip_id):
    user_id = int(get_jwt_identity())
    trip = get_owned_trip_or_404(trip_id, user_id)
    if not trip:
        return jsonify({'message': 'Trip not found.'}), 404

    try:
        trip_data = validate_trip_payload(request.form.to_dict(), partial=True)
        cover_image = upload_trip_cover(request.files.get('cover_image'))
    except ValueError as error:
        return jsonify({'message': str(error)}), 400
    except Exception:
        return jsonify({'message': 'Unable to upload trip cover image.'}), 502

    for key, value in trip_data.items():
        setattr(trip, key, value)
    if cover_image:
        trip.cover_image = cover_image

    db.session.commit()
    return jsonify({'message': 'Trip updated successfully.', 'trip': trip.to_dict()}), 200


@jwt_required()
def delete_trip(trip_id):
    user_id = int(get_jwt_identity())
    trip = get_owned_trip_or_404(trip_id, user_id)
    if not trip:
        return jsonify({'message': 'Trip not found.'}), 404

    db.session.delete(trip)
    db.session.commit()
    return jsonify({'message': 'Trip deleted successfully.'}), 200