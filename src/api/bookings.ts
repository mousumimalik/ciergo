import { apiClient } from './client'
import { mapApiBooking, mapApiBookings } from './mappers'
import type { ApiBooking } from '../types/api'
import type { Booking } from '../types/booking'

export async function fetchBookings(): Promise<Booking[]> {
  const data = await apiClient.get<ApiBooking[]>('/Bookings')
  return mapApiBookings(data)
}

export async function createBooking(payload: Partial<ApiBooking>): Promise<Booking> {
  const created = await apiClient.post<ApiBooking>('/Bookings', payload)
  return mapApiBooking(created, 0)
}

export async function updateBooking(
  apiId: string,
  payload: Partial<ApiBooking>,
): Promise<Booking> {
  const updated = await apiClient.put<ApiBooking>(`/Bookings/${apiId}`, payload)
  return mapApiBooking(updated, 0)
}

export async function deleteBooking(apiId: string): Promise<void> {
  await apiClient.delete(`/Bookings/${apiId}`)
}
