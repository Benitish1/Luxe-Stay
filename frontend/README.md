# LuxeStay Frontend

The frontend for the LuxeStay Hotel Management System, built with Next.js 14, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── rooms/             # Public rooms listing
│   └── dashboard/         # Protected dashboard
│       ├── page.tsx       # Dashboard home
│       ├── rooms/         # Room management
│       ├── bookings/      # Booking management
│       └── users/         # User management (admin)
├── lib/                   # Utilities
│   ├── api.ts            # API client with axios
│   └── auth-context.tsx  # Authentication context
└── ...config files
```

## Features

- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔐 JWT-based authentication
- 📊 Dashboard with stats and overview
- 🛏️ Room management (CRUD)
- 📅 Booking system
- 👥 User management (admin only)
- 🌙 Dark mode landing page
