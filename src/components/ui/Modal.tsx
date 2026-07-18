import { cn } from '../../utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  size?: 'md' | 'lg' | 'xl' | 'full'
}

const sizeStyles = {
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-[95vw]',
}

export function Modal({ open, onClose, children, className, size = 'lg' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 max-h-[90vh] w-full overflow-auto rounded-xl bg-white shadow-2xl',
          sizeStyles[size],
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
