import os
import json
from urllib import parse, request as urlrequest, error as urlerror
from flask import current_app
from google.auth.transport import requests
from google.oauth2 import id_token

def verify_google_credential(credential):
    client_id = current_app.config.get('GOOGLE_CLIENT_ID') or os.getenv('GOOGLE_CLIENT_ID')
    return id_token.verify_oauth2_token(
        credential,
        requests.Request(),
        client_id
    )

def exchange_code_for_verified_email(code):
    # current_app.config ke saath os.getenv fallback
    client_id = current_app.config.get('GOOGLE_CLIENT_ID') or os.getenv('GOOGLE_CLIENT_ID')
    client_secret = current_app.config.get('GOOGLE_CLIENT_SECRET') or os.getenv('GOOGLE_CLIENT_SECRET')

    if not client_id or not client_secret:
        raise RuntimeError('Google OAuth credentials are not configured.')

    payload = parse.urlencode({
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }).encode('utf-8')

    token_request = urlrequest.Request(
        'https://oauth2.googleapis.com/token',
        data=payload,
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )

    try:
        with urlrequest.urlopen(token_request, timeout=10) as response:
            token_payload = json.loads(response.read().decode('utf-8'))
    except urlerror.HTTPError as e:
        error_body = e.read().decode('utf-8')
        raise ValueError(f'Google token exchange failed: {e.code} - {error_body}')
    except urlerror.URLError as e:
        raise ValueError(f'Network error: {e.reason}')

    id_token_str = token_payload.get('id_token')
    if not id_token_str:
        raise ValueError(f'No id_token in Google response: {token_payload}')

    google_user = id_token.verify_oauth2_token(
        id_token_str,
        requests.Request(),
        client_id
    )

    if not google_user.get('email_verified'):
        raise ValueError('Google account email is not verified.')

    return google_user.get('email', '').lower().strip()