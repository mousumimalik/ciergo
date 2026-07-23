export type PaymentParty = 'customer' | 'vendor'

export type PaymentMode = 'Cash' | 'UPI' | 'Cheque' | 'Card' | 'Bank Transfer'

export interface PaymentEntryFields {
  amount: string
  reference: string
}

export interface Payment {
  id?: string
  paymentId: string
  bookingId: string
  party: PaymentParty
  partyName: string
  paymentDate: string
  amount: number
  currency: string
  paymentMode: PaymentMode
  reference: string
  notes: string
  depositIncentive: PaymentEntryFields
  cashback: PaymentEntryFields
  bankCharges: PaymentEntryFields
  isAdvance: boolean
  attachment?: { name: string; type?: string } | null
}

export interface PaymentFormData {
  party: PaymentParty
  partyName: string
  paymentDate: string
  amount: string
  currency: string
  paymentMode: PaymentMode
  reference: string
  notes: string
  depositIncentive: PaymentEntryFields
  cashback: PaymentEntryFields
  bankCharges: PaymentEntryFields
  isAdvance: boolean
  attachment?: File | null
  attachmentMeta?: { name: string; type?: string } | null
}

export interface PaymentBreakdown {
  customerPaid: number
  customerPending: number
  vendorPaid: number
  vendorPending: number
}
