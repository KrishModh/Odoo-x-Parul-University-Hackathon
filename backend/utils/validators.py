import re
from email_validator import validate_email, EmailNotValidError

def is_valid_email(email):
    try:
        validate_email(email, check_deliverability=False)
        return True
    except EmailNotValidError:
        return False

def password_is_strong(password):
    return (
        len(password) >= 8 and
        re.search(r'[A-Z]', password) and
        re.search(r'[a-z]', password) and
        re.search(r'\d', password) and
        re.search(r'[^A-Za-z0-9]', password)
    )

def validate_register_payload(data):
    required = ['first_name', 'last_name', 'username', 'email', 'password']
    missing = [field for field in required if not data.get(field)]
    if missing:
        return f'Missing fields: {", ".join(missing)}'
    if not re.match(r'^[a-zA-Z0-9_]{3,24}$', data.get('username', '')):
        return 'Username must be 3-24 characters and use letters, numbers, or underscores.'
    if not is_valid_email(data.get('email', '')):
        return 'A valid email is required.'
    if not password_is_strong(data.get('password', '')):
        return 'Password must include uppercase, lowercase, number, symbol, and 8+ characters.'
    return None
