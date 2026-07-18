import type { Booking, UserRole } from '../types/booking'
import bookingsData from './json/bookings.json'
import currentUserData from './json/currentUser.json'

export const mockBookings = bookingsData as Booking[]

export const currentUser = currentUserData as UserRole & {
  name: string
  role: string
  avatar: string
}
