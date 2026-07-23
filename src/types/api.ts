export interface ApiBooking {
  id?: string
  ID?: string
  bookingId: string
  leadPax: string
  customerId: string
  customerName: string
  vendorId?: string
  vendorName?: string
  service: string
  bookingDate: string
  travelDate: string
  bookingType: string
  bookingOwner?: string
  serviceStatus: string
  paymentStatus: string
  totalAmount: number
  customerPaid: number
  customerDue: number
  vendorPaid: number
  vendorDue: number
  currency: string
  isIncomplete: boolean
  isDeleted: boolean
  approvalStatus?: string
  createdAt?: string
  modifiedAt?: string
  deletedAt?: string
}

export interface ApiPayment {
  id?: string
  PaymentID?: string
  paymentId?: string
  BookingID?: string
  bookingId?: string
  Type?: string
  CustomerORVendor?: string
  party?: string
  entityName?: string
  partyName?: string
  paymentDate?: string
  date?: string
  amount: number
  currency?: string
  paymentMode?: string
  mode?: string
  transactionRef?: string
  reference?: string
  notes?: string
  depositIncentive?: string
  cashback?: string
  bankCharges?: string
  isAdvance?: boolean
  documentUrl?: string
  attachment?: { name: string; type?: string } | null
  status?: string
  createdAt?: string
}
