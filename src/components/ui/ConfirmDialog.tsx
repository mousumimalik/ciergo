import { cn } from '../../utils/cn'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  bookingId: string
  type: 'approve' | 'reject'
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  bookingId,
  type,
}: ConfirmDialogProps) {
  if (!open) return null

  const isApprove = type === 'approve'

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-[15px] leading-relaxed text-text">
          Are you sure you want to {isApprove ? 'approve' : 'reject'} this booking
          with ID <span className="font-semibold">&apos;{bookingId}&apos;</span> ?
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-5 py-2 text-[13px] font-medium text-text hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={cn(
              'rounded-lg px-5 py-2 text-[13px] font-medium text-white',
              isApprove ? 'bg-success hover:bg-green-700' : 'bg-danger hover:bg-red-700',
            )}
          >
            Yes, {isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}
