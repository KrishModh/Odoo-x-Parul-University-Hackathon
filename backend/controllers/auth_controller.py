from flask import jsonify, request
from datetime import timedelta
from flask_jwt_extended import create_access_token, decode_token, get_jwt_identity, jwt_required
from sqlalchemy import or_
from db.database import db
from models.user import User
from services.cloudinary_service import upload_profile_image
from services.google_oauth_service import exchange_code_for_verified_email
from utils.security import hash_password, verify_password
from utils.validators import validate_register_payload

def issue_session(user):
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token, 'user': user.to_dict()}), 200

def register():
    data = request.form.to_dict()
    validation_error = validate_register_payload(data)
    if validation_error:
        return jsonify({'message': validation_error}), 400

    email = data['email'].lower().strip()
    verification_token = data.get('email_verification_token')
    if not verification_token:
        return jsonify({'message': 'Google email verification is required before registration.'}), 400

    try:
        verification_claims = decode_token(verification_token)
    except Exception:
        return jsonify({'message': 'Email verification has expired or is invalid.'}), 401

    if (
        verification_claims.get('purpose') != 'signup_email_verification' or
        verification_claims.get('sub') != email
    ):
        return jsonify({'message': 'Email verification does not match the registration email.'}), 401

    existing_user = User.query.filter(or_(User.email == email, User.username == data['username'])).first()
    if existing_user:
        return jsonify({'message': 'Email or username is already registered.'}), 409

    profile_image = upload_profile_image(request.files.get('profile_image'))

    user = User(
        first_name=data['first_name'].strip(),
        last_name=data['last_name'].strip(),
        username=data['username'].strip(),
        email=email,
        phone=data.get('phone'),
        password_hash=hash_password(data['password']),
        profile_image=profile_image,
        provider='local',
        is_email_verified=True
    )

    db.session.add(user)
    db.session.commit()
    return issue_session(user)

def login():
    payload = request.get_json() or {}
    email = payload.get('email', '').lower().strip()
    password = payload.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({'message': 'Invalid email or password.'}), 401

    return issue_session(user)

def verify_google_email():
    payload = request.get_json() or {}
    code = payload.get('code')
    entered_email = payload.get('email', '').lower().strip()
    if not code or not entered_email:
        return jsonify({'message': 'Google code and entered email are required.'}), 400

    try:
        verified_email = exchange_code_for_verified_email(code)
    except ValueError as e:
        import traceback
        traceback.print_exc()
        print("GOOGLE VALUE ERROR:", str(e))
        return jsonify({'message': str(e)}), 401
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("GOOGLE EXCEPTION:", str(e))
        return jsonify({'message': str(e)}), 502

    if verified_email != entered_email:
        return jsonify({'message': 'Entered email and Google verified email do not match.'}), 400

    verification_token = create_access_token(
        identity=verified_email,
        additional_claims={'purpose': 'signup_email_verification'},
        expires_delta=timedelta(minutes=10)
    )

    return jsonify({
        'email': verified_email,
        'email_verified': True,
        'email_verification_token': verification_token
    }), 200

@jwt_required()
def me():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({'message': 'User not found.'}), 404
    return jsonify({'user': user.to_dict()}), 200