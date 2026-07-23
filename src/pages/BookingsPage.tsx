import { useState, useMemo, useCallback } from 'react'
import { ChevronDown, AlertCircle, RefreshCw } from 'lucide-react'
import { SummaryPills } from '../components/bookings/SummaryPills'
import { BookingsFiltersBar } from '../components/bookings/BookingsFiltersBar'
import { BookingsTable } from '../components/bookings/BookingsTable'
import { BookingsTableSkeleton } from '../components/bookings/BookingsTableSkeleton'
import { Toggle } from '../components/ui/Toggle'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CustomerLedgerModal } from '../components/ledger/CustomerLedgerModal'
import { RecordPaymentDrawer } from '../components/payments/RecordPaymentDrawer'
import type { DrawerMode } from '../components/payments/RecordPaymentDrawer'
import { ViewPaymentsPanel } from '../components/payments/ViewPaymentsPanel'
import { DEFAULT_BOOKINGS_FILTERS } from '../constants/bookingsFilters'
import { currentUser } from '../data/currentUser'
import { useBookings } from '../hooks/useBookings'
import { usePayments } from '../hooks/usePayments'
import type {
  Booking,
  BookingTab,
  ApprovalFilter,
  BookingsFilters,
} from '../types/booking'
import type { Payment, PaymentFormData } from '../types/payment'
import {
  enrichBookingWithPayments,
  getPaymentsForBooking,
} from '../utils/paymentStatus'
import { sortByDeletedAtDesc, sortByModifiedAtDesc } from '../utils/sortBookings'
import { extractOwnersFromBookings } from '../utils/owners'
import { cn } from '../utils/cn'

const defaultFilters: BookingsFilters = { ...DEFAULT_BOOKINGS_FILTERS }

type DrawerState =
  | { kind: 'closed' }
  | { kind: 'record'; booking: Booking; mode: DrawerMode; payment?: Payment }
  | { kind: 'view-list'; booking: Booking }

