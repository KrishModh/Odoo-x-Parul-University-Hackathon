from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_
from db.database import db
from models.user import User
from services.cloudinary_service import upload_profile_image
from utils.security import hash_password, verify_password
from utils.validators import password_is_strong

def current_user():
    return User.query.get(int(get_jwt_identity()))

@jwt_required()
def get_profile():
    user = current_user()
    return jsonify({'user': user.to_dict()}), 200

@jwt_required()
def update_profile():
    user = current_user()
    data = request.form.to_dict()

    username = data.get('username', user.username).strip()
    email = data.get('email', user.email).lower().strip()
    if len(username) < 3:
        return jsonify({'message': 'Username must be at least 3 characters.'}), 400

    existing = User.query.filter(or_(User.username == username, User.email == email), User.id != user.id).first()
    if existing:
        return jsonify({'message': 'Username or email is already in use.'}), 409

    profile_file = request.files.get('profile_image')
    if profile_file:
        try:
            user.profile_image = upload_profile_image(profile_file)
        except Exception:
            return jsonify({'message': 'Unable to upload profile image.'}), 502

    if data.get('remove_image') == 'true':
        user.profile_image = None

    user.first_name = data.get('first_name', user.first_name).strip()
    user.last_name = data.get('last_name', user.last_name).strip()
    user.username = username
    user.email = email
    user.phone = data.get('phone', user.phone)
    user.country = data.get('country', user.country)
    user.bio = data.get('bio', user.bio)
    user.preferred_theme = data.get('preferred_theme', user.preferred_theme)

    db.session.commit()
    return jsonify({'message': 'Profile updated.', 'user': user.to_dict()}), 200

@jwt_required()
def update_password():
    user = current_user()
    payload = request.get_json() or {}
    if not verify_password(payload.get('current_password', ''), user.password_hash):
        return jsonify({'message': 'Current password is incorrect.'}), 401
    if not password_is_strong(payload.get('new_password', '')):
        return jsonify({'message': 'New password must include uppercase, lowercase, number, symbol, and 8+ characters.'}), 400
    user.password_hash = hash_password(payload['new_password'])
    db.session.commit()
    return jsonify({'message': 'Password updated.'}), 200

@jwt_required()
def delete_account():
    user = current_user()
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Account deleted.'}), 200
