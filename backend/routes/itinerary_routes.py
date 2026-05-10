from flask import Blueprint
from controllers.itinerary_controller import create_section, delete_section, get_budget, get_itinerary, update_itinerary, update_section

itinerary_bp = Blueprint('itinerary', __name__)

itinerary_bp.post('/create-section')(create_section)
itinerary_bp.get('/<int:trip_id>')(get_itinerary)
itinerary_bp.put('/update')(update_itinerary)
itinerary_bp.put('/update-section')(update_section)
itinerary_bp.delete('/delete-section')(delete_section)
