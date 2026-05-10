from flask import jsonify, request
from sqlalchemy import or_
from models.city import City
from models.itinerary import Activity

def city_query():
    query = City.query
    search = request.args.get('q', '').strip()
    country = request.args.get('country', '').strip()
    region = request.args.get('region', '').strip()
    budget = request.args.get('budget', type=float)
    popularity = request.args.get('popularity', type=int)

    if search:
        query = query.filter(or_(City.name.ilike(f'%{search}%'), City.description.ilike(f'%{search}%')))
    if country:
        query = query.filter(City.country.ilike(f'%{country}%'))
    if region:
        query = query.filter(City.region.ilike(f'%{region}%'))
    if budget:
        query = query.filter(City.avg_budget <= budget)
    if popularity:
        query = query.filter(City.popularity_score >= popularity)
    return query.order_by(City.popularity_score.desc())

def activity_query():
    query = Activity.query.filter(Activity.city_id.isnot(None))
    search = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()
    budget = request.args.get('budget', type=float)
    duration = request.args.get('duration', '').strip()

    if search:
        query = query.filter(or_(Activity.activity_name.ilike(f'%{search}%'), Activity.description.ilike(f'%{search}%')))
    if category:
        query = query.filter(Activity.category.ilike(f'%{category}%'))
    if budget:
        query = query.filter(Activity.estimated_cost <= budget)
    if duration:
        query = query.filter(Activity.duration.ilike(f'%{duration}%'))
    return query.order_by(Activity.rating.desc().nullslast())

def list_cities():
    return jsonify({'cities': [city.to_dict() for city in city_query().limit(60).all()]}), 200

def search_cities():
    return list_cities()

def get_city(city_id):
    city = City.query.get(city_id)
    if not city:
        return jsonify({'message': 'City not found.'}), 404
    payload = city.to_dict()
    payload['activities'] = [activity.to_dict() for activity in city.activities]
    return jsonify({'city': payload}), 200

def list_discovery_activities():
    return jsonify({'activities': [activity.to_dict() for activity in activity_query().limit(80).all()]}), 200

def search_discovery_activities():
    return list_discovery_activities()

def get_discovery_activity(activity_id):
    activity = Activity.query.filter(Activity.id == activity_id, Activity.city_id.isnot(None)).first()
    if not activity:
        return jsonify({'message': 'Activity not found.'}), 404
    return jsonify({'activity': activity.to_dict()}), 200
