import { useEffect, useMemo, useState } from 'react'
import { Paperclip, X } from 'lucide-react'
import type { Booking } from '../../types/booking'
import type { Payment, PaymentFormData, PaymentMode, PaymentParty } from '../../types/payment'
import { generatePaymentId } from '../../utils/generatePaymentId'
import { computePaymentBreakdown } from '../../utils/paymentStatus'
import {
  Sidesheet,
  SidesheetBody,
  SidesheetFooter,
  SidesheetHeader,
} from '../ui/Sidesheet'
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  PAYMENT_MODES,
  PaymentAccordions,
} from './PaymentAccordions'
import { cn } from '../../utils/cn'
import { todayIso } from '../../utils/dates'

export type DrawerMode = 'create' | 'view' | 'edit'

interface RecordPaymentDrawerProps {
  open: boolean
  booking: Booking | null
  mode: DrawerMode
  payment?: Payment | null
  existingPayments?: Payment[]
  onClose: () => void
  onSave: (form: PaymentFormData, paymentId: string) => Promise<void>
  saving?: boolean
}

function emptyForm(
  booking: Booking,
  party: PaymentParty,
  existingPayments: Payment[] = [],
): PaymentFormData {
  const breakdown = computePaymentBreakdown(booking, existingPayments)
  const outstanding =
    party === 'customer' ? breakdown.customerPending : breakdown.vendorPending

  return {
    party,
    partyName: party === 'customer' ? booking.customerName : booking.vendorName,
    paymentDate: todayIso(),
    amount: String(outstanding || ''),
    currency: booking.currency || 'INR',
    paymentMode: 'Bank Transfer',
    reference: '',
    notes: '',
    depositIncentive: { amount: '', reference: '' },
    cashback: { amount: '', reference: '' },
    bankCharges: { amount: '', reference: '' },
    isAdvance: false,
    attachment: null,
    attachmentMeta: null,
  }
}

function paymentToForm(payment: Payment): PaymentFormData {
  return {
    party: payment.party,
    partyName: payment.partyName,
    paymentDate: payment.paymentDate.slice(0, 10),
    amount: String(payment.amount),
    currency: payment.currency,
    paymentMode: payment.paymentMode,
    reference: payment.reference,
    notes: payment.notes,
    depositIncentive: { ...payment.depositIncentive },
    cashback: { ...payment.cashback },
    bankCharges: { ...payment.bankCharges },
    isAdvance: payment.isAdvance,
    attachment: null,
    attachmentMeta: payment.attachment ?? null,
  }
}

