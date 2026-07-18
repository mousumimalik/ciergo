import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Plane,
  Bed,
  Bus,
  Globe,
  Clock,
} from 'lucide-react'
import { SummaryPills } from '../components/bookings/SummaryPills'
import { BookingsFiltersBar } from '../components/bookings/BookingsFiltersBar'
import type { BookingsFilters } from '../types/booking'
import { cn } from '../utils/cn'
import calendarBookingsData from '../data/json/calendarBookings.json'

const defaultFilters: BookingsFilters = {
  bookingDateStart: '',
  bookingDateEnd: '',
  travelDateStart: '',
  travelDateEnd: '',
  primaryOwners: [],
  secondaryOwners: [],
  advancedOwnerSearch: false,
  bookingType: 'All Bookings',
  searchQuery: '',
  showIncomplete: false,
}

interface CalendarBooking {
  id: string
  time: string
  service: string
  route: string
  status: 'Completed' | 'On Trip' | 'Upcoming' | 'Cancelled'
  day: number
  hourOffset: number
  stack: number
}

const ROW_HEIGHT = 72
const CARD_HEIGHT = 58
const CARD_GAP = 6
const TIME_COL_WIDTH = 52
const HOUR_START = 9
const CURRENT_HOUR = 13.5

const calendarBookings = calendarBookingsData as CalendarBooking[]

const days = [
  { label: 'Wed', date: '05 Mar', os: 2, limitless: 0 },
  { label: 'Thu', date: '06 Mar', os: 1, limitless: 1, active: true },
  { label: 'Fri', date: '07 Mar', os: 3, limitless: 0 },
  { label: 'Sat', date: '08 Mar', os: 1, limitless: 2 },
  { label: 'Sun', date: '09 Mar', os: 0, limitless: 1 },
]

const hours = Array.from({ length: 9 }, (_, i) => HOUR_START + i)

const statusDot: Record<string, string> = {
  Completed: 'bg-[#16A34A]',
  'On Trip': 'bg-[#D97706]',
  Upcoming: 'bg-[#2563EB]',
  Cancelled: 'bg-[#9CA3AF]',
}

const serviceIcons: Record<string, React.ElementType> = {
  Flight: Plane,
  Hotel: Bed,
  Transport: Bus,
  'Explore UAE': Globe,
}

const legend = [
  { label: 'Completed', count: 14, color: 'bg-[#16A34A]' },
  { label: 'On Trip', count: 3, color: 'bg-[#D97706]' },
  { label: 'Upcoming', count: 0, color: 'bg-[#2563EB]' },
  { label: 'Cancelled', count: 1, color: 'bg-[#9CA3AF]' },
]