export function BookingsPage() {
  const {
    bookings: rawBookings,
    loading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings,
    softDeleteBooking,
    restoreBooking,
    duplicateBooking,
  } = useBookings()
  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
    savePayment,
    editPayment,
    saving,
  } = usePayments()

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
  const [drawer, setDrawer] = useState<DrawerState>({ kind: 'closed' })

  const showWaitingTab = currentUser.isAdmin || currentUser.canApproveAll
  const loading = bookingsLoading || paymentsLoading
  const error = bookingsError ?? paymentsError

  const enrichedBookings = useMemo(
    () => rawBookings.map((b) => enrichBookingWithPayments(b, payments)),
    [rawBookings, payments],
  )

  const filteredData = useMemo(() => {
    let data = [...enrichedBookings]

    if (activeTab === 'bookings') {
      data = data.filter((b) => {
        if (b.isDeleted) return false
        if (filters.showIncomplete) return b.isIncomplete
        return !b.isIncomplete
      })
    } else if (activeTab === 'waiting') {
      data = data.filter((b) => !b.isDeleted && b.isIncomplete)
      if (approvalFilter !== 'All') {
        data = data.filter((b) => b.bookingStatus === approvalFilter)
      }
    } else if (activeTab === 'deleted') {
      data = data.filter((b) => b.isDeleted)
      return applyCommonFilters(sortByDeletedAtDesc(data), filters, activeTab)
    }

    return applyCommonFilters(sortByModifiedAtDesc(data), filters, activeTab)
  }, [enrichedBookings, activeTab, approvalFilter, filters])

  const availableOwners = useMemo(
    () => extractOwnersFromBookings(enrichedBookings),
    [enrichedBookings],
  )

  const allSelected =
    filteredData.length > 0 && filteredData.every((b) => selectedRows.has(b.id))

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleAction = useCallback(
    async (action: string, booking: Booking) => {
      if (action === 'approve') {
        setConfirmDialog({ booking, type: 'approve' })
        return
      }
      if (action === 'reject') {
        setConfirmDialog({ booking, type: 'reject' })
        return
      }
      if (action === 'record-payment') {
        setDrawer({ kind: 'record', booking, mode: 'create' })
        return
      }
      if (action === 'view-payments') {
        setDrawer({ kind: 'view-list', booking })
        return
      }
      try {
        if (action === 'delete') {
          await softDeleteBooking(booking)
          showToast(`Booking ${booking.id} deleted`)
          return
        }
        if (action === 'restore') {
          await restoreBooking(booking)
          showToast(`Booking ${booking.id} restored`)
          return
        }
        if (action === 'duplicate') {
          await duplicateBooking(booking)
          showToast(`Booking ${booking.id} duplicated`)
          return
        }
        showToast(`${action} action triggered for ${booking.id}`)
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Action failed')
      }
    },
    [showToast, softDeleteBooking, restoreBooking, duplicateBooking],
  )

  async function handleConfirm() {
    if (!confirmDialog) return
    showToast(
      `Booking ${confirmDialog.booking.id} ${confirmDialog.type === 'approve' ? 'approved' : 'rejected'}`,
    )
    setConfirmDialog(null)
  }

  async function handleSavePayment(form: PaymentFormData, paymentId: string) {
    if (drawer.kind !== 'record') return

    if (drawer.mode === 'edit' && drawer.payment?.id) {
      await editPayment(drawer.payment.id, form, paymentId, drawer.booking.id)
      showToast(`Payment ${paymentId} updated`)
    } else {
      await savePayment(form, paymentId, drawer.booking.id)
      showToast(`Payment ${paymentId} recorded`)
    }
    await refetchPayments()
  }

  function handleReload() {
    setFilters({ ...DEFAULT_BOOKINGS_FILTERS })
    refetchBookings()
    refetchPayments()
  }

  function handleRetry() {
    refetchBookings()
    refetchPayments()
  }

  const drawerBooking =
    drawer.kind === 'record' || drawer.kind === 'view-list' ? drawer.booking : null

  const bookingPayments = drawerBooking
    ? getPaymentsForBooking(payments, drawerBooking.id)
    : []

  const tabs: { key: BookingTab; label: string; hidden?: boolean }[] = [
    { key: 'bookings', label: 'Bookings' },
    { key: 'deleted', label: 'Deleted' },
    { key: 'waiting', label: 'Waiting for Approval', hidden: !showWaitingTab },
  ]

  return (
    <div className="p-6">
      <div className="mb-5">
        <SummaryPills
          bookings={enrichedBookings}
          loading={loading}
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
        <BookingsFiltersBar
          filters={filters}
          onChange={setFilters}
          onReload={handleReload}
          owners={availableOwners}
        />
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
              Total {loading ? '—' : filteredData.length}
              {!loading && filters.showIncomplete && activeTab === 'bookings' && (
                <span className="ml-1 font-normal text-[#B45309]">(incomplete)</span>
              )}
            </span>
          </div>
        </div>

        {loading ? (
          <BookingsTableSkeleton embedded />
        ) : error ? (
          <BookingsErrorState message={error} onRetry={handleRetry} />
        ) : filteredData.length === 0 ? (
          <BookingsEmptyState onRetry={handleReload} />
        ) : (
          <BookingsTable
            data={filteredData}
            payments={payments}
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
        )}
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

      {drawer.kind === 'view-list' && (
        <ViewPaymentsPanel
          open
          bookingId={drawer.booking.id}
          payments={bookingPayments}
          onClose={() => setDrawer({ kind: 'closed' })}
          onView={(payment) =>
            setDrawer({
              kind: 'record',
              booking: drawer.booking,
              mode: 'view',
              payment,
            })
          }
          onEdit={(payment) =>
            setDrawer({
              kind: 'record',
              booking: drawer.booking,
              mode: 'edit',
              payment,
            })
          }
        />
      )}

      {drawer.kind === 'record' && (
        <RecordPaymentDrawer
          open
          booking={drawer.booking}
          mode={drawer.mode}
          payment={drawer.payment}
          existingPayments={bookingPayments}
          onClose={() => setDrawer({ kind: 'closed' })}
          onSave={handleSavePayment}
          saving={saving}
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

function BookingsErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center border-t border-[#E5E7EB] py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
        <AlertCircle className="h-6 w-6 text-[#DC2626]" />
      </div>
      <p className="mt-4 text-[14px] font-medium text-[#374151]">Unable to load bookings</p>
      <p className="mt-1 max-w-sm text-center text-[13px] text-[#9CA3AF]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg bg-[#6F35D0] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#5A2BB0]"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  )
}

function BookingsEmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center border-t border-[#E5E7EB] py-20">
      <p className="text-[14px] font-medium text-[#374151]">No bookings found</p>
      <p className="mt-1 text-[13px] text-[#9CA3AF]">
        Try adjusting your filters or refresh the data.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 cursor-pointer rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#F9FAFB]"
      >
        Refresh
      </button>
    </div>
  )
}

function applyCommonFilters(
  data: Booking[],
  filters: BookingsFilters,
  _activeTab: BookingTab,
): Booking[] {
  return data.filter((b) => {
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
