from flask import Blueprint
from controllers.itinerary_controller import get_budget

budget_bp = Blueprint('budget', __name__)

budget_bp.get('/<int:trip_id>')(get_budget)
