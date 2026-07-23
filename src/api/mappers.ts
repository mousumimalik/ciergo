import type { ApiBooking, ApiPayment } from '../types/api'
import type { Booking, Owner, PaymentStatus, ServiceStatus, ServiceType } from '../types/booking'
import type { Payment, PaymentFormData, PaymentParty } from '../types/payment'
import { apiNumber, apiString, NA } from '../utils/apiDefaults'
import { parseApiDate } from '../utils/dates'
import { ownerIdFromName } from '../utils/owners'
import { sortByModifiedAtDesc } from '../utils/sortBookings'

const OWNER_COLORS = ['#6F35D0', '#2563EB', '#059669', '#D97706', '#DC2626']

function mapService(service: string): ServiceType {
  const normalized = service.toLowerCase()
  if (normalized.includes('flight')) return 'Flight'
  if (normalized.includes('accommodation') || normalized.includes('hotel')) return 'Accommodation'
  if (normalized.includes('transport')) return 'Transportation'
  if (normalized.includes('uae') || normalized.includes('explore')) return 'Explore UAE'
  return 'Flight'
}

function mapOwners(bookingOwner: string, index = 0): Owner[] {
  if (bookingOwner === NA) {
    return [{ id: 'unassigned', name: NA, initials: 'NA', color: OWNER_COLORS[0] }]
  }

  return bookingOwner.split(',').map((part, i) => {
    const name = part.trim()
    const nameParts = name.split(/\s+/)
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase()
    return {
      id: ownerIdFromName(name),
      name,
      initials,
      color: OWNER_COLORS[(index + i) % OWNER_COLORS.length],
    }
  })
}

function mapServiceStatus(status: string): ServiceStatus {
  if (status === 'Rescheduled' || status === 'Cancelled') return status
  return 'Confirmed'
}

function mapPaymentStatus(status: string): PaymentStatus {
  if (status === 'Paid' || status === 'Partially Paid') return status
  return 'Pending'
}

function mapBookingStatus(api: ApiBooking): Booking['bookingStatus'] {
  const status = api.approvalStatus?.toLowerCase()
  if (status === 'rejected') return 'Rejected'
  if (status === 'approved') return 'Approved'
  if (status === 'pending' || api.isIncomplete) return 'Pending'
  return 'Approved'
}

export function mapApiBooking(api: ApiBooking, index: number): Booking {
  const bookingTypeRaw = apiString(api.bookingType)
  const bookingType = bookingTypeRaw.toLowerCase()
  const source = bookingType.includes('limitless') ? 'Limitless' : 'OS'
  const customerName = apiString(api.customerName)
  const serviceRaw = apiString(api.service)

  return {
    id: apiString(api.bookingId),
    apiId: api.id ?? api.ID,
    leadPax: apiString(api.leadPax),
    customerId: apiString(api.customerId),
    customerName,
    vendorId: apiString(api.vendorId),
    vendorName: apiString(api.vendorName),
    travelDate: parseApiDate(api.travelDate),
    bookingDate: parseApiDate(api.bookingDate),
    service: serviceRaw === NA ? 'Flight' : mapService(serviceRaw),
    serviceLabel: serviceRaw,
    paymentStatus: mapPaymentStatus(apiString(api.paymentStatus)),
    bookingStatus: mapBookingStatus(api),
    amount: apiNumber(api.totalAmount),
    customerPaid: apiNumber(api.customerPaid),
    customerDue: apiNumber(api.customerDue),
    vendorPaid: apiNumber(api.vendorPaid),
    vendorDue: apiNumber(api.vendorDue),
    owners: mapOwners(apiString(api.bookingOwner), index),
    taskCount: 0,
    isDeleted: Boolean(api.isDeleted),
    isIncomplete: Boolean(api.isIncomplete),
    requiresApproval: Boolean(api.isIncomplete) || api.approvalStatus === 'Pending',
    modifiedAt: parseApiDate(api.modifiedAt ?? api.createdAt) || NA,
    deletedAt: api.deletedAt ? parseApiDate(api.deletedAt) : undefined,
    source,
    serviceStatus: mapServiceStatus(apiString(api.serviceStatus)),
    billedTo: customerName,
    pendingCustomerAmount: apiNumber(api.customerDue),
    pendingVendorAmount: apiNumber(api.vendorDue),
    currency: apiString(api.currency),
  }
}

