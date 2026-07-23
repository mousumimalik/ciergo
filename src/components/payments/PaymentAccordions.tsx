import { ChevronDown, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { PaymentEntryFields } from '../../types/payment'

interface PaymentAccordionsProps {
  depositIncentive: PaymentEntryFields
  cashback: PaymentEntryFields
  bankCharges: PaymentEntryFields
  onChange: (
    key: 'depositIncentive' | 'cashback' | 'bankCharges',
    field: keyof PaymentEntryFields,
    value: string,
  ) => void
  disabled?: boolean
}

const ACCORDIONS = [
  { key: 'depositIncentive' as const, label: 'Deposit / Incentive' },
  { key: 'cashback' as const, label: 'Cashback' },
  { key: 'bankCharges' as const, label: 'Bank Charges' },
]

export function PaymentAccordions({
  depositIncentive,
  cashback,
  bankCharges,
  onChange,
  disabled = false,
}: PaymentAccordionsProps) {
  const values = { depositIncentive, cashback, bankCharges }

  return (
    <div className="space-y-2">
      {ACCORDIONS.map(({ key, label }) => (
        <AccordionItem
          key={key}
          label={label}
          fields={values[key]}
          disabled={disabled}
          onChange={(field, value) => onChange(key, field, value)}
        />
      ))}
    </div>
  )
}

function AccordionItem({
  label,
  fields,
  onChange,
  disabled,
}: {
  label: string
  fields: PaymentEntryFields
  onChange: (field: keyof PaymentEntryFields, value: string) => void
  disabled?: boolean
}) {
  const hasContent = Boolean(fields.amount || fields.reference)

  return (
    <details className="group rounded-lg border border-[#E5E7EB]" open={hasContent}>
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-medium text-[#374151] [&::-webkit-details-marker]:hidden">
        <span>{label}</span>
        <Plus className="h-4 w-4 text-[#9CA3AF] transition-transform group-open:rotate-45" />
      </summary>
      <div className="space-y-3 border-t border-[#F3F4F6] px-4 py-3">
        <Field label="Amount">
          <input
            type="number"
            value={fields.amount}
            onChange={(e) => onChange('amount', e.target.value)}
            disabled={disabled}
            placeholder="0"
            className={inputClass}
          />
        </Field>
        <Field label="Reference">
          <input
            type="text"
            value={fields.reference}
            onChange={(e) => onChange('reference', e.target.value)}
            disabled={disabled}
            placeholder="Reference"
            className={inputClass}
          />
        </Field>
      </div>
    </details>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#6B7280]">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF]'

export const PAYMENT_MODES = ['Cash', 'UPI', 'Cheque', 'Card', 'Bank Transfer'] as const

export function FormField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-[12px] font-medium text-[#6B7280]">{label}</label>
      {children}
    </div>
  )
}

export function FormInput({
  value,
  onChange,
  disabled,
  type = 'text',
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  type?: string
  placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={inputClass}
    />
  )
}

export function FormSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  options: readonly string[]
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(inputClass, 'appearance-none pr-9')}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
    </div>
  )
}

export function FormTextarea({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      rows={3}
      className={cn(inputClass, 'resize-none')}
    />
  )
}

export { inputClass }
