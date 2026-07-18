import type { Owner } from '../types/booking'
import ownersData from './json/owners.json'

export const owners = ownersData as Owner[]

export const ownerNames = owners.map((o) => o.name)
