# Ciergo — Finance Bookings

Frontend implementation of the **Ciergo Finance → Bookings** dashboard, built as a React + TypeScript assessment project. All data is local mock data — no backend or API integration.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production build

```bash
npm run build
npm run preview
```

## Routes

| Route | View |
|-------|------|
| `/finance/bookings` | Bookings table (default) |
| `/finance/bookings/calendar` | Bookings timeline / calendar |

See [docs/NAVIGATION.md](./docs/NAVIGATION.md) for sidebar, breadcrumb, and in-page navigation details.

## Features

### Bookings Page
- Summary pills: **Net** (green/red), **You Give** (red), **You Get** (green)
- Filters: Booking Date, Travel Date, Booking Owner (multi-select + advanced search), Booking Type, search, reset
- Tabs: **Bookings**, **Deleted**, **Waiting for Approval** (with All/Pending/Approved/Rejected dropdown)
- Data table: sorting, column filters, pagination (10/20/50/100), status swap, row selection
- Voucher dropdown: Booking Voucher(s), Customer Invoice(s), Vendor Voucher(s), Vendor Invoice(s)
- Actions: payment record, edit, delete, link, duplicate, approve/reject, restore, send for approval
- Customer Ledger modal: filters, You Collect/You Pay, view PDF, download, share

### Calendar Page
- Weekly timeline grid with booking cards
- Status legend: Completed, On Trip, Upcoming, Cancelled
- Date range navigation and filters

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- TanStack Table
- React Router
- Lucide React
- date-fns

## Project Structure

```
src/
├── components/
│   ├── bookings/     # Table, filters, summary pills, modals
│   ├── layout/       # Sidebar, header, app shell
│   ├── ledger/       # Customer ledger modal
│   └── ui/           # Shared UI primitives
├── data/
│   ├── json/         # Mock JSON datasets
│   ├── mockBookings.ts
│   ├── mockOwners.ts
│   └── mockLedger.ts
├── pages/            # Route-level pages
├── types/            # TypeScript interfaces
└── utils/            # Formatting and helpers
```

## Mock Data

Static JSON files live in `src/data/json/`:

| File | Purpose |
|------|---------|
| `bookings.json` | 78 booking records for the table |
| `owners.json` | Booking owner profiles |
| `ledger.json` | Customer ledger entries |
| `currentUser.json` | Logged-in user (admin with full approval access) |
| `summary.json` | You Give / You Get amounts for summary pills |
| `calendarBookings.json` | Timeline cards for the calendar view |

TypeScript modules in `src/data/` import these JSON files and export typed constants used across the app.

## Assessment Notes

Per the product brief:

- UI follows the Figma designs for layout, colors, and interactions
- All table interactions (filter, sort, paginate, tab switch) work against mock data
- PDF download, share, and approval flows are UI-only with simulated behavior
- No authentication, backend, database, or real API integration

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |
