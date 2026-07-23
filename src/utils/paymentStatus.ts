import type { Booking, PaymentStatus } from '../types/booking'
import type { Payment, PaymentBreakdown } from '../types/payment'

export function getPaymentsForBooking(payments: Payment[], bookingId: string): Payment[] {
  return payments.filter((p) => p.bookingId === bookingId)
}

export function computePaymentBreakdown(
  booking: Booking,
  payments: Payment[],
): PaymentBreakdown {
  const bookingPayments = getPaymentsForBooking(payments, booking.id)

  const customerPaid = bookingPayments
    .filter((p) => p.party === 'customer')
    .reduce((sum, p) => sum + p.amount, 0)

  const vendorPaid = bookingPayments
    .filter((p) => p.party === 'vendor')
    .reduce((sum, p) => sum + p.amount, 0)

  const customerTotal = booking.customerPaid + booking.customerDue
  const vendorTotal = booking.vendorPaid + booking.vendorDue

  return {
    customerPaid,
    customerPending: Math.max(0, customerTotal - customerPaid),
    vendorPaid,
    vendorPending: Math.max(0, vendorTotal - vendorPaid),
  }
}

export function computePaymentStatus(
  booking: Booking,
  payments: Payment[],
): PaymentStatus {
  const { customerPaid, customerPending, vendorPaid, vendorPending } =
    computePaymentBreakdown(booking, payments)

  const totalPaid = customerPaid + vendorPaid
  const totalPending = customerPending + vendorPending

  if (totalPaid === 0) return 'Pending'
  if (totalPending <= 0) return 'Paid'
  return 'Partially Paid'
}

export function enrichBookingWithPayments(
  booking: Booking,
  payments: Payment[],
): Booking {
  const breakdown = computePaymentBreakdown(booking, payments)
  return {
    ...booking,
    paymentStatus: computePaymentStatus(booking, payments),
    pendingCustomerAmount: breakdown.customerPending,
    pendingVendorAmount: breakdown.vendorPending,
  }
}
