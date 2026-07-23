import { Eye, Pencil } from 'lucide-react'
import type { Payment } from '../../types/payment'
import { formatCurrency, formatDate } from '../../utils/format'
import {
  Sidesheet,
  SidesheetBody,
  SidesheetHeader,
} from '../ui/Sidesheet'

interface ViewPaymentsPanelProps {
  open: boolean
  bookingId: string
  payments: Payment[]
  onClose: () => void
  onView: (payment: Payment) => void
  onEdit: (payment: Payment) => void
}

export function ViewPaymentsPanel({
  open,
  bookingId,
  payments,
  onClose,
  onView,
  onEdit,
}: ViewPaymentsPanelProps) {
  return (
    <Sidesheet open={open} onClose={onClose} width="max-w-[420px]">
      <SidesheetHeader title="View Payments" bookingId={bookingId} onClose={onClose} />

      <SidesheetBody>
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[14px] font-medium text-[#374151]">No payments recorded</p>
            <p className="mt-1 text-[13px] text-[#9CA3AF]">
              Record a payment to see it listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id ?? payment.paymentId}
                className="rounded-xl border border-[#E5E7EB] bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">
                      {payment.paymentId}
                    </p>
                    <p className="mt-0.5 text-[12px] capitalize text-[#6B7280]">
                      {payment.party} · {payment.partyName}
                    </p>
                  </div>
                  <p className="text-[14px] font-semibold text-[#111827]">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-4 text-[12px] text-[#6B7280]">
                  <span>{formatDate(payment.paymentDate)}</span>
                  <span>{payment.paymentMode}</span>
                  {payment.isAdvance && (
                    <span className="rounded-full bg-[#FFFBE5] px-2 py-0.5 text-[10px] font-medium text-[#9C8B2E]">
                      Advance
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-2 border-t border-[#F3F4F6] pt-3">
                  <button
                    type="button"
                    onClick={() => onView(payment)}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] py-2 text-[12px] font-medium text-[#374151] hover:bg-[#F9FAFB]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(payment)}
                    disabled={!payment.id}
                    title={!payment.id ? 'This payment cannot be edited' : undefined}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] py-2 text-[12px] font-medium text-[#6F35D0] hover:bg-[#F9F5FF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SidesheetBody>
    </Sidesheet>
  )
}
