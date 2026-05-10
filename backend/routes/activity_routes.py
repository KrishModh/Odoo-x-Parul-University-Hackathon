from flask import Blueprint
from controllers.discovery_controller import get_discovery_activity, list_discovery_activities, search_discovery_activities
from controllers.itinerary_controller import create_activity, delete_activity, update_activity

activity_bp = Blueprint('activities', __name__)

activity_bp.get('')(list_discovery_activities)
activity_bp.get('/search')(search_discovery_activities)
activity_bp.post('/create')(create_activity)
activity_bp.put('/update')(update_activity)
activity_bp.delete('/delete')(delete_activity)
activity_bp.get('/<int:activity_id>')(get_discovery_activity)
