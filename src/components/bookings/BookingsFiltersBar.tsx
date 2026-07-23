import { useState } from 'react'
import { Search, RotateCcw, ChevronDown } from 'lucide-react'
import type { BookingsFilters, BookingType, Owner } from '../../types/booking'
import { DEFAULT_BOOKINGS_FILTERS } from '../../constants/bookingsFilters'
import { DateRangePicker } from '../ui/DateRangePicker'
import { OwnerSelectModal } from './OwnerSelectModal'
import { cn } from '../../utils/cn'

interface BookingsFiltersBarProps {
  filters: BookingsFilters
  onChange: (filters: BookingsFilters) => void
  onReload?: () => void
  owners?: Owner[]
  showSearchByAmount?: boolean
}

const bookingTypes: BookingType[] = ['All Bookings', 'Other Services', 'Limitless']

export function BookingsFiltersBar({
  filters,
  onChange,
  onReload,
  owners = [],
  showSearchByAmount = true,
}: BookingsFiltersBarProps) {
  const [ownerModalOpen, setOwnerModalOpen] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)

  const selectedCount = filters.advancedOwnerSearch
    ? filters.primaryOwners.length + filters.secondaryOwners.length
    : filters.primaryOwners.length

  function handleReload() {
    onChange({ ...DEFAULT_BOOKINGS_FILTERS })
    onReload?.()
  }

  return (
    <>
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-white px-4 py-3">
        <DateRangePicker
          label="Booking Date"
          start={filters.bookingDateStart}
          end={filters.bookingDateEnd}
          onChange={(start, end) =>
            onChange({ ...filters, bookingDateStart: start, bookingDateEnd: end })
          }
        />

        <DateRangePicker
          label="Travel Date"
          start={filters.travelDateStart}
          end={filters.travelDateEnd}
          onChange={(start, end) =>
            onChange({ ...filters, travelDateStart: start, travelDateEnd: end })
          }
        />

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">
            Booking Owner
          </label>
          <button
            type="button"
            onClick={() => setOwnerModalOpen(true)}
            className="flex h-[38px] w-[200px] items-center justify-between rounded-lg border border-border bg-white px-3 text-[13px] text-muted hover:border-gray-300"
          >
            <span className="truncate">
              {selectedCount > 0
                ? `${selectedCount} Owner(s) Selected`
                : 'Search / Select Owners'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </button>
        </div>

        <div className="relative">
          <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">
            Booking Type
          </label>
          <button
            type="button"
            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            className="flex h-[38px] w-[160px] items-center justify-between rounded-full border border-border bg-white px-4 text-[13px] text-text hover:border-gray-300"
          >
            {filters.bookingType}
            <ChevronDown className="h-4 w-4 text-muted" />
          </button>
          {typeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setTypeDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                {bookingTypes.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, bookingType: t })
                      setTypeDropdownOpen(false)
                    }}
                    className={cn(
                      'block w-full px-4 py-2.5 text-left text-[13px] hover:bg-surface',
                      i < bookingTypes.length - 1 && 'border-b border-border-light',
                      filters.bookingType === t ? 'font-medium text-primary' : 'text-text',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">
            {showSearchByAmount ? 'Search' : 'Booking ID'}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={
                showSearchByAmount
                  ? 'Search by ID / Lead Pax / Amount'
                  : 'Type here'
              }
              value={filters.searchQuery}
              onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
              className="h-[38px] w-full rounded-lg border border-border bg-white py-2 pl-3 pr-9 text-[13px] placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleReload}
          className="mb-0.5 flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-border hover:bg-surface"
          title="Reload data and reset filters"
        >
          <RotateCcw className="h-4 w-4 text-muted" />
        </button>
      </div>

      <OwnerSelectModal
        open={ownerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
        owners={owners}
        primaryOwners={filters.primaryOwners}
        secondaryOwners={filters.secondaryOwners}
        advancedSearch={filters.advancedOwnerSearch}
        onApply={(primary, secondary, advanced) =>
          onChange({
            ...filters,
            primaryOwners: primary,
            secondaryOwners: secondary,
            advancedOwnerSearch: advanced,
          })
        }
      />
    </>
  )
}
