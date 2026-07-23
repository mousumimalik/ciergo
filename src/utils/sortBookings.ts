import type { Booking } from '../types/booking'
import { toTimestamp } from './dates'

export function sortByModifiedAtDesc(bookings: Booking[]): Booking[] {
  return [...bookings].sort(
    (a, b) => toTimestamp(b.modifiedAt) - toTimestamp(a.modifiedAt),
  )
}

export function sortByDeletedAtDesc(bookings: Booking[]): Booking[] {
  return [...bookings].sort(
    (a, b) => toTimestamp(b.deletedAt) - toTimestamp(a.deletedAt),
  )
}
