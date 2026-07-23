import type { Booking, FinancialSummary } from '../types/booking'

export function calculateSummary(bookings: Booking[]): FinancialSummary {
  const active = bookings.filter((b) => !b.isDeleted)
  const youGive = active.reduce((sum, b) => sum + b.vendorDue, 0)
  const youGet = active.reduce((sum, b) => sum + b.customerDue, 0)
  const net = youGet - youGive
  return { youGive, youGet, net }
}
