import { useEffect, useRef } from 'react'
import { RotateCcw, ArrowLeftRight, ArrowUpDown, Filter } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PopoverProps {
  open: boolean
  onClose: () => void
  anchor: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function HeaderPopover({ open, onClose, anchor, children, className }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  return (
    <div ref={ref} className="relative inline-flex">
      {anchor}
      {open && (
        <div
          className={cn(
            'absolute left-0 top-full z-[100] mt-1 min-w-[200px] rounded-xl border border-[#E5E7EB] bg-white shadow-lg',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function FilterFooter({
  onReset,
  onApply,
  extra,
}: {
  onReset: () => void
  onApply: () => void
  extra?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-[#E5E7EB] px-3 py-2">
      {extra}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB]"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#9CA3AF]" />
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded-lg bg-primary px-4 py-1.5 text-[13px] font-medium text-white hover:bg-primary-dark"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] font-medium tracking-[0.01em] text-[#6B7280]">
      {children}
    </span>
  )
}

export function ColumnHeaderButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 text-[12px] font-medium tracking-[0.01em] text-[#6B7280] transition-colors hover:text-[#374151]',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function FunnelIcon({ className }: { className?: string }) {
  return (
    <Filter
      className={cn('h-3 w-3 shrink-0 text-[#9CA3AF]', className)}
      strokeWidth={2}
    />
  )
}

export function SwapIcon({ className }: { className?: string }) {
  return (
    <ArrowLeftRight
      className={cn('h-3 w-3 shrink-0 text-[#9CA3AF]', className)}
      strokeWidth={2}
    />
  )
}

export function BarSortIcon({ active }: { active?: boolean; direction?: 'asc' | 'desc' }) {
  return (
    <ArrowUpDown
      className={cn('h-3 w-3 shrink-0', active ? 'text-primary' : 'text-[#9CA3AF]')}
      strokeWidth={2}
    />
  )
}
