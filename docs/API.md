# API reference

The bookings page uses a REST API. In local development this points at MockAPI; override the base URL with `VITE_API_BASE_URL`.

**Default base URL:** `https://6a54c25de49d9eb2cc551b80.mockapi.io`

Implementation: `src/api/client.ts`, `src/api/bookings.ts`, `src/api/payments.ts`

## Bookings

| Method | Path | Used in the app |
|--------|------|-----------------|
| GET | `/Bookings` | Initial load, reload, after mutations |
| POST | `/Bookings` | Duplicate booking (row actions menu) |
| PUT | `/Bookings/:id` | Restore booking from Deleted tab |
| DELETE | `/Bookings/:id` | Delete booking (row actions menu) |

### Booking records without a server id

Some pre-seeded rows on MockAPI do not include a server-generated `id`. Update and delete only work on records created during your session (e.g. after **Duplicate**). The app shows a toast if you try to delete or restore a row that has no id.

## Payments

| Method | Path | Used in the app |
|--------|------|-----------------|
| GET | `/Payments` | Payment status pills, View Payments list |
| POST | `/Payments` | Record Payment sidesheet (create) |
| PUT | `/Payments/:id` | Record Payment sidesheet (edit) |

Payments are linked to bookings via `bookingId` in the payload.

## Data flow

```
BookingsPage
  ├── useBookings()  → GET /Bookings
  └── usePayments()  → GET /Payments
        ↓
  enrichBookingWithPayments()  → payment status per row
        ↓
  filters, tabs, summary pills, table
```

Mutations refetch the relevant list after success. **Reload** on the filter bar resets filters and refetches both bookings and payments.

## Features without API backing

These are rendered in the UI but do not persist to the server:

- Approve / reject booking
- Voucher document downloads
- Tasks column
- Customer ledger modal
- Calendar timeline (`/finance/bookings/calendar`)
- Edit / Link row actions (toast only)
- Payment file attachments (stored in browser memory only)

## Error handling

- Failed GET requests show an error banner with **Try again** (retries both endpoints).
- Failed POST/PUT/DELETE show a toast with the error message.
- HTTP errors use `ApiError` from `src/api/client.ts` with status code when available.
