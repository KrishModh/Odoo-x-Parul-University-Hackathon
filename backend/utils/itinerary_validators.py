from datetime import datetime
from decimal import Decimal, InvalidOperation

def parse_date(value, field_name):
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        raise ValueError(f'{field_name} must be a valid YYYY-MM-DD date.')

def parse_time(value):
    try:
        return datetime.strptime(value, '%H:%M').time()
    except (TypeError, ValueError):
        raise ValueError('Activity time must be a valid HH:MM time.')

def parse_cost(value):
    if value in (None, ''):
        return Decimal('0')
    try:
        amount = Decimal(str(value))
    except (InvalidOperation, TypeError):
        raise ValueError('Estimated cost must be a valid number.')
    if amount < 0:
        raise ValueError('Estimated cost cannot be negative.')
    return amount

def validate_section_payload(data, partial=False):
    if not partial:
        missing = [field for field in ['trip_id', 'city_name', 'start_date', 'end_date'] if not data.get(field)]
        if missing:
            raise ValueError(f'Missing fields: {", ".join(missing)}')

    parsed = {}
    if 'trip_id' in data:
        parsed['trip_id'] = int(data.get('trip_id'))
    if 'city_name' in data:
        city_name = data.get('city_name', '').strip()
        if len(city_name) < 2:
            raise ValueError('City name must be at least 2 characters.')
        parsed['city_name'] = city_name
    if 'start_date' in data:
        parsed['start_date'] = parse_date(data.get('start_date'), 'Start date')
    if 'end_date' in data:
        parsed['end_date'] = parse_date(data.get('end_date'), 'End date')
    if parsed.get('start_date') and parsed.get('end_date') and parsed['end_date'] < parsed['start_date']:
        raise ValueError('Section end date cannot be before start date.')
    if 'notes' in data:
        parsed['notes'] = data.get('notes', '').strip() or None
    if 'position' in data:
        parsed['position'] = int(data.get('position') or 0)
    return parsed

def validate_activity_payload(data, partial=False):
    if not partial:
        missing = [field for field in ['section_id', 'activity_name', 'activity_time'] if not data.get(field)]
        if missing:
            raise ValueError(f'Missing fields: {", ".join(missing)}')

    parsed = {}
    if 'section_id' in data:
        parsed['section_id'] = int(data.get('section_id')) if data.get('section_id') not in (None, '') else None
    if 'city_id' in data:
        parsed['city_id'] = int(data.get('city_id')) if data.get('city_id') not in (None, '') else None
    if 'activity_name' in data:
        name = data.get('activity_name', '').strip()
        if len(name) < 2:
            raise ValueError('Activity name must be at least 2 characters.')
        parsed['activity_name'] = name
    if 'description' in data:
        parsed['description'] = data.get('description', '').strip() or None
    if 'estimated_cost' in data:
        parsed['estimated_cost'] = parse_cost(data.get('estimated_cost'))
    if 'activity_time' in data:
        parsed['activity_time'] = parse_time(data.get('activity_time'))
    if 'category' in data:
        parsed['category'] = data.get('category', '').strip() or 'experience'
    if 'duration' in data:
        parsed['duration'] = data.get('duration', '').strip() or None
    if 'rating' in data:
        parsed['rating'] = parse_cost(data.get('rating'))
    if 'image' in data:
        parsed['image'] = data.get('image', '').strip() or None
    return parsed