function BookingCard({ booking }: { booking: CalendarBooking }) {
  const Icon = serviceIcons[booking.service] ?? Plane
  const isCancelled = booking.status === 'Cancelled'

  return (
    <div
      className={cn(
        'rounded-lg border border-[#E8EAED] bg-white px-2.5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
        isCancelled && 'opacity-45',
      )}
    >
      <div className="flex items-center gap-1">
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', statusDot[booking.status])} />
        <span
          className={cn(
            'truncate text-[11px] font-semibold underline decoration-[#D1D5DB] underline-offset-2',
            isCancelled ? 'text-[#9CA3AF]' : 'text-[#111827]',
          )}
        >
          {booking.id}
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <Icon className={cn('h-3 w-3', isCancelled ? 'text-[#9CA3AF]' : 'text-primary')} />
          <span
            className={cn(
              'text-[11px] font-semibold',
              isCancelled ? 'text-[#9CA3AF]' : 'text-[#111827]',
            )}
          >
            {booking.service}
          </span>
        </div>
        <button type="button" className="ml-0.5 shrink-0 p-0">
          <MoreVertical className="h-3 w-3 text-[#9CA3AF]" />
        </button>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-1 text-[10px] text-[#6B7280]">
          <Clock className="h-2.5 w-2.5" />
          {booking.time}
        </div>
        <p
          className={cn(
            'truncate text-right text-[10px] font-medium',
            isCancelled ? 'text-[#9CA3AF]' : 'text-[#374151]',
          )}
        >
          {booking.route}
        </p>
      </div>
    </div>
  )
}

export function BookingCalendarPage() {
  const [filters, setFilters] = useState<BookingsFilters>(defaultFilters)
  const gridHeight = hours.length * ROW_HEIGHT
  const currentTimeTop = (CURRENT_HOUR - HOUR_START) * ROW_HEIGHT

  return (
    <div className="p-6">
      <div className="mb-5">
        <SummaryPills showCalendarLink calendarActive />
      </div>

      <div className="mb-5">
        <BookingsFiltersBar filters={filters} onChange={setFilters} showSearchByAmount={false} />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#111827]">Bookings Timeline</h2>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-[13px] text-[#374151] hover:bg-[#F9FAFB]"
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-2.5">
          <div className="flex items-center gap-2">
            <button type="button" className="rounded p-0.5 text-[#9CA3AF] hover:text-[#374151]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-[13px] text-[#374151]">
              05 Mar &apos;25 - 14 Mar &apos;25
            </span>
            <button type="button" className="rounded p-0.5 text-[#9CA3AF] hover:text-[#374151]">
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="rounded-full border border-[#EDE6BE] bg-[#FFFBE5] px-2.5 py-0.5 text-[12px] font-medium text-[#9C8B2E]">
              Total 18
            </span>
          </div>
          <div className="flex items-center gap-4">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[12px]">
                <span className={cn('h-2 w-2 rounded-full', item.color)} />
                <span className="text-[#6B7280]">{item.label}</span>
                <span className="font-medium text-[#111827]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div style={{ minWidth: 860 }}>
            <div
              className="grid border-b border-[#E5E7EB] bg-[#FAFAFA]"
              style={{ gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(5, 1fr)` }}
            >
              <div />
              {days.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    'relative border-l border-[#E5E7EB] px-2 py-2 text-center',
                    day.active && 'bg-white',
                  )}
                >
                  {day.active && (
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-[#2563EB]" />
                  )}
                  <p className="text-[12px] font-medium text-[#111827]">
                    {day.label}, {day.date}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#9CA3AF]">
                    OS {day.os}&nbsp;&nbsp;Limitless {day.limitless}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative" style={{ height: gridHeight }}>
              <div
                className="absolute inset-0 grid"
                style={{ gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(5, 1fr)` }}
              >
                {hours.map((hour) => (
                  <div key={hour} className="contents">
                    <div
                      className="border-r border-b border-[#E5E7EB] pr-1.5 pt-1 text-right text-[11px] text-[#9CA3AF]"
                      style={{ height: ROW_HEIGHT }}
                    >
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    {days.map((_, dayIdx) => (
                      <div
                        key={`${hour}-${dayIdx}`}
                        className="relative border-b border-l border-[#E5E7EB] bg-white"
                        style={{ height: ROW_HEIGHT }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div
                className="pointer-events-none absolute z-10"
                style={{ top: currentTimeTop, left: 0, right: 0 }}
              >
                <div className="relative border-t-2 border-[#2563EB]">
                  <div className="absolute -left-0 -top-[5px] h-[10px] w-[10px] rounded-full bg-[#2563EB]" />
                </div>
              </div>

              {calendarBookings.map((booking) => {
                const cardTop =
                  booking.hourOffset * ROW_HEIGHT + 6 + booking.stack * (CARD_HEIGHT + CARD_GAP)
                const colWidth = `calc((100% - ${TIME_COL_WIDTH}px) / 5)`
                const cardLeft = `calc(${TIME_COL_WIDTH}px + ${booking.day} * ${colWidth} + 6px)`
                const cardWidth = `calc(${colWidth} - 12px)`

                return (
                  <div
                    key={booking.id}
                    className="absolute z-20"
                    style={{
                      top: cardTop,
                      left: cardLeft,
                      width: cardWidth,
                      maxWidth: 148,
                    }}
                  >
                    <BookingCard booking={booking} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
