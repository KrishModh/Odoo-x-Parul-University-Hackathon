from datetime import datetime
from decimal import Decimal, InvalidOperation

TRAVEL_TYPES = {'solo', 'family', 'friends', 'business', 'couple'}
VISIBILITY_TYPES = {'private', 'public'}

def parse_tags(tags_value):
    if not tags_value:
        return []
    return [tag.strip() for tag in tags_value.split(',') if tag.strip()]

def parse_date(value, field_name):
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        raise ValueError(f'{field_name} must be a valid YYYY-MM-DD date.')

def parse_positive_decimal(value, field_name):
    try:
        amount = Decimal(str(value))
    except (InvalidOperation, TypeError):
        raise ValueError(f'{field_name} must be a valid number.')
    if amount <= 0:
        raise ValueError(f'{field_name} must be positive.')
    return amount

def parse_positive_integer(value, field_name):
    try:
        number = int(value)
    except (TypeError, ValueError):
        raise ValueError(f'{field_name} must be a valid integer.')
    if number <= 0:
        raise ValueError(f'{field_name} must be positive.')
    return number

def validate_trip_payload(data, partial=False):
    required = [
        'trip_name',
        'destination',
        'start_date',
        'end_date',
        'description',
        'estimated_budget',
        'travelers_count',
        'travel_type',
        'visibility'
    ]

    if not partial:
        missing = [field for field in required if not data.get(field)]
        if missing:
            raise ValueError(f'Missing fields: {", ".join(missing)}')

    parsed = {}

    if 'trip_name' in data:
        trip_name = data.get('trip_name', '').strip()
        if len(trip_name) < 3:
            raise ValueError('Trip name must be at least 3 characters.')
        parsed['trip_name'] = trip_name

    if 'destination' in data:
        destination = data.get('destination', '').strip()
        if len(destination) < 2:
            raise ValueError('Destination must be at least 2 characters.')
        parsed['destination'] = destination

    if 'description' in data:
        description = data.get('description', '').strip()
        if len(description) < 10:
            raise ValueError('Trip description must be at least 10 characters.')
        parsed['description'] = description

    if 'start_date' in data:
        parsed['start_date'] = parse_date(data.get('start_date'), 'Start date')

    if 'end_date' in data:
        parsed['end_date'] = parse_date(data.get('end_date'), 'End date')

    start_date = parsed.get('start_date')
    end_date = parsed.get('end_date')
    if start_date and end_date and end_date < start_date:
        raise ValueError('End date cannot be before start date.')

    if 'estimated_budget' in data:
        parsed['estimated_budget'] = parse_positive_decimal(data.get('estimated_budget'), 'Estimated budget')

    if 'travelers_count' in data:
        parsed['travelers_count'] = parse_positive_integer(data.get('travelers_count'), 'Number of travelers')

    if 'travel_type' in data:
        travel_type = data.get('travel_type', '').strip().lower()
        if travel_type not in TRAVEL_TYPES:
            raise ValueError('Travel type is invalid.')
        parsed['travel_type'] = travel_type

    if 'visibility' in data:
        visibility = data.get('visibility', '').strip().lower()
        if visibility not in VISIBILITY_TYPES:
            raise ValueError('Trip visibility is invalid.')
        parsed['visibility'] = visibility

    if 'tags' in data:
        parsed['tags'] = parse_tags(data.get('tags'))

    if 'notes' in data:
        parsed['notes'] = data.get('notes', '').strip() or None

    return parsed
