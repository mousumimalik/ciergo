# Usage guide

How to run the app and verify the main flows on Finance → Bookings.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open **http://localhost:5173**. The app opens on **Finance → Bookings**.

## Page layout

1. **Summary pills** — Net, You Give, You Get (from live booking data)
2. **Filter bar** — dates, owners, type, search, reload
3. **Table card** — tabs, incomplete toggle, total count, data grid

On first load the table shows a skeleton until `/Bookings` and `/Payments` finish. Summary numbers show dot loaders during the same period.

## Browse and filter

1. Confirm rows appear after loading (e.g. `BK-00001`).
2. Switch tabs: **Bookings**, **Deleted**, **Waiting for Approval** (if your user role allows it).
3. Search by name (e.g. `Rahul`) — the table filters immediately.
4. Change **Booking Type** to Limitless or Other Services.
5. Toggle **Show Incomplete Bookings** to switch between complete and incomplete rows on the Bookings tab.
6. Click **Reload** (circular arrow) — filters reset and data refetches.

### Column sort

Click **Travel Date**, **Booking Date**, or **Amount** headers to sort. Clear sort to return to default order (most recently modified first).

### Payment status tooltip

Hover a payment status pill. The tooltip shows customer and vendor paid vs pending amounts.

## Record a payment

1. On the **Bookings** tab, click **Record** on any row.
2. Choose **Customer** or **Vendor**.
3. Review prefilled name, date, and amount (outstanding due).
4. Set payment mode, reference, and notes as needed.
5. Optionally expand Deposit/Incentive, Cashback, or Bank Charges.
6. Optionally mark as advance payment or attach a screenshot (local only).
7. Click **Record Payment**.

Expected: sidesheet closes, success toast, payment status may update after data reload.

## View and edit payments

1. Click **View** on the same row.
2. Use **View** on a listed payment for read-only detail.
3. Use **Edit** on a payment that was saved to the API.

Edit is unavailable for payments that were never persisted (no server id). Record a new payment to test edit flow.

## Booking actions

| Action | How to test |
|--------|-------------|
| Duplicate | ⋯ menu → Duplicate → new row appears after reload |
| Delete | ⋯ menu → Delete on a duplicated row (needs server id) |
| Restore | **Deleted** tab → ⋯ → Restore |
| Customer ledger | Click booking ID link |
| Voucher | Voucher icon → pick document type → PDF download |
| Approve / Reject | **Waiting** tab, pending row, if permitted |

Delete and restore require a booking with a server id. Duplicate first if the row was pre-seeded without an id.

## Loading and errors

**Reload:** summary dots appear briefly; table skeleton shows until both APIs complete.

**Simulate error:** set `VITE_API_BASE_URL` to an invalid URL in `.env`, restart dev server, refresh. An error banner with **Try again** should appear. Restore the URL from `.env.example` afterward.

**Empty table:** search for a string that matches nothing (e.g. `ZZZZNOTFOUND`). “No bookings found” is shown.

## Deployment check

- [ ] `VITE_API_BASE_URL` set in hosting environment
- [ ] Bookings and payments load on `/finance/bookings`
- [ ] Record Payment creates a row visible in View Payments
- [ ] Duplicate then Delete works on the new booking

## Troubleshooting

| Issue | Check |
|-------|--------|
| Blank or error state | `.env` URL; browser Network tab for `/Bookings` and `/Payments` |
| Delete/restore fails | Row may lack server id — duplicate first |
| Edit payment disabled | Payment may lack server id — record a new payment |
| Calendar differs from table | Calendar uses local fixtures; table uses API |

See [FEATURES.md](./FEATURES.md) and [API.md](./API.md) for full behavior and endpoints.
