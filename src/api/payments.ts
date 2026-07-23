import { apiClient } from './client'
import { mapApiPayment, toApiPaymentPayload } from './mappers'
import type { ApiPayment } from '../types/api'
import type { Payment, PaymentFormData } from '../types/payment'

export async function fetchPayments(): Promise<Payment[]> {
  const data = await apiClient.get<ApiPayment[]>('/Payments')
  return data.map(mapApiPayment)
}

export async function createPayment(
  form: PaymentFormData,
  paymentId: string,
  bookingId: string,
): Promise<Payment> {
  const payload = toApiPaymentPayload(form, paymentId, bookingId)
  const created = await apiClient.post<ApiPayment>('/Payments', payload)
  return mapApiPayment(created)
}

export async function updatePayment(
  apiId: string,
  form: PaymentFormData,
  paymentId: string,
  bookingId: string,
): Promise<Payment> {
  const payload = toApiPaymentPayload(form, paymentId, bookingId)
  const updated = await apiClient.put<ApiPayment>(`/Payments/${apiId}`, payload)
  return mapApiPayment(updated)
}
