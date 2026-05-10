from flask import Blueprint
from controllers.itinerary_controller import create_section, delete_section, update_section

itinerary_bp = Blueprint('itinerary', __name__)

itinerary_bp.post('/create-section')(create_section)
itinerary_bp.put('/update-section')(update_section)
itinerary_bp.delete('/delete-section')(delete_section)
