from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.database import db
from models.checklist import PackingChecklist
from models.trip import Trip

def owned_trip(trip_id, user_id):
    return Trip.query.filter_by(id=trip_id, user_id=user_id).first()

def owned_item(item_id, user_id):
    return PackingChecklist.query.join(Trip).filter(PackingChecklist.id == item_id, Trip.user_id == user_id).first()

@jwt_required()
def get_checklist(trip_id):
    user_id = int(get_jwt_identity())
    if not owned_trip(trip_id, user_id):
        return jsonify({'message': 'Trip not found.'}), 404
    items = PackingChecklist.query.filter_by(trip_id=trip_id).order_by(PackingChecklist.created_at.desc()).all()
    return jsonify({'items': [item.to_dict() for item in items]}), 200

@jwt_required()
def create_checklist_item():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    trip_id = payload.get('trip_id')
    item_name = (payload.get('item_name') or '').strip()
    if not item_name:
        return jsonify({'message': 'Checklist item name is required.'}), 400
    if not owned_trip(trip_id, user_id):
        return jsonify({'message': 'Trip not found.'}), 404
    item = PackingChecklist(
        trip_id=trip_id,
        item_name=item_name,
        category=payload.get('category') or 'Miscellaneous',
        is_completed=bool(payload.get('is_completed', False))
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Checklist item created.', 'item': item.to_dict()}), 201

@jwt_required()
def update_checklist_item():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    item = owned_item(payload.get('item_id'), user_id)
    if not item:
        return jsonify({'message': 'Checklist item not found.'}), 404
    if 'item_name' in payload:
        item.item_name = payload['item_name'].strip()
    if 'category' in payload:
        item.category = payload['category']
    if 'is_completed' in payload:
        item.is_completed = bool(payload['is_completed'])
    db.session.commit()
    return jsonify({'message': 'Checklist item updated.', 'item': item.to_dict()}), 200

@jwt_required()
def delete_checklist_item():
    user_id = int(get_jwt_identity())
    item = owned_item((request.get_json() or {}).get('item_id'), user_id)
    if not item:
        return jsonify({'message': 'Checklist item not found.'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Checklist item deleted.'}), 200

@jwt_required()
def reset_checklist(trip_id):
    user_id = int(get_jwt_identity())
    if not owned_trip(trip_id, user_id):
        return jsonify({'message': 'Trip not found.'}), 404
    PackingChecklist.query.filter_by(trip_id=trip_id).delete()
    db.session.commit()
    return jsonify({'message': 'Checklist reset.'}), 200
