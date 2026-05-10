from flask import Blueprint
from controllers.discovery_controller import get_city, list_cities, search_cities

city_bp = Blueprint('cities', __name__)

city_bp.get('')(list_cities)
city_bp.get('/search')(search_cities)
city_bp.get('/<int:city_id>')(get_city)