function parseEntryJson(value?: string): { amount: string; reference: string } {
  if (!value) return { amount: '', reference: '' }
  try {
    const parsed = JSON.parse(value) as { amount?: string; reference?: string }
    return { amount: parsed.amount ?? '', reference: parsed.reference ?? '' }
  } catch {
    return { amount: value === value && !Number.isNaN(Number(value)) ? value : '', reference: '' }
  }
}

function normalizeParty(api: ApiPayment): PaymentParty {
  const raw = (api.party ?? api.CustomerORVendor ?? '').toLowerCase()
  return raw.includes('vendor') ? 'vendor' : 'customer'
}

export function mapApiPayment(api: ApiPayment): Payment {
  const party = normalizeParty(api)
  const mode = apiString(api.mode ?? api.paymentMode)
  return {
    id: api.id,
    paymentId: apiString(api.paymentId ?? api.PaymentID),
    bookingId: apiString(api.bookingId ?? api.BookingID),
    party,
    partyName: apiString(api.partyName ?? api.entityName),
    paymentDate: parseApiDate(api.date ?? api.paymentDate),
    amount: apiNumber(api.amount),
    currency: apiString(api.currency),
    paymentMode: (mode === NA ? 'Bank Transfer' : mode) as Payment['paymentMode'],
    reference: apiString(api.reference ?? api.transactionRef),
    notes: api.notes ?? '',
    depositIncentive: parseEntryJson(api.depositIncentive),
    cashback: parseEntryJson(api.cashback),
    bankCharges: parseEntryJson(api.bankCharges),
    isAdvance: Boolean(api.isAdvance),
    attachment: api.attachment ?? null,
  }
}

export function toApiPaymentPayload(
  form: PaymentFormData,
  paymentId: string,
  bookingId: string,
): Record<string, unknown> {
  const partyLabel = form.party === 'customer' ? 'Customer' : 'Vendor'
  const entry = (fields: { amount: string; reference: string }) =>
    JSON.stringify({ amount: fields.amount, reference: fields.reference })

  return {
    PaymentID: paymentId,
    paymentId,
    BookingID: bookingId,
    bookingId,
    Type: partyLabel,
    CustomerORVendor: partyLabel,
    party: form.party,
    entityName: form.partyName,
    partyName: form.partyName,
    paymentDate: form.paymentDate,
    date: form.paymentDate,
    amount: Number(form.amount) || 0,
    currency: form.currency,
    paymentMode: form.paymentMode,
    mode: form.paymentMode,
    transactionRef: form.reference,
    reference: form.reference,
    notes: form.notes,
    depositIncentive: entry(form.depositIncentive),
    cashback: entry(form.cashback),
    bankCharges: entry(form.bankCharges),
    isAdvance: form.isAdvance,
    attachment: form.attachmentMeta ?? null,
    status: 'Completed',
  }
}

export function mapApiBookings(data: ApiBooking[]): Booking[] {
  return sortByModifiedAtDesc(data.map((item, index) => mapApiBooking(item, index)))
}

export function bookingToApiPayload(
  booking: Booking,
  patch: Partial<ApiBooking> = {},
): Partial<ApiBooking> {
  return {
    bookingId: booking.id,
    leadPax: booking.leadPax,
    customerId: booking.customerId,
    customerName: booking.customerName,
    vendorId: booking.vendorId,
    vendorName: booking.vendorName,
    service: booking.serviceLabel,
    bookingDate: booking.bookingDate,
    travelDate: booking.travelDate,
    bookingType: booking.source === 'Limitless' ? 'Limitless' : 'On Ground',
    bookingOwner: booking.owners.map((o) => o.name).join(', '),
    serviceStatus: booking.serviceStatus,
    paymentStatus: booking.paymentStatus,
    totalAmount: booking.amount,
    customerPaid: booking.customerPaid,
    customerDue: booking.customerDue,
    vendorPaid: booking.vendorPaid,
    vendorDue: booking.vendorDue,
    currency: booking.currency,
    isIncomplete: booking.isIncomplete,
    isDeleted: booking.isDeleted,
    modifiedAt: new Date().toISOString().slice(0, 10),
    ...patch,
  }
}
