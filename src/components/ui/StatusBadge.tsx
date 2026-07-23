import { cn } from '../../utils/cn'
import type { PaymentStatus, ServiceStatus } from '../../types/booking'
import type { PaymentBreakdown } from '../../types/payment'
import { formatCurrency } from '../../utils/format'

const paymentStyles: Record<PaymentStatus, string> = {
  Paid: 'bg-[#DCFCE7] text-[#15803D]',
  'Partially Paid': 'bg-[#FEF3C7] text-[#B45309]',
  Pending: 'bg-[#FEF9C3] text-[#A16207]',
}

const serviceStatusStyles: Record<ServiceStatus, string> = {
  Confirmed: 'bg-[#DCFCE7] text-[#15803D]',
  Rescheduled: 'bg-[#FEF9C3] text-[#A16207]',
  Cancelled: 'bg-[#FEE2E2] text-[#B91C1C]',
}

interface StatusBadgeProps {
  status: PaymentStatus | ServiceStatus | 'Approved' | 'Pending' | 'Rejected'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles =
    status in paymentStyles
      ? paymentStyles[status as PaymentStatus]
      : status in serviceStatusStyles
        ? serviceStatusStyles[status as ServiceStatus]
        : 'bg-surface text-muted'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-medium leading-none',
        styles,
        className,
      )}
    >
      {status}
    </span>
  )
}

export function PaymentStatusCell({
  status,
  breakdown,
}: {
  status: PaymentStatus
  breakdown: PaymentBreakdown
}) {
  return (
    <div className="group relative flex justify-center">
      <StatusBadge status={status} />
      <div className="pointer-events-none absolute left-1/2 top-full z-[200] mt-2 hidden -translate-x-1/2 group-hover:block">
        <div className="whitespace-nowrap rounded-lg bg-[#2D2D2D] px-4 py-3 text-center text-[11px] text-white shadow-xl">
          <p className="mb-1.5 underline decoration-white/60">PAYMENT BREAKDOWN</p>
          <p className="mb-1 font-medium">CUSTOMER</p>
          <p>{formatCurrency(breakdown.customerPaid)} paid</p>
          <p>{formatCurrency(breakdown.customerPending)} pending</p>
          <p className="mb-1 mt-2 font-medium">VENDOR</p>
          <p>{formatCurrency(breakdown.vendorPaid)} paid</p>
          <p>{formatCurrency(breakdown.vendorPending)} pending</p>
          <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#2D2D2D]" />
        </div>
      </div>
    </div>
  )
}

export function ServiceStatusCell({ status }: { status: ServiceStatus }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <StatusBadge status={status} />
      {status !== 'Cancelled' && (
        <span className="text-[10px] text-[#9CA3AF]">Travelled</span>
      )}
    </div>
  )
}
