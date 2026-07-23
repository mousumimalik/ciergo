import { cn } from '../../utils/cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-gray-300',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5',
            'mt-0.5',
          )}
        />
      </button>
    </div>
  )
}
