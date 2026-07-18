# Navigation & Routing

This document describes how navigation works in the Ciergo Finance → Bookings implementation.

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Redirect | Redirects to `/finance/bookings` |
| `/finance/bookings` | BookingsPage | Main bookings table with filters, tabs, and actions |
| `/finance/bookings/calendar` | BookingCalendarPage | Weekly bookings timeline / calendar view |

## Sidebar

The sidebar mirrors the Ciergo product navigation. Only the following destinations are wired to real routes:

- **Finance → Bookings** → `/finance/bookings`

All other sidebar items (Dashboard, Sales, Operations, Content, Directory, Reports, Settings, and other Finance sub-items) are displayed for UI parity but are not linked to pages in this assessment scope.

Expandable groups (Sales, Approvals, Finance, Directory) can be opened and closed. Finance auto-expands when the current route is under `/finance`.

## Header Breadcrumbs

Breadcrumbs update based on the active page:

- Bookings list: `Home / Finance / Bookings`
- Calendar view: `Home / Finance / Bookings / Booking Calendar`

## In-Page Navigation

### Bookings → Calendar

Use the **calendar icon** in the summary pills row (top right) to open the Booking Calendar view at `/finance/bookings/calendar`.

The calendar icon is highlighted when the calendar page is active.

### Calendar → Bookings

Use the same calendar icon toggle, or navigate via **Finance → Bookings** in the sidebar.

## Tabs (Bookings Page)

| Tab | Data shown |
|-----|------------|
| Bookings | Approved, non-deleted bookings |
| Deleted | Soft-deleted bookings (restore / duplicate actions) |
| Waiting for Approval | Pending, approved, or rejected bookings awaiting workflow |

The **Waiting for Approval** tab includes an **All / Pending / Approved / Rejected** filter dropdown.

## Customer Ledger

Click any **Booking ID** in the table to open the Customer Ledger modal for that booking’s customer.
