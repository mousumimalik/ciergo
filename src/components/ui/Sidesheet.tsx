import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface SidesheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export function Sidesheet({ open, onClose, children, width = 'max-w-[480px]' }: SidesheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 flex h-full w-full flex-col bg-white shadow-2xl',
          width,
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface SidesheetHeaderProps {
  paymentId?: string
  bookingId: string
  onClose: () => void
  title?: string
}

export function SidesheetHeader({
  paymentId,
  bookingId,
  onClose,
  title,
}: SidesheetHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-5">
      <div>
        {paymentId && (
          <p className="text-[15px] font-semibold text-[#111827]">{paymentId}</p>
        )}
        {title && !paymentId && (
          <p className="text-[15px] font-semibold text-[#111827]">{title}</p>
        )}
        <p className="mt-0.5 text-[13px] text-[#6B7280]">
          Booking ID{' '}
          <span className="font-medium text-[#374151]">{bookingId}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-[#F3F4F6]"
      >
        <X className="h-5 w-5 text-[#6B7280]" />
      </button>
    </div>
  )
}

export function SidesheetBody({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
}

export function SidesheetFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] px-6 py-4">
      {children}
    </div>
  )
}