export function RecordPaymentDrawer({
  open,
  booking,
  mode,
  payment,
  existingPayments = [],
  onClose,
  onSave,
  saving = false,
}: RecordPaymentDrawerProps) {
  const [party, setParty] = useState<PaymentParty>('customer')
  const [form, setForm] = useState<PaymentFormData | null>(null)
  const [paymentId, setPaymentId] = useState('')
  const [advanceConfirm, setAdvanceConfirm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const readOnly = mode === 'view'

  useEffect(() => {
    if (!form?.attachment) {
      setPreviewUrl(null)
      return
    }
    const isImage = form.attachment.type.startsWith('image/')
    if (!isImage) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(form.attachment)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [form?.attachment])

  useEffect(() => {
    if (!open || !booking) return

    if (mode === 'create') {
      setParty('customer')
      setForm(emptyForm(booking, 'customer', existingPayments))
      setPaymentId(generatePaymentId('customer'))
      setAdvanceConfirm(false)
    } else if (payment) {
      setParty(payment.party)
      setForm(paymentToForm(payment))
      setPaymentId(payment.paymentId)
      setAdvanceConfirm(false)
    }
    setSubmitError(null)
  }, [open, booking, mode, payment, existingPayments])

  const breakdown = useMemo(() => {
    if (!booking) return null
    return computePaymentBreakdown(booking, existingPayments)
  }, [booking, existingPayments])

  function handlePartyChange(next: PaymentParty) {
    if (!booking || readOnly) return
    setParty(next)
    setForm(emptyForm(booking, next, existingPayments))
    setPaymentId(generatePaymentId(next))
  }

  function updateForm(patch: Partial<PaymentFormData>) {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  function updateAccordion(
    key: 'depositIncentive' | 'cashback' | 'bankCharges',
    field: 'amount' | 'reference',
    value: string,
  ) {
    setForm((prev) =>
      prev ? { ...prev, [key]: { ...prev[key], [field]: value } } : prev,
    )
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      updateForm({ attachment: null, attachmentMeta: null })
      return
    }
    updateForm({
      attachment: file,
      attachmentMeta: { name: file.name, type: file.type },
    })
  }

  async function handleSubmit() {
    if (!form || !booking || readOnly) return
    if (!form.amount || Number(form.amount) <= 0) {
      setSubmitError('Please enter a valid amount.')
      return
    }
    setSubmitError(null)
    try {
      await onSave(form, paymentId)
      onClose()
    } catch {
      setSubmitError('Failed to save payment. Please try again.')
    }
  }

  if (!booking || !form) return null

  const fileName = form.attachment?.name ?? form.attachmentMeta?.name
  const isImageFile =
    form.attachment?.type.startsWith('image/') ||
    Boolean(form.attachmentMeta?.type?.startsWith('image/'))

  return (
    <Sidesheet open={open} onClose={onClose}>
      <SidesheetHeader
        paymentId={mode !== 'create' ? paymentId : paymentId}
        bookingId={booking.id}
        onClose={onClose}
      />

      <SidesheetBody>
        <div className="space-y-5">
          {mode === 'create' && breakdown && (
            <div className="rounded-lg bg-[#F9F5FF] px-4 py-3 text-[12px] text-[#6B7280]">
              <span className="font-medium text-[#6F35D0]">Outstanding — </span>
              Customer {formatAmount(breakdown.customerPending)} · Vendor{' '}
              {formatAmount(breakdown.vendorPending)}
            </div>
          )}

          <div>
            <p className="mb-2.5 text-[12px] font-medium text-[#6B7280]">Payment For</p>
            <div className="flex gap-6">
              <RadioOption
                label="Customer"
                checked={party === 'customer'}
                onChange={() => handlePartyChange('customer')}
                disabled={readOnly || mode === 'edit'}
              />
              <RadioOption
                label="Vendor"
                checked={party === 'vendor'}
                onChange={() => handlePartyChange('vendor')}
                disabled={readOnly || mode === 'edit'}
              />
            </div>
          </div>

          <FormField label="Name">
            <FormInput
              value={form.partyName}
              onChange={(v) => updateForm({ partyName: v })}
              disabled={readOnly}
            />
          </FormField>

          <FormField label="Payment Date">
            <FormInput
              type="date"
              value={form.paymentDate}
              onChange={(v) => updateForm({ paymentDate: v })}
              disabled={readOnly}
            />
          </FormField>

          <FormField label="Amount">
            <FormInput
              type="number"
              value={form.amount}
              onChange={(v) => updateForm({ amount: v })}
              disabled={readOnly}
              placeholder="0"
            />
          </FormField>

          <FormField label="Currency">
            <FormSelect
              value={form.currency}
              onChange={(v) => updateForm({ currency: v })}
              options={['INR', 'USD', 'EUR', 'GBP']}
              disabled={readOnly}
            />
          </FormField>

          <FormField label="Payment Mode">
            <FormSelect
              value={form.paymentMode}
              onChange={(v) => updateForm({ paymentMode: v as PaymentMode })}
              options={PAYMENT_MODES}
              disabled={readOnly}
            />
          </FormField>

          <FormField label="Reference">
            <FormInput
              value={form.reference}
              onChange={(v) => updateForm({ reference: v })}
              disabled={readOnly}
              placeholder="Transaction reference"
            />
          </FormField>

          <FormField label="Notes">
            <FormTextarea
              value={form.notes}
              onChange={(v) => updateForm({ notes: v })}
              disabled={readOnly}
              placeholder="Add notes..."
            />
          </FormField>

          <PaymentAccordions
            depositIncentive={form.depositIncentive}
            cashback={form.cashback}
            bankCharges={form.bankCharges}
            onChange={updateAccordion}
            disabled={readOnly}
          />

          {!readOnly && (
            <div>
              {!form.isAdvance ? (
                <button
                  type="button"
                  onClick={() => setAdvanceConfirm(true)}
                  className="flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#6F35D0] hover:text-[#5A2BB0]"
                >
                  <span className="text-lg leading-none">+</span>
                  Record as Advance Payment
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-[#EDE6BE] bg-[#FFFBE5] px-3 py-2 text-[12px] text-[#9C8B2E]">
                  <span>Marked as advance payment</span>
                  <button
                    type="button"
                    onClick={() => updateForm({ isAdvance: false })}
                    className="ml-auto cursor-pointer text-[#6B7280] hover:text-[#374151]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {readOnly && form.isAdvance && (
            <p className="text-[12px] font-medium text-[#9C8B2E]">Advance payment</p>
          )}

          {!readOnly && (
            <div>
              <p className="mb-2 text-[12px] font-medium text-[#6B7280]">Attach Screenshot</p>
              {fileName ? (
                <div className="space-y-2">
                  {previewUrl && (
                    <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
                      <img
                        src={previewUrl}
                        alt={fileName}
                        className="max-h-48 w-full object-contain bg-[#F9FAFB]"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2.5">
                    <Paperclip className="h-4 w-4 shrink-0 text-[#6B7280]" />
                    <span className="flex-1 truncate text-[13px] text-[#374151]">{fileName}</span>
                    <button
                      type="button"
                      onClick={() => handleFileChange(null)}
                      className="cursor-pointer text-[#9CA3AF] hover:text-[#374151]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#D1D5DB] px-4 py-3 text-[13px] text-[#6F35D0] hover:bg-[#F9F5FF]">
                  <Paperclip className="h-4 w-4" />
                  Attach Screenshot
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>
          )}

          {readOnly && fileName && (
            <div className="space-y-2">
              <p className="text-[12px] font-medium text-[#6B7280]">Attachment</p>
              {isImageFile ? (
                <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-center">
                  <p className="text-[12px] text-[#6B7280]">
                    Image preview unavailable for saved payments (filename stored only)
                  </p>
                </div>
              ) : null}
              <div className="flex items-center gap-2 text-[13px] text-[#374151]">
                <Paperclip className="h-4 w-4 text-[#6B7280]" />
                {fileName}
              </div>
            </div>
          )}

          {submitError && (
            <p className="text-[12px] text-[#DC2626]">{submitError}</p>
          )}
        </div>
      </SidesheetBody>

      <SidesheetFooter>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg border border-[#E5E7EB] px-5 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#F9FAFB]"
        >
          Cancel
        </button>
        {!readOnly && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="cursor-pointer rounded-lg bg-[#6F35D0] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#5A2BB0] disabled:opacity-60"
          >
            {saving
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Payment'
                : 'Record Payment'}
          </button>
        )}
      </SidesheetFooter>

      {advanceConfirm && (
        <ConfirmAdvanceDialog
          onCancel={() => setAdvanceConfirm(false)}
          onConfirm={() => {
            updateForm({ isAdvance: true })
            setAdvanceConfirm(false)
          }}
        />
      )}
    </Sidesheet>
  )
}

function RadioOption({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2 text-[13px] text-[#374151]',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 accent-[#6F35D0]"
      />
      {label}
    </label>
  )
}

function ConfirmAdvanceDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
      <div className="mx-6 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <p className="text-[15px] font-semibold text-[#111827]">Are you sure?</p>
        <p className="mt-2 text-[13px] text-[#6B7280]">
          This payment will be recorded as an advance payment.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-[#E5E7EB] px-4 py-2 text-[13px] font-medium text-[#374151]"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-[#6F35D0] px-4 py-2 text-[13px] font-medium text-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

function formatAmount(n: number): string {
  return `₹ ${n.toLocaleString('en-IN')}`
}
