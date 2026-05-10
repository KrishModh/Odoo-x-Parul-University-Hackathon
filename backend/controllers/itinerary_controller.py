from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.database import db
from models.itinerary import Activity, TripSection
from models.trip import Trip
from models.budget import BudgetBreakdown
from utils.itinerary_validators import validate_activity_payload, validate_section_payload

def user_owns_trip(trip_id, user_id):
    return Trip.query.filter_by(id=trip_id, user_id=user_id).first()

def owned_section(section_id, user_id):
    return TripSection.query.join(Trip).filter(TripSection.id == section_id, Trip.user_id == user_id).first()

def owned_activity(activity_id, user_id):
    return Activity.query.join(TripSection).join(Trip).filter(Activity.id == activity_id, Trip.user_id == user_id).first()

def budget_for_trip(trip):
    activity_cost = sum(float(activity.estimated_cost or 0) for section in trip.sections for activity in section.activities)
    manual_breakdowns = BudgetBreakdown.query.filter_by(trip_id=trip.id).all()
    manual_total = sum(float(item.amount or 0) for item in manual_breakdowns)
    categories = {
        'activities': activity_cost,
        'transport': 0,
        'stay': 0,
        'food': 0
    }
    for item in manual_breakdowns:
        categories[item.category] = categories.get(item.category, 0) + float(item.amount or 0)
    spent = activity_cost + manual_total
    estimated = float(trip.estimated_budget or 0)
    days = max((trip.end_date - trip.start_date).days + 1, 1)
    return {
        'total_estimated_budget': estimated,
        'spent': spent,
        'remaining_budget': estimated - spent,
        'cost_per_day': spent / days,
        'categories': categories,
        'breakdowns': [item.to_dict() for item in manual_breakdowns],
        'budget_health': max(0, min(100, round(((estimated - spent) / estimated) * 100))) if estimated else 0
    }

@jwt_required()
def get_itinerary(trip_id):
    user_id = int(get_jwt_identity())
    trip = user_owns_trip(trip_id, user_id)
    if not trip:
        return jsonify({'message': 'Trip not found.'}), 404
    return jsonify({'trip': trip.to_dict(), 'budget': budget_for_trip(trip)}), 200

@jwt_required()
def update_itinerary():
    payload = request.get_json() or {}
    # Bulk update currently supports section reordering for a fast itinerary view save action.
    user_id = int(get_jwt_identity())
    for item in payload.get('sections', []):
        section = owned_section(item.get('section_id'), user_id)
        if section and 'position' in item:
            section.position = int(item['position'])
    db.session.commit()
    return jsonify({'message': 'Itinerary updated.'}), 200

@jwt_required()
def get_budget(trip_id):
    user_id = int(get_jwt_identity())
    trip = user_owns_trip(trip_id, user_id)
    if not trip:
        return jsonify({'message': 'Trip not found.'}), 404
    return jsonify({'budget': budget_for_trip(trip)}), 200

@jwt_required()
def create_section():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    try:
        data = validate_section_payload(payload)
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid itinerary section data.'}), 400

    if not user_owns_trip(data['trip_id'], user_id):
        return jsonify({'message': 'Trip not found.'}), 404

    if 'position' not in data:
        data['position'] = TripSection.query.filter_by(trip_id=data['trip_id']).count()

    section = TripSection(**data)
    db.session.add(section)
    db.session.commit()
    return jsonify({'message': 'Section created.', 'section': section.to_dict()}), 201

@jwt_required()
def update_section():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    section = owned_section(payload.get('section_id'), user_id)
    if not section:
        return jsonify({'message': 'Section not found.'}), 404

    try:
        data = validate_section_payload(payload, partial=True)
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid itinerary section data.'}), 400

    data.pop('trip_id', None)
    for key, value in data.items():
        if key != 'section_id':
            setattr(section, key, value)
    db.session.commit()
    return jsonify({'message': 'Section updated.', 'section': section.to_dict()}), 200

@jwt_required()
def delete_section():
    user_id = int(get_jwt_identity())
    section = owned_section((request.get_json() or {}).get('section_id'), user_id)
    if not section:
        return jsonify({'message': 'Section not found.'}), 404

    db.session.delete(section)
    db.session.commit()
    return jsonify({'message': 'Section deleted.'}), 200

@jwt_required()
def create_activity():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    try:
        data = validate_activity_payload(payload)
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid activity data.'}), 400

    if not owned_section(data['section_id'], user_id):
        return jsonify({'message': 'Section not found.'}), 404

    activity = Activity(**data)
    db.session.add(activity)
    db.session.commit()
    return jsonify({'message': 'Activity created.', 'activity': activity.to_dict()}), 201

@jwt_required()
def update_activity():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    activity = owned_activity(payload.get('activity_id'), user_id)
    if not activity:
        return jsonify({'message': 'Activity not found.'}), 404

    try:
        data = validate_activity_payload(payload, partial=True)
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid activity data.'}), 400

    data.pop('section_id', None)
    for key, value in data.items():
        if key != 'activity_id':
            setattr(activity, key, value)
    db.session.commit()
    return jsonify({'message': 'Activity updated.', 'activity': activity.to_dict()}), 200

@jwt_required()
def delete_activity():
    user_id = int(get_jwt_identity())
    activity = owned_activity((request.get_json() or {}).get('activity_id'), user_id)
    if not activity:
        return jsonify({'message': 'Activity not found.'}), 404

    db.session.delete(activity)
    db.session.commit()
    return jsonify({'message': 'Activity deleted.'}), 200
