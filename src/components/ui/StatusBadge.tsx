import { cn } from '../../utils/cn'
import type { PaymentStatus, ServiceStatus } from '../../types/booking'
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
  customerAmount,
  vendorAmount,
}: {
  status: PaymentStatus
  customerAmount: number
  vendorAmount: number
}) {
  return (
    <div className="group relative flex justify-center">
      <StatusBadge status={status} />
      {status === 'Pending' && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 group-hover:block">
          <div className="whitespace-nowrap rounded-lg bg-[#2D2D2D] px-4 py-3 text-center text-[11px] text-white shadow-lg">
            <p className="mb-1.5 underline decoration-white/60">PENDING AMOUNT</p>
            <p>CUSTOMER : {formatCurrency(customerAmount)}</p>
            <p>VENDOR : {formatCurrency(vendorAmount)}</p>
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#2D2D2D]" />
          </div>
        </div>
      )}
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
