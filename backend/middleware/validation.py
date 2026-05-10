from functools import wraps
from flask import jsonify, request

def require_json(required_fields):
    def decorator(handler):
        @wraps(handler)
        def wrapper(*args, **kwargs):
            payload = request.get_json(silent=True) or {}
            missing = [field for field in required_fields if not payload.get(field)]
            if missing:
                return jsonify({'message': f'Missing fields: {", ".join(missing)}'}), 400
            return handler(*args, **kwargs)
        return wrapper
    return decorator
