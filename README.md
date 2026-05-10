<div align="center">

# ✈️ Traveloop

### *Your Intelligent Travel Web Application*

> Plan smarter. Travel better. Share everything.

<br/>

[![React](https://img.shields.io/badge/React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=111)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT%20Auth-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

<br/>

**Built at Odoo × Parul University Hackathon**

</div>

---

## 🧭 What is Traveloop?

**Traveloop** is a premium, full-stack AI-assisted travel planning platform that takes you from *"I want to go somewhere"* to a **fully structured, shareable travel plan** — all in one intelligent workspace.

It's not just another travel app. Traveloop is a **connected travel operating system** where your trips, itineraries, budgets, packing lists, and memories stay in sync — powered by a real PostgreSQL backend and a polished glassmorphism UI.

---
## 🖼️ Screenshots

<br/>

### 🔐 Login Page
<img width="2560" height="1440" alt="Screenshot (1310)" src="https://github.com/user-attachments/assets/a3401f68-6422-4f6a-87b6-f903cca10958" />

---

### 📝 Signup Page
<img width="2560" height="1440" alt="Screenshot (1311)" src="https://github.com/user-attachments/assets/bb018ac3-301c-446a-8e63-dc5e3f0c5004" />

---

### 📊 Dashboard
<img width="2560" height="1440" alt="Screenshot (1302)" src="https://github.com/user-attachments/assets/44d2418e-2842-407d-8bec-3777ad3c3f59" />

---

### ✈️ My Trips
<img width="2560" height="1440" alt="Screenshot (1303)" src="https://github.com/user-attachments/assets/d351bb0f-6bc1-4e44-b75c-e9818742f2ba" />

---

### ➕ Create Trip
<img width="2560" height="1440" alt="Screenshot (1304)" src="https://github.com/user-attachments/assets/ad224b03-b8be-46ab-84c2-c4e9017b7541" />

---

### 💰 Budget
<img width="2560" height="1440" alt="Screenshot (1305)" src="https://github.com/user-attachments/assets/a8220abc-2f08-49ea-8a9b-779df7ae6c2b" />

---

### 🎯 Activity
<img width="2560" height="1440" alt="Screenshot (1306)" src="https://github.com/user-attachments/assets/2f606b84-2e18-4493-953b-2be203966ecc" />

---

### 🎒 Packing Checklist
<img width="2560" height="1440" alt="Screenshot (1307)" src="https://github.com/user-attachments/assets/87e74c78-af01-4296-a434-80b99dc7b19a" />

---

### 📓 Journal / Notes
<img width="2560" height="1440" alt="Screenshot (1308)" src="https://github.com/user-attachments/assets/188e526b-aa53-4538-bdbd-88c9ee239646" />

---

### 👤 My Profile
<img width="2560" height="1440" alt="Screenshot (1309)" src="https://github.com/user-attachments/assets/ef04c061-1833-4b64-b6eb-be69874e7b68" />

---

## ⚡ Core Features at a Glance

| Module | What It Does |
|---|---|
| 🔐 **Auth System** | Manual signup + JWT sessions + bcrypt password hashing + Google email verification |
| 📊 **Live Dashboard** | Real-time widgets for trips, activities, budgets, packing progress, and recommendations |
| ✈️ **Trip Management** | Create, edit, delete trips with cover image upload via Cloudinary |
| 🗺️ **Itinerary Builder** | City/section-based planning with activities, timings, and cost tracking |
| 💰 **Budget Intelligence** | Real cost calculations pulled directly from itinerary activity data |
| 🎒 **Packing Checklist** | Categorized, trip-synced checklist with completion tracking |
| 📓 **Travel Journal** | Day/city/activity notes with image uploads and memory management |
| 🔗 **Public Sharing** | Generate a public slug link for your itinerary — anyone can view or copy it |
| 🔍 **Global Search** | Live navbar search across trips, cities, activities, and itinerary items |
| 🔔 **Smart Notifications** | Budget alerts, itinerary gap detection, trip reminders, checklist nudges |
| 🌏 **Destination Discovery** | Curated data for 10 top Indian destinations with activity suggestions |
| 🌙 **Dark / Light Mode** | Full theme toggle with glassmorphism UI throughout |

---

## 🗺️ User Journey

```
Landing Page
    ↓
Signup (manual form)
    ↓
Google Email Verification (ownership check only)
    ↓
Login → JWT Session
    ↓
Dashboard (live data)
    ↓
Create Trip → Upload Cover → Save to PostgreSQL
    ↓
Itinerary Builder → Add Cities → Add Activities
    ↓
Explore Discovery → Add curated cities/activities
    ↓
View Itinerary + Budget Summary
    ↓
Pack Checklist + Write Journal
    ↓
Generate Public Itinerary Link → Share with the world 🌍
```

---

## 🧱 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React.js + Vite | Component UI + ultra-fast dev builds |
| React Router DOM | Client-side routing and protected page flows |
| Context API | Auth, theme, and trip state management |
| Axios | API client with JWT interceptor |
| Framer Motion | Page, card, modal, and dropdown animations |
| CSS Modules Architecture | Page/component/layout scoped styles |

### Backend
| Tech | Purpose |
|---|---|
| Python Flask | REST API server |
| Flask-JWT-Extended | Protected routes via JWT tokens |
| Flask-SQLAlchemy | ORM for PostgreSQL |
| PostgreSQL | Primary relational database |
| bcrypt | Secure password hashing |
| google-auth | Google email ownership verification |
| Cloudinary SDK | Image upload for trips, profiles, and journals |

---

## 🏗️ Architecture Overview

```
Traveloop
│
├── Frontend (React + Vite)
│   ├── Auth UI + JWT session management
│   ├── Main layout with sidebar + topbar
│   ├── Dynamic dashboard with real backend data
│   ├── Trip, Itinerary, Checklist, Journal, Profile pages
│   └── Curated city/activity discovery via local JSON
│
├── Backend (Flask REST API)
│   ├── Modular routes / controllers / services
│   ├── JWT-protected user and trip operations
│   ├── SQLAlchemy ORM models + relationships
│   ├── Cloudinary media upload services
│   └── Google email verification service
│
└── Database (PostgreSQL)
    ├── Users
    ├── Trips
    ├── Trip Sections
    ├── Activities
    ├── Budget Breakdowns
    ├── Packing Checklists
    ├── Cities
    └── Journal Entries
```

---

## 🗄️ Database Schema

```
User
 └── Trip
      ├── TripSection
      │    └── Activity
      ├── BudgetBreakdown
      ├── PackingChecklist
      └── Journal

City
 └── Activity (discovery relationship)
```

---

## 📡 API Reference

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register with verified Google token |
| `POST` | `/api/auth/login` | Login + receive JWT |
| `POST` | `/api/auth/verify-email/google` | Verify email via Google |
| `GET` | `/api/auth/me` | Get current authenticated user |

</details>

<details>
<summary><strong>✈️ Trips</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/trips/create` | Create trip with Cloudinary cover |
| `GET` | `/api/trips/user` | Fetch user's trips |
| `GET` | `/api/trips/:id` | Fetch one trip |
| `PUT` | `/api/trips/:id` | Update trip |
| `DELETE` | `/api/trips/:id` | Delete trip |

</details>

<details>
<summary><strong>🗺️ Itinerary & Activities</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/itinerary/:tripId` | Full itinerary + budget summary |
| `POST` | `/api/itinerary/create-section` | Add city/stop section |
| `PUT` | `/api/itinerary/update-section` | Update section |
| `DELETE` | `/api/itinerary/delete-section` | Remove section |
| `POST` | `/api/activities/create` | Add activity |
| `PUT` | `/api/activities/update` | Update activity |
| `DELETE` | `/api/activities/delete` | Remove activity |

</details>

<details>
<summary><strong>💰 Budget / 🎒 Checklist / 📓 Journal / 🔗 Sharing</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/budget/:tripId` | Dynamic budget calculations |
| `GET` | `/api/checklist/:tripId` | Fetch checklist |
| `POST` | `/api/checklist/create` | Add checklist item |
| `PUT` | `/api/checklist/update` | Update item |
| `DELETE` | `/api/checklist/reset/:tripId` | Reset checklist |
| `GET` | `/api/journal/:tripId` | Fetch journal entries |
| `POST` | `/api/journal/create` | Create note + image |
| `POST` | `/api/share/generate` | Generate public slug |
| `GET` | `/api/share/:slug` | Public read-only itinerary |
| `POST` | `/api/share/:slug/copy` | Copy shared trip |

</details>

---

## 🔑 Google Verification Flow

Traveloop uses Google **only to verify email ownership** — not as a login replacement.

```
1. User fills manual signup form
2. Clicks "Verify Email with Google"
3. Google popup authenticates the selected Google account
4. Backend exchanges the Google token securely
5. Backend checks: does the Google email match the entered email?
6. If match → backend issues a verification token
7. Registration proceeds with that token ✅
```

User credentials remain fully managed by Traveloop. Google is just the email ownership check.

---

## 🌏 Curated Destinations

Discovery is powered by local curated JSON for these 10 Indian destinations:

| 🏔️ Leh | 🏖️ Goa | 🏰 Jaipur | 🛶 Kerala | ❄️ Manali |
|---|---|---|---|---|
| **🕌 Kashmir** | **🧘 Rishikesh** | **🌊 Andaman** | **🎋 Darjeeling** | **🏯 Udaipur** |

Selections from discovery can still be saved into PostgreSQL through the itinerary API.

---

## 🚀 Local Setup

### 1. Clone

```bash
git clone <repository-url>
cd Odoo-x-Parul-University-Hackathon
```

### 2. PostgreSQL

```sql
CREATE DATABASE traveloop;
```

### 3. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python run.py
# → Running at http://localhost:5000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
# → Running at http://localhost:5173
```

---

## ⚙️ Environment Variables

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_APP_NAME=Traveloop
```

**`backend/.env`**
```env
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5000

SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/traveloop
FRONTEND_ORIGIN=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

No secrets or credentials are hardcoded anywhere in the application.

---

## 🔒 Security Highlights

- JWT-protected routes with token-based session management
- Backend ownership verification before every trip/itinerary/journal operation
- bcrypt password hashing (no plain text passwords ever)
- Google verification token prevents frontend-only bypass attacks
- All Cloudinary credentials secured in backend `.env`
- Axios interceptor auto-attaches JWT on every frontend request

---

## 🔭 Roadmap

- [ ] AI-generated itinerary planning
- [ ] AI travel assistant chat
- [ ] Google Maps / Mapbox integration
- [ ] Live weather and travel advisories
- [ ] Hotel, flight, and activity booking integrations
- [ ] Collaborative trip planning with invited users
- [ ] Real-time notifications via WebSockets
- [ ] Expense tracking with receipt uploads
- [ ] Mobile PWA support
- [ ] Alembic migrations + production deployment pipeline

---

## 👨‍💻 Team

<br/>

<div align="center">

### 🏆 Krish Modh — *Team Leader & Primary Developer*

*Full-stack development · Architecture design · Frontend + Backend · End-to-end implementation*

[![GitHub](https://img.shields.io/badge/GitHub-KrishModh-181717?style=for-the-badge&logo=github)](https://github.com/KrishModh)

---

### Aakansha Patidar — *Frontend Developer*

*UI development · Component engineering · Page flows · Styling*

[![GitHub](https://img.shields.io/badge/GitHub-AakanshaPatidar-181717?style=for-the-badge&logo=github)](https://github.com/Aakanshapatidar)

---

### Sahil Khan — *Backend Developer*

*Backend engineering · API integration · Business logic · Database design*

[![GitHub](https://img.shields.io/badge/GitHub-SahilKhan-181717?style=for-the-badge&logo=github)](https://github.com/SahilKhan145)

</div>

---

## 📄 License

Built for the **Odoo × Parul University Hackathon**. For educational and demo use.
Add a formal license before any public production release.

---

<div align="center">

**Traveloop** — *Polished enough for a demo. Connected enough to feel real. Structured enough to keep growing.*

</div>
<!-- done -->