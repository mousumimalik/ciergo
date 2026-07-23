import { useCallback, useEffect, useState } from 'react'
import {
  createBooking,
  deleteBooking,
  fetchBookings,
  updateBooking,
} from '../api/bookings'
import { ApiError } from '../api/client'
import type { ApiBooking } from '../types/api'
import type { Booking } from '../types/booking'

interface UseBookingsResult {
  bookings: Booking[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  softDeleteBooking: (booking: Booking) => Promise<void>
  restoreBooking: (booking: Booking) => Promise<void>
  duplicateBooking: (booking: Booking) => Promise<void>
  mutating: boolean
}

function requireApiId(booking: Booking): string {
  if (!booking.apiId) {
    throw new Error(
      'This booking cannot be updated yet. Duplicate it first, then try again.',
    )
  }
  return booking.apiId
}

export function useBookings(): UseBookingsResult {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [mutating, setMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBookings()
      setBookings(data)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Failed to load bookings (${err.status})`
          : 'Failed to load bookings. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const runMutation = useCallback(
    async (action: () => Promise<void>) => {
      setMutating(true)
      try {
        await action()
        await refetch()
      } finally {
        setMutating(false)
      }
    },
    [refetch],
  )

  const softDeleteBooking = useCallback(
    (booking: Booking) =>
      runMutation(async () => {
        const apiId = requireApiId(booking)
        await deleteBooking(apiId)
      }),
    [runMutation],
  )

  const restoreBooking = useCallback(
    (booking: Booking) =>
      runMutation(() =>
        updateBooking(requireApiId(booking), { isDeleted: false }).then(() => undefined),
      ),
    [runMutation],
  )

  const duplicateBooking = useCallback(
    (booking: Booking) =>
      runMutation(() => {
        const payload: Partial<ApiBooking> = {
          bookingId: `${booking.id}-COPY-${Date.now().toString().slice(-4)}`,
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
          paymentStatus: 'Pending',
          totalAmount: booking.amount,
          customerPaid: 0,
          customerDue: booking.customerDue,
          vendorPaid: 0,
          vendorDue: booking.vendorDue,
          currency: booking.currency,
          isIncomplete: booking.isIncomplete,
          isDeleted: false,
        }
        return createBooking(payload).then(() => undefined)
      }),
    [runMutation],
  )

  return {
    bookings,
    loading,
    error,
    refetch,
    softDeleteBooking,
    restoreBooking,
    duplicateBooking,
    mutating,
  }
}
