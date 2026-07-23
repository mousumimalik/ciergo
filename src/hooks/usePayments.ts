import { useCallback, useEffect, useState } from 'react'
import { createPayment, fetchPayments, updatePayment } from '../api/payments'
import { ApiError } from '../api/client'
import type { Payment, PaymentFormData } from '../types/payment'

interface UsePaymentsResult {
  payments: Payment[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  savePayment: (
    form: PaymentFormData,
    paymentId: string,
    bookingId: string,
  ) => Promise<Payment>
  editPayment: (
    apiId: string,
    form: PaymentFormData,
    paymentId: string,
    bookingId: string,
  ) => Promise<Payment>
  saving: boolean
}

export function usePayments(): UsePaymentsResult {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPayments()
      setPayments(data)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Failed to load payments (${err.status})`
          : 'Failed to load payments. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const savePayment = useCallback(
    async (form: PaymentFormData, paymentId: string, bookingId: string) => {
      setSaving(true)
      try {
        const created = await createPayment(form, paymentId, bookingId)
        setPayments((prev) => [...prev, created])
        return created
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const editPayment = useCallback(
    async (
      apiId: string,
      form: PaymentFormData,
      paymentId: string,
      bookingId: string,
    ) => {
      setSaving(true)
      try {
        const updated = await updatePayment(apiId, form, paymentId, bookingId)
        setPayments((prev) => prev.map((p) => (p.id === apiId ? updated : p)))
        return updated
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  return { payments, loading, error, refetch, savePayment, editPayment, saving }
}
