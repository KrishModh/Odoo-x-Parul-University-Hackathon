from flask import Blueprint
from controllers.user_controller import delete_account, get_profile, update_password, update_profile

user_bp = Blueprint('user', __name__)

user_bp.get('/profile')(get_profile)
user_bp.put('/update-profile')(update_profile)
user_bp.put('/update-password')(update_password)
user_bp.delete('/delete-account')(delete_account)
