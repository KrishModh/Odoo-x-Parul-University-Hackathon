# Traveloop Auth Module

Traveloop is a premium AI-powered travel planning platform. This repository contains a production-minded login and signup module with a React/Vite frontend and Flask/PostgreSQL backend.

## Features

- Premium responsive login and signup UI
- Dark and light theme support
- JWT register/login flow
- Password hashing with bcrypt
- PostgreSQL models with SQLAlchemy
- Cloudinary profile image upload support
- Google-based signup email verification
- Axios API layer with token handling
- Live validation, loading states, and polished animations

## Project Structure

```text
frontend/
  src/
    pages/
    components/
    layouts/
    hooks/
    context/
    services/
    routes/
    assets/
    styles/
      pages/
      components/
      layouts/
      themes/
      globals/
      animations/
backend/
  config/
  controllers/
  db/
  middleware/
  models/
  routes/
  services/
  utils/
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` from `frontend/.env.example`.

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Create `backend/.env` from `backend/.env.example`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email/google`
- `GET /api/auth/me`
- `POST /api/trips/create`
- `GET /api/trips/user`
- `GET /api/trips`
- `GET /api/trips/:id`
- `PUT /api/trips/:id`
- `DELETE /api/trips/:id`
- `POST /api/itinerary/create-section`
- `PUT /api/itinerary/update-section`
- `DELETE /api/itinerary/delete-section`
- `POST /api/activities/create`
- `PUT /api/activities/update`
- `DELETE /api/activities/delete`
- `GET /api/health`

## Signup Verification Flow

Users manually enter every signup field, including password. Google is used only to verify email ownership:

1. The frontend opens a Google popup and receives an authorization code.
2. Flask exchanges that code with Google using `.env` credentials.
3. Flask compares the verified Google email with the manually entered email.
4. Flask returns a short-lived signed verification token only when the emails match.
5. Registration succeeds only when that token matches the submitted email.

## Notes

No API URLs, secrets, database URLs, OAuth keys, or Cloudinary credentials are hardcoded. Configure them through `.env` files before running the app.
