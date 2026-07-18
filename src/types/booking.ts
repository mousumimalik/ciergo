export type ServiceType =
  | 'Flight'
  | 'Accommodation'
  | 'Transportation'
  | 'Explore UAE'
  | 'Hotel'

export type ServiceStatus = 'Confirmed' | 'Rescheduled' | 'Cancelled'

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending'

export type BookingStatus = 'Approved' | 'Pending' | 'Rejected'

export type BookingTab = 'bookings' | 'waiting' | 'deleted'

export type ApprovalFilter = 'All' | 'Pending' | 'Approved' | 'Rejected'

export type BookingType = 'All Bookings' | 'Other Services' | 'Limitless'

export type BookingSource = 'OS' | 'Limitless'

export interface Owner {
  id: string
  name: string
  initials: string
  color: string
}

export interface Booking {
  id: string
  leadPax: string
  customerId: string
  customerName: string
  travelDate: string
  bookingDate: string
  service: ServiceType
  paymentStatus: PaymentStatus
  bookingStatus: BookingStatus
  amount: number
  owners: Owner[]
  taskCount: number
  isDeleted: boolean
  isIncomplete: boolean
  requiresApproval: boolean
  modifiedAt: string
  deletedAt?: string
  source: BookingSource
  serviceStatus: ServiceStatus
  billedTo: string
  pendingCustomerAmount: number
  pendingVendorAmount: number
  destination?: string
}

export interface BookingsFilters {
  bookingDateStart: string
  bookingDateEnd: string
  travelDateStart: string
  travelDateEnd: string
  primaryOwners: string[]
  secondaryOwners: string[]
  advancedOwnerSearch: boolean
  bookingType: BookingType
  searchQuery: string
  showIncomplete: boolean
}

export interface FinancialSummary {
  youGive: number
  youGet: number
  net: number
}

export interface UserRole {
  isAdmin: boolean
  canApproveAll: boolean
  canApproveUsers: string[]
}
