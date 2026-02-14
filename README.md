# 🏨 LuxeStay — Hotel Management System

A full-stack hotel management system built with **FastAPI** (Python) and **Next.js** (React/TypeScript). Features role-based access control, room management, online bookings, and a modern dashboard.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Authentication** | JWT-based login & registration with role-based access (Admin, Staff, Guest) |
| **Room Management** | Create room types and individual rooms with pricing, capacity & availability |
| **Booking System** | Guests book rooms; admins/staff confirm, complete, or cancel bookings |
| **Admin Dashboard** | Stats overview, recent bookings, quick actions, user management |
| **User Management** | Admins can view all users and update roles |
| **Responsive UI** | Modern glassmorphism design with Tailwind CSS, dark theme landing page |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy, Pydantic |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **Database** | SQLite (default, swappable to PostgreSQL) |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
Hotel Management System/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT token utils & dependency guards
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── routers/       # API route handlers
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   ├── services/      # Business logic layer (extensible)
│   │   ├── database.py    # DB engine & session config
│   │   └── main.py        # FastAPI app entrypoint
│   ├── .env.example       # Environment variable template
│   └── requirements.txt   # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/     # Protected dashboard pages
│   │   │   ├── bookings/  # Booking management
│   │   │   ├── rooms/     # Room management
│   │   │   └── users/     # User management (admin only)
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── rooms/         # Public room listing
│   │   ├── layout.tsx     # Root layout with AuthProvider
│   │   └── page.tsx       # Landing page
│   ├── lib/
│   │   ├── api.ts         # Axios API client with interceptors
│   │   └── auth-context.tsx  # React auth context provider
│   ├── .env.example       # Frontend env template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/Hotel-Management-System.git
cd Hotel-Management-System
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and set a strong SECRET_KEY

# Run the server
uvicorn app.main:app --reload
```

The API will be available at **http://localhost:8000**  
Interactive docs at **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run the dev server
npm run dev
```

The frontend will be available at **http://localhost:3000**

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login & get JWT token | Public |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/users/me` | Get current user profile | Authenticated |
| `GET` | `/users/` | List all users | Admin |
| `PATCH` | `/users/{id}/role` | Update user role | Admin |

### Rooms
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/rooms/types` | Create room type | Admin |
| `GET` | `/rooms/types` | List room types | Public |
| `POST` | `/rooms/` | Create a room | Admin |
| `GET` | `/rooms/` | List rooms | Public |
| `GET` | `/rooms/{id}` | Get room details | Public |
| `DELETE` | `/rooms/{id}` | Delete a room | Admin |

### Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/bookings/` | Create a booking | Authenticated |
| `GET` | `/bookings/my` | Get my bookings | Authenticated |
| `GET` | `/bookings/` | List all bookings | Admin |
| `PATCH` | `/bookings/{id}/status` | Update booking status | Admin |
| `DELETE` | `/bookings/{id}` | Cancel a booking | Owner / Admin |

---

## 🗃️ Database Models

```
User ──────┐
  │        │
  ▼        ▼
Booking   Review
  │
  ▼
Room ────── RoomType
  │
  ▼
Booking ──── Payment
```

- **User** — email, password (hashed), full name, role (admin/staff/guest)
- **RoomType** — name, description, base price, capacity
- **Room** — room number, type, availability status
- **Booking** — user, room, dates, total price, status (pending/confirmed/cancelled/completed)
- **Payment** — booking, amount, payment method, transaction ID
- **Review** — user, rating, comment

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Full access — manage rooms, bookings, users, and roles |
| **Staff** | View all bookings, manage rooms, confirm/complete bookings |
| **Guest** | Browse rooms, create bookings, view own bookings |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./hotel.db` |
| `SECRET_KEY` | JWT signing secret | — |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes | `30` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
