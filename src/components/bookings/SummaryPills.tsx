import { useState } from 'react'
import {
  Calculator,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Calendar,
  ChevronDown,
  MousePointerClick,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/format'
import { calculateSummary } from '../../utils/calculateSummary'
import { cn } from '../../utils/cn'

interface SummaryPillsProps {
  showCalendarLink?: boolean
  calendarActive?: boolean
  selectionMode?: boolean
  onSelectionModeChange?: (mode: boolean) => void
  onSelectAll?: () => void
  allSelected?: boolean
}

export function SummaryPills({
  showCalendarLink = true,
  calendarActive,
  selectionMode = false,
  onSelectionModeChange,
  onSelectAll,
  allSelected,
}: SummaryPillsProps) {
  const { youGive, youGet, net } = calculateSummary()
  const netIsPositive = net >= 0
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
          <Calculator className="h-4 w-4 text-muted" />
          <span className="text-[13px] text-text-secondary">Net:</span>
          <span
            className={cn(
              'text-[13px] font-semibold',
              netIsPositive ? 'text-success' : 'text-danger',
            )}
          >
            {formatCurrency(Math.abs(net))}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-danger-light">
            <ArrowUpRight className="h-3 w-3 text-danger" />
          </div>
          <span className="text-[13px] text-text-secondary">You Give:</span>
          <span className="text-[13px] font-semibold text-danger">
            {formatCurrency(youGive)}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success-light">
            <ArrowDownLeft className="h-3 w-3 text-success" />
          </div>
          <span className="text-[13px] text-text-secondary">You Get:</span>
          <span className="text-[13px] font-semibold text-success">
            {formatCurrency(youGet)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {selectionMode ? (
          <>
            <button
              type="button"
              onClick={() => onSelectionModeChange?.(false)}
              className="rounded-full border border-border bg-white px-4 py-2 text-[13px] font-medium text-text hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSelectAll}
              className="rounded-full border border-border bg-white px-4 py-2 text-[13px] font-medium text-text hover:bg-surface"
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
            <button
              type="button"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-border bg-white hover:bg-surface"
            >
              <MoreHorizontal className="h-4 w-4 text-text-secondary" />
            </button>
          </>
        ) : (
          <div className="relative">
            <div className="flex overflow-hidden rounded-full border border-primary/40">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className="border-r border-primary/40 bg-white px-4 py-2 text-[13px] font-medium text-text hover:bg-surface"
              >
                More Actions
              </button>
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className="bg-white px-2.5 py-2 hover:bg-surface"
              >
                <ChevronDown className="h-4 w-4 text-text-secondary" />
              </button>
            </div>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectionModeChange?.(true)
                      setMoreOpen(false)
                    }}
                    className="flex w-full items-center gap-2.5 border-b border-border-light px-4 py-2.5 text-[13px] text-text hover:bg-surface"
                  >
                    <MousePointerClick className="h-4 w-4 text-muted" />
                    Select
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoreOpen(false)}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-text hover:bg-surface"
                  >
                    <Upload className="h-4 w-4 text-muted" />
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {showCalendarLink && (
          <Link
            to="/finance/bookings/calendar"
            className={cn(
              'flex h-[38px] w-[38px] items-center justify-center rounded-lg border transition-colors',
              calendarActive
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-muted hover:bg-surface',
            )}
            title="Calendar View"
          >
            <Calendar className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
