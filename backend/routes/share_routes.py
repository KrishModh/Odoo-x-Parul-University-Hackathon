from flask import Blueprint
from controllers.share_controller import copy_shared_trip, generate_share, get_shared_itinerary

share_bp = Blueprint('share', __name__)

share_bp.post('/generate')(generate_share)
share_bp.get('/<slug>')(get_shared_itinerary)
share_bp.post('/<slug>/copy')(copy_shared_trip)
