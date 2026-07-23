# Ciergo — Finance Bookings

React dashboard for **Finance → Bookings**: live booking and payment data, filters, summary metrics, and payment recording.

The bookings table reads from the Ciergo API (MockAPI in development). The calendar view uses local fixture data.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the app redirects to `/finance/bookings`.

### Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base URL (default: `https://6a54c25de49d9eb2cc551b80.mockapi.io`) |

Set `VITE_API_BASE_URL` in your deployment environment (e.g. Vercel → Project → Settings → Environment Variables).

### Production build

```bash
npm run build
npm run preview
```

## Documentation

| Document | Contents |
|----------|----------|
| [docs/FEATURES.md](./docs/FEATURES.md) | Full feature reference — table, filters, payments, actions |
| [docs/API.md](./docs/API.md) | HTTP endpoints and client usage |
| [docs/NAVIGATION.md](./docs/NAVIGATION.md) | Routes, sidebar, breadcrumbs, tabs |
| [docs/USER_JOURNEY.md](./docs/USER_JOURNEY.md) | End-to-end usage and verification steps |

## Routes

| Route | View |
|-------|------|
| `/finance/bookings` | Bookings table (API-backed) |
| `/finance/bookings/calendar` | Booking calendar (local fixtures) |

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- TanStack Table
- React Router
- Lucide React
- moment (sorting and display dates)
- date-fns (date range picker)

## Project structure

```
src/
├── api/              # HTTP client, mappers, bookings & payments
├── components/
│   ├── bookings/     # Table, filters, summary pills
│   ├── layout/       # Sidebar, header, app shell
│   ├── ledger/       # Customer ledger modal
│   ├── payments/     # Record payment sidesheet, view payments
│   └── ui/           # Shared primitives (Sidesheet, Modal, etc.)
├── data/             # Fixtures (calendar, ledger, user permissions)
├── hooks/            # useBookings, usePayments
├── pages/            # Route pages
├── types/            # TypeScript types
└── utils/            # Payment status, formatting, sorting
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |
