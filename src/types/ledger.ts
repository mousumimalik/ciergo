export type LedgerEntryType =
  | 'Booking Created'
  | 'Money Received'
  | 'Booking Cancelled'
  | 'Money Paid'

export type LedgerStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Settled'

export type LedgerMode = 'PayIn' | 'PayOut' | 'Invoice' | 'Credit Note' | 'Debit Note'

export interface LedgerEntry {
  id: string
  service: string
  date: string
  bookingDate: string
  travelDate: string
  status: LedgerStatus
  mode: LedgerMode
  account: string
  amount: number
  closingBalance: number
  type: LedgerEntryType
  isPendingInvoice: boolean
}

export interface CustomerLedgerData {
  customerId: string
  customerName: string
  entries: LedgerEntry[]
}

export type CollectPayStatus = 'You Collect' | 'You Pay'
