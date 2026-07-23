# Features

Reference for everything implemented on the Finance → Bookings experience.

## Summary metrics

Three pills at the top of the bookings page:

| Pill | Calculation |
|------|-------------|
| **Net** | Absolute difference between total customer due and total vendor due across active bookings |
| **You Give** | Sum of `vendorDue` on non-deleted bookings |
| **You Get** | Sum of `customerDue` on non-deleted bookings |

While bookings or payments are loading, only the numeric values show a dot loader; labels stay visible.

**More Actions** (top right):

- **Select** — row checkboxes in the table; **Select all** / **Deselect all** / **Cancel**
- **Export** — placeholder control (no export API)
- **Calendar** — link to `/finance/bookings/calendar`

## Filters

| Control | Behavior |
|---------|----------|
| Booking Date | Date range on `bookingDate` |
| Travel Date | Date range on `travelDate` |
| Booking Owner | Modal to pick primary (and optionally secondary) owners; options built from API `bookingOwner` values |
| Booking Type | All Bookings / Other Services / Limitless |
| Search | Booking ID, lead pax name, or amount |
| Reload | Resets all filters and refetches bookings + payments |

**Show Incomplete Bookings** toggle (table header):

- Off (default on Bookings tab): shows complete bookings only
- On: shows incomplete bookings only

## Tabs

| Tab | Rows shown |
|-----|------------|
| **Bookings** | Non-deleted; filtered by incomplete toggle |
| **Deleted** | `isDeleted === true`; Restore and Duplicate in actions |
| **Waiting for Approval** | Incomplete bookings; visible when user has admin or approve-all permission |

On **Waiting for Approval**, a dropdown filters by All / Approved / Pending / Rejected.

Default sort: **modifiedAt** descending (newest first). Column sort overrides for Travel/Booking Date and Amount.

## Table columns

Core columns: Booking ID, Lead Pax, Service, Travel Date, Booking Date, Amount, Payment Status, Service Status, Actions.

Optional columns (column header menus):

- **Billed To** — customer / vendor billing labels
- **Service Status** — separate status column when enabled

Header popovers support:

- Service type filter (Flight, Accommodation, etc.)
- Date column toggle (travel vs booking date) with sort
- Amount sort

## Payment status

Derived from GET `/Payments` plus booking due amounts:

| Status | Condition |
|--------|-----------|
| Pending | No recorded payments for the booking |
| Partially Paid | Some payments recorded, balance remains |
| Paid | Customer and vendor balances fully covered by recorded payments |

Hover the status pill for a tooltip with customer/vendor paid and pending amounts.

## Record Payment sidesheet

Opened via **Record** on a booking row (Bookings tab, or approved rows on Waiting tab).

| Field | Notes |
|-------|--------|
| Party | Customer or Vendor radio |
| Payment ID | Auto-generated: `PI-xxxxx` (customer) or `PO-xxxxx` (vendor) |
| Name | Prefilled from booking |
| Payment Date | Defaults to today |
| Amount | Prefilled with outstanding due for selected party |
| Currency | Defaults to booking currency (INR) |
| Payment Mode | Cash, UPI, Cheque, Card, Bank Transfer |
| Reference / Notes | Optional text |
| Accordions | Deposit/Incentive, Cashback, Bank Charges |
| Advance | Optional flag with confirmation dialog |
| Attachment | Local file pick (image/PDF); not uploaded to API |

**Record Payment** submits POST `/Payments`. **Update Payment** submits PUT `/Payments/:id` in edit mode.

## View Payments

**View** on a row opens a list sidesheet for that booking’s payments.

- **View** — read-only sidesheet
- **Edit** — editable sidesheet (requires payment server id)
- Empty state when no payments exist

## Row actions

### Payment buttons
- **Record** — create payment
- **View** — payment list

### Overflow menu (⋯)
| Action | API |
|--------|-----|
| Edit | Toast only |
| Delete | DELETE `/Bookings/:id` (requires server id) |
| Link | Toast only |
| Duplicate | POST `/Bookings` |
| Send for Approval again | Toast only (rejected bookings) |

### Deleted tab
- **Restore** — PUT `/Bookings/:id` with `isDeleted: false`
- **Duplicate** — POST `/Bookings`

### Waiting tab (pending + permission)
- Approve / Reject icon buttons — confirm dialog, toast only

## Voucher & tasks

- **Voucher** — dropdown with four document types; downloads a placeholder PDF locally
- **Tasks** — badge or plus icon; no task API (count from API is always 0)

## Customer ledger

Click a **Booking ID** to open the ledger modal for that customer. Uses local fixture data in `src/data/mockLedger.ts`.

## Calendar

`/finance/bookings/calendar` shows a weekly timeline from `src/data/json/calendarBookings.json`. Toggle via the calendar icon in the summary row or sidebar navigation.

## Loading, error, and empty states

| State | UI |
|-------|-----|
| Loading | Skeleton table; dot loaders on summary values |
| Error | Message + **Try again** |
| No matching rows | “No bookings found” + refresh |

## Defaults for missing API values

| Type | Display |
|------|---------|
| Numbers | `0` |
| Text | `NA` |
| Dates | Formatted via moment; invalid/missing → `NA` |

## Permissions

Current user role and approve permissions come from `src/data/json/currentUser.json` (not the bookings API). This controls visibility of the Waiting tab and approve/reject buttons.
