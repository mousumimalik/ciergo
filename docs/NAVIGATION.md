# Navigation

Routes, sidebar, and in-app navigation for the Finance → Bookings module.

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Redirect | Sends users to `/finance/bookings` |
| `/finance/bookings` | BookingsPage | Bookings table with filters, tabs, and actions |
| `/finance/bookings/calendar` | BookingCalendarPage | Weekly bookings timeline |

## Sidebar

The sidebar follows the Ciergo product layout. Wired routes in this build:

- **Finance → Bookings** → `/finance/bookings`

Other items (Dashboard, Sales, Operations, Content, Directory, Reports, Settings, and other Finance links) are shown for layout parity and are not linked to pages.

Expandable groups (Sales, Approvals, Finance, Directory) open and close on click. Finance expands automatically when the current path starts with `/finance`.

The sidebar can collapse to an icon strip; the Ciergo logo remains visible in the header area.

## Header breadcrumbs

| Page | Trail |
|------|-------|
| Bookings list | Home / Finance / Bookings |
| Calendar | Home / Finance / Bookings / Booking Calendar |

## Bookings ↔ Calendar

- From bookings: calendar icon in the summary pills row → `/finance/bookings/calendar`
- From calendar: same icon or **Finance → Bookings** in the sidebar

The calendar icon is highlighted on the calendar route.

## Bookings page tabs

| Tab | Content |
|-----|---------|
| Bookings | Active bookings (respects incomplete toggle) |
| Deleted | Soft-deleted bookings |
| Waiting for Approval | Incomplete bookings awaiting workflow |

On **Waiting for Approval**, use the **All / Pending / Approved / Rejected** dropdown to narrow rows.

## Customer ledger

Click any **Booking ID** in the table to open the customer ledger modal.
