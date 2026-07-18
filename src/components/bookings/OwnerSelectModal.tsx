import { useEffect, useRef, useState } from 'react'
import { ChevronDown, RotateCcw, X } from 'lucide-react'
import { owners } from '../../data/mockOwners'
import { cn } from '../../utils/cn'

interface OwnerSelectModalProps {
  open: boolean
  onClose: () => void
  primaryOwners: string[]
  secondaryOwners: string[]
  advancedSearch: boolean
  onApply: (primary: string[], secondary: string[], advanced: boolean) => void
}

export function OwnerSelectModal({
  open,
  onClose,
  primaryOwners,
  secondaryOwners,
  advancedSearch,
  onApply,
}: OwnerSelectModalProps) {
  const [tempPrimary, setTempPrimary] = useState(primaryOwners)
  const [tempSecondary, setTempSecondary] = useState(secondaryOwners)
  const [tempAdvanced, setTempAdvanced] = useState(advancedSearch)

  useEffect(() => {
    if (open) {
      setTempPrimary(primaryOwners)
      setTempSecondary(secondaryOwners)
      setTempAdvanced(advancedSearch)
    }
  }, [open, primaryOwners, secondaryOwners, advancedSearch])

  if (!open) return null

  function handleApply() {
    onApply(tempPrimary, tempSecondary, tempAdvanced)
    onClose()
  }

  function handleReset() {
    setTempPrimary([])
    setTempSecondary([])
  }

  const totalSelected = tempAdvanced
    ? tempPrimary.length + tempSecondary.length
    : tempPrimary.length

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[780px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-text">Select Booking Owners</h2>
          <div className="flex items-center gap-5">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={tempAdvanced}
                onChange={(e) => setTempAdvanced(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary accent-primary focus:ring-primary"
              />
              <span className="text-[13px] text-text-secondary">Advance Search</span>
            </label>
            <button type="button" onClick={onClose} className="text-muted hover:text-text">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!tempAdvanced && (
          <>
            <p className="mb-4 text-[13px] text-muted">
              {totalSelected} Owner(s) Selected
            </p>
            <OwnerSection
              selected={tempPrimary}
              onChange={setTempPrimary}
              showHeader={false}
            />
          </>
        )}

        {tempAdvanced && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <OwnerSection
              title="Primary Owner(s)"
              selected={tempPrimary}
              onChange={setTempPrimary}
              showHeader
            />
            <OwnerSection
              title="Secondary Owner(s)"
              selected={tempSecondary}
              onChange={setTempSecondary}
              showHeader
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface"
          >
            <RotateCcw className="h-4 w-4 text-muted" />
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-primary px-8 py-2 text-[13px] font-medium text-white hover:bg-primary-dark"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

function OwnerSection({
  title,
  selected,
  onChange,
  showHeader,
}: {
  title?: string
  selected: string[]
  onChange: (ids: string[]) => void
  showHeader: boolean
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  function toggle(id: string) {
    onChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id],
    )
  }

  function remove(id: string) {
    onChange(selected.filter((x) => x !== id))
  }

  return (
    <div className={cn(showHeader && 'rounded-xl bg-sidebar-group p-4')}>
      {showHeader && title && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-text">{title}</span>
          <span className="text-[12px] text-muted">{selected.length} Owner(s) Selected</span>
        </div>
      )}

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex w-full items-center justify-between rounded-full border border-border bg-white px-4 py-2.5 text-left text-[13px] text-muted hover:border-gray-300"
        >
          <span>Search / Select Owners</span>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', dropdownOpen && 'rotate-180')}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[200px] overflow-y-auto rounded-xl border border-border bg-white shadow-lg">
            {owners.map((owner, i) => (
              <label
                key={owner.id}
                className={cn(
                  'flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-surface',
                  i < owners.length - 1 && 'border-b border-border-light',
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(owner.id)}
                  onChange={() => toggle(owner.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
                />
                {owner.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((id) => {
            const owner = owners.find((o) => o.id === id)
            if (!owner) return null
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-[13px] text-text"
              >
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="text-muted hover:text-text"
                >
                  <X className="h-3 w-3" />
                </button>
                {owner.name}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
