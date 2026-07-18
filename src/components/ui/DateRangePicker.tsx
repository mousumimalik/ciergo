import { useEffect, useRef, useState } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
  startOfWeek,
  endOfWeek,
  subDays,
  subWeeks,
  startOfYear,
} from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '../../utils/cn'

interface DateRangePickerProps {
  label: string
  start: string
  end: string
  onChange: (start: string, end: string) => void
}

type PresetKey =
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'Last Week'
  | 'This Month'
  | 'Last Month'
  | 'Last 30 Days'
  | 'This Year'

const presets: PresetKey[] = [
  'Today',
  'Yesterday',
  'This Week',
  'Last Week',
  'This Month',
  'Last Month',
  'Last 30 Days',
  'This Year',
]

function getPresetRange(preset: PresetKey): { start: Date; end: Date } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (preset) {
    case 'Today':
      return { start: today, end: today }
    case 'Yesterday': {
      const y = subDays(today, 1)
      return { start: y, end: y }
    }
    case 'This Week':
      return { start: startOfWeek(today, { weekStartsOn: 0 }), end: endOfWeek(today, { weekStartsOn: 0 }) }
    case 'Last Week': {
      const lw = subWeeks(today, 1)
      return { start: startOfWeek(lw, { weekStartsOn: 0 }), end: endOfWeek(lw, { weekStartsOn: 0 }) }
    }
    case 'This Month':
      return { start: startOfMonth(today), end: endOfMonth(today) }
    case 'Last Month': {
      const lm = subMonths(today, 1)
      return { start: startOfMonth(lm), end: endOfMonth(lm) }
    }
    case 'Last 30 Days':
      return { start: subDays(today, 29), end: today }
    case 'This Year':
      return { start: startOfYear(today), end: today }
  }
}

function toIso(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

function parseIso(s: string) {
  return s ? new Date(s + 'T00:00:00') : null
}

export function DateRangePicker({ label, start, end, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(new Date())
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null)
  const [selecting, setSelecting] = useState<{ start: Date | null; end: Date | null }>({
    start: parseIso(start),
    end: parseIso(end),
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    setSelecting({ start: parseIso(start), end: parseIso(end) })
  }, [start, end])

  function applyRange(s: Date, e: Date) {
    const sortedStart = isBefore(s, e) ? s : e
    const sortedEnd = isAfter(s, e) ? s : e
    onChange(toIso(sortedStart), toIso(sortedEnd))
    setSelecting({ start: sortedStart, end: sortedEnd })
  }

  function handlePreset(preset: PresetKey) {
    const range = getPresetRange(preset)
    setActivePreset(preset)
    applyRange(range.start, range.end)
    setViewMonth(range.start)
  }

  function handleDayClick(day: Date) {
    setActivePreset(null)
    if (!selecting.start || (selecting.start && selecting.end)) {
      setSelecting({ start: day, end: null })
    } else {
      applyRange(selecting.start, day)
    }
  }

  function displayText() {
    if (start && end) {
      return `${format(parseIso(start)!, 'dd MMM yyyy')} → ${format(parseIso(end)!, 'dd MMM yyyy')}`
    }
    return null
  }

  return (
    <div ref={ref} className="relative">
      <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-[38px] min-w-[220px] items-center gap-2 rounded-lg border bg-white px-3 text-[13px] transition-colors',
          open ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-gray-300',
        )}
      >
        {displayText() ? (
          <span className="flex-1 truncate text-left text-text">{displayText()}</span>
        ) : (
          <>
            <span className="text-muted">Start Date</span>
            <span className="text-muted">→</span>
            <span className="flex-1 text-left text-muted">End Date</span>
          </>
        )}
        <Calendar className="ml-auto h-4 w-4 shrink-0 text-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 flex overflow-hidden rounded-xl border border-border bg-white shadow-xl">
          <div className="w-[160px] border-r border-border py-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={cn(
                  'relative w-full px-4 py-2 text-left text-[13px] transition-colors',
                  activePreset === preset
                    ? 'bg-primary-light font-medium text-primary'
                    : 'text-text-secondary hover:bg-surface',
                )}
              >
                {activePreset === preset && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-primary" />
                )}
                {preset}
              </button>
            ))}
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMonth(subMonths(viewMonth, 12))}
                  className="rounded p-1 hover:bg-surface"
                >
                  <ChevronsLeft className="h-4 w-4 text-muted" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                  className="rounded p-1 hover:bg-surface"
                >
                  <ChevronLeft className="h-4 w-4 text-muted" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                  className="rounded p-1 hover:bg-surface"
                >
                  <ChevronRight className="h-4 w-4 text-muted" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMonth(addMonths(viewMonth, 12))}
                  className="rounded p-1 hover:bg-surface"
                >
                  <ChevronsRight className="h-4 w-4 text-muted" />
                </button>
              </div>
            </div>

            <div className="flex gap-6">
              <MonthGrid
                month={viewMonth}
                rangeStart={selecting.start}
                rangeEnd={selecting.end}
                onDayClick={handleDayClick}
              />
              <MonthGrid
                month={addMonths(viewMonth, 1)}
                rangeStart={selecting.start}
                rangeEnd={selecting.end}
                onDayClick={handleDayClick}
              />
            </div>

            <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => {
                  onChange('', '')
                  setSelecting({ start: null, end: null })
                  setActivePreset(null)
                }}
                className="rounded-lg border border-border px-4 py-1.5 text-[13px] text-text-secondary hover:bg-surface"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-primary px-4 py-1.5 text-[13px] font-medium text-white hover:bg-primary-dark"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MonthGrid({
  month,
  rangeStart,
  rangeEnd,
  onDayClick,
}: {
  month: Date
  rangeStart: Date | null
  rangeEnd: Date | null
  onDayClick: (day: Date) => void
}) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const range =
    rangeStart && rangeEnd
      ? {
          start: isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd,
          end: isAfter(rangeStart, rangeEnd) ? rangeStart : rangeEnd,
        }
      : null

  return (
    <div className="w-[240px]">
      <p className="mb-2 text-center text-[13px] font-semibold text-text">
        {format(month, 'MMMM yyyy')}
      </p>
      <div className="mb-1 grid grid-cols-7">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-medium text-muted">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month)
          const isStart = rangeStart && isSameDay(day, rangeStart)
          const isEnd = rangeEnd && isSameDay(day, rangeEnd)
          const inRange =
            range && isWithinInterval(day, { start: range.start, end: range.end })

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => inMonth && onDayClick(day)}
              disabled={!inMonth}
              className={cn(
                'relative flex h-8 w-full items-center justify-center text-[13px] transition-colors',
                !inMonth && 'text-transparent',
                inMonth && !inRange && !isStart && !isEnd && 'text-text hover:bg-primary-light',
                inRange && !isStart && !isEnd && 'bg-primary-light text-text',
                (isStart || isEnd) && 'rounded-full bg-primary font-medium text-white',
              )}
            >
              {inMonth ? format(day, 'd') : ''}
            </button>
          )
        })}
      </div>
    </div>
  )
}
