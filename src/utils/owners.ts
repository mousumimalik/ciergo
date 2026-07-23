import type { Owner } from '../types/booking'
import { NA } from './apiDefaults'

export function ownerIdFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function extractOwnersFromBookings(bookings: { owners: Owner[] }[]): Owner[] {
  const map = new Map<string, Owner>()
  for (const booking of bookings) {
    for (const owner of booking.owners) {
      if (owner.name && owner.name !== NA) {
        map.set(owner.id, owner)
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}
