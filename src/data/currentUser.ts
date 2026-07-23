import type { UserRole } from '../types/booking'
import currentUserData from './json/currentUser.json'

export const currentUser = currentUserData as UserRole & {
  name: string
  role: string
  avatar: string
}
