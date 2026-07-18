import { useState, useMemo, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { SummaryPills } from '../components/bookings/SummaryPills'
import { BookingsFiltersBar } from '../components/bookings/BookingsFiltersBar'
import { BookingsTable } from '../components/bookings/BookingsTable'
import { Toggle } from '../components/ui/Toggle'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CustomerLedgerModal } from '../components/ledger/CustomerLedgerModal'
import { mockBookings, currentUser } from '../data/mockBookings'
import type {
  Booking,
  BookingTab,
  ApprovalFilter,
  BookingsFilters,
} from '../types/booking'
import { cn } from '../utils/cn'

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

export function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>('bookings')
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>('All')
  const [approvalDropdownOpen, setApprovalDropdownOpen] = useState(false)
  const [filters, setFilters] = useState<BookingsFilters>(defaultFilters)
  const [pageSize, setPageSize] = useState(6)
  const [ledgerBooking, setLedgerBooking] = useState<Booking | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [confirmDialog, setConfirmDialog] = useState<{
    booking: Booking
    type: 'approve' | 'reject'
  } | null>(null)

  const showWaitingTab = currentUser.isAdmin || currentUser.canApproveAll

  const filteredData = useMemo(() => {
    let data = [...mockBookings]

    if (activeTab === 'bookings') {
      data = data.filter(
        (b) => !b.isDeleted && (!b.requiresApproval || b.bookingStatus === 'Approved'),
      )
    } else if (activeTab === 'waiting') {
      data = data.filter((b) => !b.isDeleted && b.requiresApproval)
      if (approvalFilter !== 'All') {
        data = data.filter((b) => b.bookingStatus === approvalFilter)
      }
    } else if (activeTab === 'deleted') {
      data = data.filter((b) => b.isDeleted)
      data.sort(
        (a, b) =>
          new Date(b.deletedAt ?? 0).getTime() - new Date(a.deletedAt ?? 0).getTime(),
      )
      return applyCommonFilters(data, filters)
    }

    data.sort(
      (a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    )
    return applyCommonFilters(data, filters)
  }, [activeTab, approvalFilter, filters])

  const allSelected =
    filteredData.length > 0 && filteredData.every((b) => selectedRows.has(b.id))

  const handleAction = useCallback((action: string, booking: Booking) => {
    if (action === 'approve') {
      setConfirmDialog({ booking, type: 'approve' })
      return
    }
    if (action === 'reject') {
      setConfirmDialog({ booking, type: 'reject' })
      return
    }
    setToast(`${action} action triggered for ${booking.id}`)
    setTimeout(() => setToast(null), 3000)
  }, [])

  function handleConfirm() {
    if (!confirmDialog) return
    setToast(
      `Booking ${confirmDialog.booking.id} ${confirmDialog.type === 'approve' ? 'approved' : 'rejected'}`,
    )
    setTimeout(() => setToast(null), 3000)
    setConfirmDialog(null)
  }

  const tabs: { key: BookingTab; label: string; hidden?: boolean }[] = [
    { key: 'bookings', label: 'Bookings' },
    { key: 'deleted', label: 'Deleted' },
    { key: 'waiting', label: 'Waiting for Approval', hidden: !showWaitingTab },
  ]

  return (
    <div className="p-6">
      <div className="mb-5">
        <SummaryPills
          selectionMode={selectionMode}
          onSelectionModeChange={(mode) => {
            setSelectionMode(mode)
            if (!mode) setSelectedRows(new Set())
          }}
          onSelectAll={() => {
            if (allSelected) setSelectedRows(new Set())
            else setSelectedRows(new Set(filteredData.map((b) => b.id)))
          }}
          allSelected={allSelected}
        />
      </div>

      <div className="mb-4">
        <BookingsFiltersBar filters={filters} onChange={setFilters} />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-1">
            {tabs
              .filter((t) => !t.hidden)
              .map((tab) => (
                <div key={tab.key} className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.key)
                      if (tab.key === 'waiting') {
                        setApprovalDropdownOpen(true)
                      } else {
                        setApprovalDropdownOpen(false)
                      }
                    }}
                    className={cn(
                      'cursor-pointer border-b-2 px-3 py-1.5 text-[13px] font-medium transition-colors',
                      activeTab === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-[#6B7280] hover:text-[#374151]',
                    )}
                  >
                    {tab.label}
                  </button>
                </div>
              ))}

            {activeTab === 'waiting' && (
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setApprovalDropdownOpen(!approvalDropdownOpen)}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-[#F5F5F5] px-3 py-1.5 text-[13px] font-medium text-text"
                >
                  {approvalFilter}
                  <ChevronDown className="h-3.5 w-3.5 text-muted" />
                </button>
                {approvalDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setApprovalDropdownOpen(false)} />
                    <div className="absolute left-0 top-full z-50 mt-1 min-w-[130px] overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                      {(['All', 'Approved', 'Pending', 'Rejected'] as ApprovalFilter[]).map(
                        (opt, i) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setApprovalFilter(opt)
                              setApprovalDropdownOpen(false)
                            }}
                            className={cn(
                              'block w-full cursor-pointer px-4 py-2.5 text-left text-[13px] hover:bg-surface',
                              i < 3 && 'border-b border-border-light',
                              approvalFilter === opt ? 'font-medium text-primary' : 'text-text',
                            )}
                          >
                            {opt}
                          </button>
                        ),
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Toggle
              checked={filters.showIncomplete}
              onChange={(v) => setFilters({ ...filters, showIncomplete: v })}
              label="Show Incomplete Bookings"
            />
            <span className="rounded-full border border-[#EDE6BE] bg-[#FFFBE5] px-3 py-1 text-[12px] font-semibold text-[#9C8B2E]">
              Total {filteredData.length}
            </span>
          </div>
        </div>

        <BookingsTable
          data={filteredData}
          tab={activeTab}
          approvalFilter={approvalFilter}
          onAction={handleAction}
          onLedgerOpen={setLedgerBooking}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          selectionMode={selectionMode}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          embedded
        />
      </div>

      {ledgerBooking && (
        <CustomerLedgerModal
          open={!!ledgerBooking}
          onClose={() => setLedgerBooking(null)}
          customerName={ledgerBooking.customerName}
          customerId={ledgerBooking.customerId}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          open
          onClose={() => setConfirmDialog(null)}
          onConfirm={handleConfirm}
          bookingId={confirmDialog.booking.id}
          type={confirmDialog.type}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function applyCommonFilters(data: Booking[], filters: BookingsFilters): Booking[] {
  return data.filter((b) => {
    if (filters.showIncomplete === false && b.isIncomplete) return false
    if (filters.bookingDateStart && b.bookingDate < filters.bookingDateStart) return false
    if (filters.bookingDateEnd && b.bookingDate > filters.bookingDateEnd) return false
    if (filters.travelDateStart && b.travelDate < filters.travelDateStart) return false
    if (filters.travelDateEnd && b.travelDate > filters.travelDateEnd) return false
    if (filters.bookingType === 'Limitless' && b.source !== 'Limitless') return false
    if (filters.bookingType === 'Other Services' && b.source !== 'OS') return false

    if (filters.primaryOwners.length > 0 || filters.secondaryOwners.length > 0) {
      const ownerIds = b.owners.map((o) => o.id)
      if (filters.advancedOwnerSearch) {
        if (
          filters.primaryOwners.length > 0 &&
          !filters.primaryOwners.some((id) => ownerIds.includes(id))
        )
          return false
        if (
          filters.secondaryOwners.length > 0 &&
          !filters.secondaryOwners.some((id) => ownerIds.includes(id))
        )
          return false
      } else if (!filters.primaryOwners.some((id) => ownerIds.includes(id))) {
        return false
      }
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      if (
        !b.id.toLowerCase().includes(q) &&
        !b.leadPax.toLowerCase().includes(q) &&
        !b.amount.toString().includes(q)
      )
        return false
    }
    return true
  })
}
