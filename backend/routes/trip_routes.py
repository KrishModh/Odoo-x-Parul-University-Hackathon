from flask import Blueprint
from controllers.trip_controller import create_trip, delete_trip, get_trip, list_trips, list_user_trips, update_trip

trip_bp = Blueprint('trips', __name__)

trip_bp.post('/create')(create_trip)
trip_bp.get('')(list_trips)
trip_bp.get('/user')(list_user_trips)
trip_bp.get('/<int:trip_id>')(get_trip)
trip_bp.put('/<int:trip_id>')(update_trip)
trip_bp.delete('/<int:trip_id>')(delete_trip)
