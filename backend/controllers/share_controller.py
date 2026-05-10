import re
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from db.database import db
from controllers.itinerary_controller import budget_for_trip
from models.checklist import PackingChecklist
from models.itinerary import Activity, TripSection
from models.journal import Journal
from models.trip import Trip


def _slugify(value):
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')


def _public_payload(trip):
    checklist = PackingChecklist.query.filter_by(trip_id=trip.id).all()
    completed = sum(1 for item in checklist if item.is_completed)
    journals = Journal.query.filter_by(trip_id=trip.id).order_by(Journal.created_at.desc()).limit(8).all()
    return {
        'trip': trip.to_dict(),
        'budget': budget_for_trip(trip),
        'journal': [note.to_dict() for note in journals],
        'packing': {
            'items': [item.to_dict() for item in checklist[:10]],
            'completion': round((completed / len(checklist)) * 100) if checklist else 0
        }
    }


def _unique_slug(trip):
    base = f"{_slugify(trip.trip_name)}-{trip.id}"
    slug = base
    suffix = 2
    while Trip.query.filter(Trip.public_slug == slug, Trip.id != trip.id).first():
        slug = f"{base}-{suffix}"
        suffix += 1
    return slug


@jwt_required()
def generate_share():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    trip = Trip.query.filter_by(id=payload.get('trip_id'), user_id=user_id).first()
    if not trip:
        return jsonify({'message': 'Trip not found.'}), 404

    trip.is_public = True
    trip.visibility = 'public'
    if not trip.public_slug:
        trip.public_slug = _unique_slug(trip)
    db.session.commit()
    return jsonify({'message': 'Public itinerary link ready.', 'slug': trip.public_slug, 'trip': trip.to_dict()}), 200


def get_shared_itinerary(slug):
    trip = Trip.query.filter_by(public_slug=slug, is_public=True).first()
    if not trip:
        return jsonify({'message': 'Shared itinerary not found.'}), 404
    return jsonify(_public_payload(trip)), 200


@jwt_required()
def copy_shared_trip(slug):
    user_id = int(get_jwt_identity())
    source = Trip.query.filter_by(public_slug=slug, is_public=True).first()
    if not source:
        return jsonify({'message': 'Shared itinerary not found.'}), 404

    clone = Trip(
        user_id=user_id,
        trip_name=f"{source.trip_name} Copy",
        destination=source.destination,
        start_date=source.start_date,
        end_date=source.end_date,
        description=source.description,
        estimated_budget=source.estimated_budget,
        travelers_count=source.travelers_count,
        travel_type=source.travel_type,
        visibility='private',
        cover_image=source.cover_image,
        tags=source.tags,
        notes=source.notes
    )
    db.session.add(clone)
    db.session.flush()

    for section in source.sections:
        next_section = TripSection(
            trip_id=clone.id,
            city_name=section.city_name,
            start_date=section.start_date,
            end_date=section.end_date,
            notes=section.notes,
            position=section.position
        )
        db.session.add(next_section)
        db.session.flush()
        for activity in section.activities:
            db.session.add(Activity(
                section_id=next_section.id,
                city_id=activity.city_id,
                activity_name=activity.activity_name,
                description=activity.description,
                estimated_cost=activity.estimated_cost,
                activity_time=activity.activity_time,
                category=activity.category,
                duration=activity.duration,
                rating=activity.rating,
                image=activity.image
            ))

    db.session.commit()
    return jsonify({'message': 'Trip copied into your workspace.', 'trip': clone.to_dict()}), 201
