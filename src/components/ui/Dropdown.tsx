import { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({
  trigger,
  children,
  open,
  onOpenChange,
  align = 'right',
  className,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onOpenChange])

  return (
    <div ref={ref} className="relative">
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[180px] rounded-lg border border-border bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
  variant?: 'default' | 'primary' | 'danger'
  className?: string
}

export function DropdownItem({
  icon,
  label,
  onClick,
  variant = 'default',
  className,
}: DropdownItemProps) {
  const variantStyles = {
    default: 'text-gray-700 hover:bg-surface',
    primary: 'text-blue-600 hover:bg-blue-50',
    danger: 'text-danger hover:bg-danger-light',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-sm',
        variantStyles[variant],
        className,
      )}
    >
      {icon}
      {label}
    </button>
  )
}
