# LuxeStay — Frontend

Luxury hotel website + management dashboard built with **Next.js 14, React, TypeScript and Tailwind CSS**.
It currently runs on **demo data** (saved in the browser's localStorage) so it works without a backend.

## Run it

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

## Demo accounts

| Role  | Email               | Password  | Goes to       |
|-------|---------------------|-----------|---------------|
| Admin | admin@luxestay.com  | admin123  | `/dashboard`  |
| Staff | staff@luxestay.com  | staff123  | `/dashboard`  |
| Guest | guest@luxestay.com  | guest123  | `/account`    |

The login page also has one-click demo buttons. **Reset demo data** is in the dashboard sidebar.

## What's included

**Guest website**
- Home: hero with availability search, rooms, amenities, dining, spa, offers, events, reviews
- Rooms list (filters, live availability) and room detail with price calculator
- 3-step booking: dates & room → extras (breakfast, airport pickup…) → details & payment (card / mobile money / pay at hotel)
- Dining: restaurants, full menu with categories & search, basket, checkout (room service / dine-in / takeaway), live order tracking
- Spa & experiences booking (massage, yoga, airport transfer, safari…)
- Contact form, guest account (stays, orders, spa bookings, loyalty points, reviews, profile)

**Management dashboard** (admin & staff)
- Overview: occupancy, arrivals/departures, revenue chart, room status, live kitchen orders
- Reservations: search/filter, confirm, assign room, check-in, check-out, cancel
- Front desk room board by floor + room types & nightly rates
- Housekeeping task board (completing a task frees the room)
- Kitchen order board (New → Preparing → Ready → Delivered)
- Menu management (add/edit/delete, hide items)
- Spa & service requests, guests & user roles (admin), reviews moderation & inbox, staff (admin)

Tip: open the guest site and the kitchen board in two tabs — orders sync between tabs instantly.

## Customising

- Hotel name, phone, address, currency, tax: `lib/config.ts`
- Demo rooms, menu, staff, photos: `lib/seed.ts`
- Colours & fonts: `tailwind.config.ts`

## Connecting the Java backend later

All data access goes through one file: `lib/store.tsx`. Each action there (`login`, `createBooking`,
`placeOrder`, `setOrderStatus`, …) can be swapped for an API call to the Java (Spring Boot) backend.
The data shapes the backend should return are defined in `lib/types.ts`.
