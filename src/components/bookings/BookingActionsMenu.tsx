import { useState } from 'react'
import {
  Pencil,
  Trash2,
  Link2,
  Copy,
  RotateCcw,
  Send,
  Check,
  X,
  MoreHorizontal,
  FileText,
  ClipboardList,
  Plus,
  ChevronDown,
  Download,
} from 'lucide-react'
import { Dropdown, DropdownItem } from '../ui/Dropdown'
import { cn } from '../../utils/cn'
import type { Booking, BookingTab, ApprovalFilter } from '../../types/booking'
import { currentUser } from '../../data/currentUser'

interface BookingActionsMenuProps {
  booking: Booking
  tab: BookingTab
  approvalFilter?: ApprovalFilter
  onAction: (action: string, booking: Booking) => void
}

const actionBtn =
  'flex h-[30px] items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'

export function BookingActionsMenu({
  booking,
  tab,
  approvalFilter,
  onAction,
}: BookingActionsMenuProps) {
  const [open, setOpen] = useState(false)

  const canApprove =
    currentUser.isAdmin ||
    currentUser.canApproveAll ||
    booking.owners.some((o) => currentUser.canApproveUsers.includes(o.id))

  const showPaymentButton =
    tab !== 'deleted' &&
    (tab === 'bookings' ||
      (tab === 'waiting' &&
        (approvalFilter === 'Approved' ||
          (approvalFilter === 'All' && booking.bookingStatus === 'Approved'))))

  const showApproveReject =
    tab === 'waiting' && booking.bookingStatus === 'Pending' && canApprove

  function handleAction(action: string) {
    onAction(action, booking)
    setOpen(false)
  }

  if (tab === 'deleted') {
    return (
      <div className="flex justify-center">
        <Dropdown
          open={open}
          onOpenChange={setOpen}
          trigger={
            <button type="button" className={`${actionBtn} w-[30px]`}>
              <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
            </button>
          }
        >
          <DropdownItem icon={<RotateCcw className="h-4 w-4 text-muted" />} label="Restore" onClick={() => handleAction('restore')} />
          <DropdownItem icon={<Copy className="h-4 w-4 text-muted" />} label="Duplicate" onClick={() => handleAction('duplicate')} />
        </Dropdown>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {showApproveReject && (
        <>
          <button type="button" onClick={() => handleAction('approve')} className={`${actionBtn} w-[30px]`}>
            <Check className="h-4 w-4 text-[#16A34A]" />
          </button>
          <button type="button" onClick={() => handleAction('reject')} className={`${actionBtn} w-[30px]`}>
            <X className="h-4 w-4 text-[#DC2626]" />
          </button>
        </>
      )}

      {showPaymentButton && (
        <>
          <button
            type="button"
            onClick={() => handleAction('record-payment')}
            title="Record Payment"
            className={cn(actionBtn, 'gap-1 px-2 text-[11px] font-medium text-[#6F35D0]')}
          >
            Record
          </button>
          <button
            type="button"
            onClick={() => handleAction('view-payments')}
            title="View Payments"
            className={cn(actionBtn, 'gap-1 px-2 text-[11px] font-medium text-[#374151]')}
          >
            View
          </button>
        </>
      )}

      <Dropdown
        open={open}
        onOpenChange={setOpen}
        align="right"
        trigger={
          <button type="button" className={`${actionBtn} w-[30px]`}>
            <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
          </button>
        }
        className="min-w-[150px] overflow-hidden rounded-lg py-0"
      >
        <DropdownItem
          icon={<Pencil className="h-4 w-4 text-blue-600" />}
          label="Edit"
          variant="primary"
          onClick={() => handleAction('edit')}
          className="border-b border-[#F3F4F6]"
        />
        <DropdownItem
          icon={<Trash2 className="h-4 w-4 text-danger" />}
          label="Delete"
          variant="danger"
          onClick={() => handleAction('delete')}
          className="border-b border-[#F3F4F6]"
        />
        <DropdownItem
          icon={<Link2 className="h-4 w-4 text-success" />}
          label="Link"
          onClick={() => handleAction('link')}
          className="border-b border-[#F3F4F6] text-success"
        />
        <DropdownItem
          icon={<Copy className="h-4 w-4 text-muted" />}
          label="Duplicate"
          onClick={() => handleAction('duplicate')}
        />
        {booking.bookingStatus === 'Rejected' && (
          <DropdownItem
            icon={<Send className="h-4 w-4 text-muted" />}
            label="Send for Approval again"
            onClick={() => handleAction('send-for-approval')}
          />
        )}
      </Dropdown>
    </div>
  )
}

const VOUCHER_OPTIONS = [
  'Booking Voucher(s)',
  'Customer Invoice(s)',
  'Vendor Voucher(s)',
  'Vendor Invoice(s)',
]

export function VoucherButton() {
  const [open, setOpen] = useState(false)

  function handleDownload(label: string) {
    const fileName = `${label.replace(/[()]/g, '').replace(/\s+/g, '-')}.pdf`
    const blob = new Blob([label], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      align="left"
      className="min-w-[200px] overflow-hidden rounded-lg p-0 py-0"
      trigger={
        <div className="inline-flex items-center justify-center overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
          <button type="button" className="flex h-[30px] w-[30px] items-center justify-center border-r border-[#E5E7EB]">
            <FileText className="h-3.5 w-3.5 text-primary" />
          </button>
          <button type="button" className="flex h-[30px] w-[30px] items-center justify-center">
            <ChevronDown className="h-3 w-3 text-[#9CA3AF]" />
          </button>
        </div>
      }
    >
      {VOUCHER_OPTIONS.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => handleDownload(label)}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[#F9FAFB]',
            index < VOUCHER_OPTIONS.length - 1 && 'border-b border-[#F3F4F6]',
          )}
        >
          <Download className="h-4 w-4 shrink-0 text-[#6B7280]" />
          <span className="text-[13px] text-[#374151]">{label}</span>
        </button>
      ))}
    </Dropdown>
  )
}

export function TasksButton({ count }: { count: number }) {
  if (count === 0) {
    return (
      <div className="flex justify-center">
        <button type="button" className={`${actionBtn} w-[30px]`}>
          <Plus className="h-4 w-4 text-[#9CA3AF]" />
        </button>
      </div>
    )
  }
  return (
    <div className="flex justify-center">
      <button type="button" className={`relative ${actionBtn} w-[30px]`}>
        <ClipboardList className="h-4 w-4 text-[#B45309]" />
        <span className="absolute -right-1 -top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#EF4444] text-[8px] font-bold text-white">
          {count}
        </span>
      </button>
    </div>
  )
}

export function EmptyCell() {
  return (
    <div className="flex justify-center">
      <span className="text-[13px] text-[#9CA3AF]">--</span>
    </div>
  )
}
