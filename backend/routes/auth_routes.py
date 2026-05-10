from flask import Blueprint
from controllers.auth_controller import login, me, register, verify_google_email
from middleware.validation import require_json

auth_bp = Blueprint('auth', __name__)

auth_bp.post('/register')(register)
auth_bp.post('/login')(require_json(['email', 'password'])(login))
auth_bp.post('/verify-email/google')(require_json(['code', 'email'])(verify_google_email))
auth_bp.get('/me')(me)
