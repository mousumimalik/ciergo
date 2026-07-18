import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  Plane,
  Bed,
  Bus,
  Ticket,
  PersonStanding,
  CreditCard,
  Shield,
  LayoutGrid,
} from 'lucide-react'
import type { Booking, BookingTab, ApprovalFilter, ServiceType } from '../../types/booking'
import { PaymentStatusCell, ServiceStatusCell } from '../ui/StatusBadge'
import { Pagination } from '../ui/Pagination'
import { ServiceCell, OwnerAvatars } from './ServiceCell'
import {
  BookingActionsMenu,
  VoucherButton,
  TasksButton,
  EmptyCell,
} from './BookingActionsMenu'
import {
  HeaderPopover,
  FilterFooter,
  BarSortIcon,
  SwapIcon,
  FunnelIcon,
  ColumnLabel,
  ColumnHeaderButton,
} from './TableHeaderUtils'
import { formatCurrency, formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

const SERVICE_FILTER_OPTIONS = [
  { id: 'Flight', label: 'Flight', icon: Plane },
  { id: 'Accommodation', label: 'Accommodation', icon: Bed },
  { id: 'Transportation', label: 'Transportation (Land)', icon: Bus },
  { id: 'Ticket', label: 'Ticket (Attraction)', icon: Ticket },
  { id: 'Activity', label: 'Activity', icon: PersonStanding },
  { id: 'Visa', label: 'Visa', icon: CreditCard },
  { id: 'Insurance', label: 'Travel Insurance', icon: Shield },
  { id: 'Others', label: 'Others', icon: LayoutGrid },
]

interface BookingsTableProps {
  data: Booking[]
  tab: BookingTab
  approvalFilter?: ApprovalFilter
  onAction: (action: string, booking: Booking) => void
  onLedgerOpen: (booking: Booking) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  selectionMode?: boolean
  selectedRows?: Set<string>
  onSelectedRowsChange?: (rows: Set<string>) => void
  embedded?: boolean
}

export function BookingsTable({
  data,
  tab,
  approvalFilter,
  onAction,
  onLedgerOpen,
  pageSize,
  onPageSizeChange,
  selectionMode = false,
  selectedRows = new Set(),
  onSelectedRowsChange,
  embedded = false,
}: BookingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [showBilledTo, setShowBilledTo] = useState(false)
  const [showServiceStatus, setShowServiceStatus] = useState(false)
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [serviceFilterOpen, setServiceFilterOpen] = useState(false)
  const [dateColumn, setDateColumn] = useState<'travelDate' | 'bookingDate'>('travelDate')
  const [tempDateColumn, setTempDateColumn] = useState<'travelDate' | 'bookingDate'>('travelDate')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [tempServices, setTempServices] = useState<string[]>([])
  const [otherServicesChecked, setOtherServicesChecked] = useState(true)
  const [limitlessChecked, setLimitlessChecked] = useState(true)
  const [tempOther, setTempOther] = useState(true)
  const [tempLimitless, setTempLimitless] = useState(true)

  const travelSort = sorting.find((s) => s.id === dateColumn)
  const amountSort = sorting.find((s) => s.id === 'amount')

  const filteredData = useMemo(() => {
    return data.filter((b) => {
      if (selectedServices.length > 0) {
        const matchService = selectedServices.some((s) => {
          if (s === 'Others') return !['Flight', 'Accommodation', 'Transportation'].includes(b.service)
          if (s === 'Transportation') return b.service === 'Transportation'
          return b.service === s
        })
        if (!matchService) return false
      }
      if (!otherServicesChecked && b.source === 'OS') return false
      if (!limitlessChecked && b.source === 'Limitless') return false
      return true
    })
  }, [data, selectedServices, otherServicesChecked, limitlessChecked])

  const showVoucherTasks = (booking: Booking) => {
    if (tab === 'deleted') return false
    if (tab === 'waiting' && booking.bookingStatus === 'Rejected') return false
    return true
  }

  function toggleRow(id: string) {
    const next = new Set(selectedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectedRowsChange?.(next)
  }

  function toggleSort(columnId: string) {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === columnId)
      if (!existing) return [{ id: columnId, desc: false }]
      if (!existing.desc) return [{ id: columnId, desc: true }]
      return []
    })
  }

  const columns = useMemo<ColumnDef<Booking>[]>(() => {
    const cols: ColumnDef<Booking>[] = []

    if (selectionMode) {
      cols.push({
        id: 'select',
        header: () => {
          const pageRows = filteredData.slice(0, pageSize)
          const allSelected = pageRows.length > 0 && pageRows.every((b) => selectedRows.has(b.id))
          return (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                const next = new Set(selectedRows)
                if (allSelected) pageRows.forEach((b) => next.delete(b.id))
                else pageRows.forEach((b) => next.add(b.id))
                onSelectedRowsChange?.(next)
              }}
              className="h-4 w-4 accent-primary"
            />
          )
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.has(row.original.id)}
            onChange={() => toggleRow(row.original.id)}
            className="h-4 w-4 accent-primary"
          />
        ),
        size: 44,
      })
    }

    cols.push(
      {
        accessorKey: 'id',
        header: () => <ColumnLabel>Booking ID</ColumnLabel>,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onLedgerOpen(row.original)}
            className="text-[13px] font-medium text-[#111827] hover:text-primary"
          >
            {row.original.id}
          </button>
        ),
      },
      {
        id: 'leadPax',
        accessorFn: (row) => (showBilledTo ? row.billedTo : row.leadPax),
        header: () => (
          <ColumnHeaderButton onClick={() => setShowBilledTo(!showBilledTo)}>
            {showBilledTo ? 'Billed To' : 'Lead Pax'}
            <SwapIcon />
          </ColumnHeaderButton>
        ),
        cell: ({ row }) => (
          <span className="text-[13px] text-[#374151]">
            {showBilledTo ? row.original.billedTo : row.original.leadPax}
          </span>
        ),
      },
      {
        id: dateColumn,
        accessorKey: dateColumn,
        header: () => (
          <HeaderPopover
            open={dateFilterOpen}
            onClose={() => setDateFilterOpen(false)}
            anchor={
              <div className="flex items-center gap-1">
                <ColumnHeaderButton
                  onClick={() => {
                    setTempDateColumn(dateColumn)
                    setDateFilterOpen(!dateFilterOpen)
                  }}
                >
                  {dateColumn === 'travelDate' ? 'Travel Date' : 'Booking Date'}
                  <FunnelIcon />
                </ColumnHeaderButton>
                <button type="button" onClick={() => toggleSort(dateColumn)} className="p-0.5">
                  <BarSortIcon
                    active={!!travelSort}
                    direction={travelSort?.desc ? 'desc' : 'asc'}
                  />
                </button>
              </div>
            }
          >
            <label className="flex cursor-pointer items-center gap-2 border-b border-border px-4 py-2.5 text-[13px]">
              <input
                type="checkbox"
                checked={tempDateColumn === 'travelDate'}
                onChange={() => setTempDateColumn('travelDate')}
                className="accent-primary"
              />
              Travel Date
            </label>
            <label className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-[13px]">
              <input
                type="checkbox"
                checked={tempDateColumn === 'bookingDate'}
                onChange={() => setTempDateColumn('bookingDate')}
                className="accent-primary"
              />
              Booking Date
            </label>
            <FilterFooter
              onReset={() => setTempDateColumn('travelDate')}
              onApply={() => {
                setDateColumn(tempDateColumn)
                setDateFilterOpen(false)
              }}
            />
          </HeaderPopover>
        ),
        cell: ({ row }) => (
          <span className="text-[13px] text-[#374151]">
            {formatDate(row.original[dateColumn])}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'service',
        header: () => (
          <HeaderPopover
            open={serviceFilterOpen}
            onClose={() => setServiceFilterOpen(false)}
            className="min-w-[240px]"
            anchor={
              <div className="flex justify-center">
                <ColumnHeaderButton
                  onClick={() => {
                    setTempServices([...selectedServices])
                    setTempOther(otherServicesChecked)
                    setTempLimitless(limitlessChecked)
                    setServiceFilterOpen(!serviceFilterOpen)
                  }}
                >
                  Service
                  <FunnelIcon />
                </ColumnHeaderButton>
              </div>
            }
          >
            <label className="flex items-center gap-2 border-b border-border px-4 py-2 text-[12px] font-semibold uppercase text-text">
              <input
                type="checkbox"
                checked={tempOther}
                onChange={(e) => setTempOther(e.target.checked)}
                className="accent-primary"
              />
              Other Services
            </label>
            {SERVICE_FILTER_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-2 border-b border-border-light px-6 py-2 text-[13px]"
              >
                <input
                  type="checkbox"
                  checked={tempServices.includes(opt.id)}
                  onChange={() =>
                    setTempServices((prev) =>
                      prev.includes(opt.id)
                        ? prev.filter((x) => x !== opt.id)
                        : [...prev, opt.id],
                    )
                  }
                  className="accent-primary"
                />
                <opt.icon className="h-3.5 w-3.5 text-muted" />
                {opt.label}
              </label>
            ))}
            <label className="flex items-center gap-2 border-b border-border px-4 py-2 text-[12px] font-semibold uppercase text-text">
              <input
                type="checkbox"
                checked={tempLimitless}
                onChange={(e) => setTempLimitless(e.target.checked)}
                className="accent-primary"
              />
              Limitless
            </label>
            <FilterFooter
              extra={
                <button
                  type="button"
                  onClick={() => setTempServices([])}
                  className="text-[12px] text-muted hover:text-text"
                >
                  Deselect All
                </button>
              }
              onReset={() => {
                setTempServices([])
                setTempOther(true)
                setTempLimitless(true)
              }}
              onApply={() => {
                setSelectedServices(tempServices)
                setOtherServicesChecked(tempOther)
                setLimitlessChecked(tempLimitless)
                setServiceFilterOpen(false)
              }}
            />
          </HeaderPopover>
        ),
        cell: ({ row }) => (
          <ServiceCell
            service={row.original.service as ServiceType}
            destination={row.original.destination}
          />
        ),
      },
      {
        id: 'status',
        header: () => (
          <div className="flex justify-center">
            <ColumnHeaderButton onClick={() => setShowServiceStatus(!showServiceStatus)}>
              {showServiceStatus ? 'Service Status' : 'Payment Status'}
              <SwapIcon />
            </ColumnHeaderButton>
          </div>
        ),
        cell: ({ row }) =>
          showServiceStatus ? (
            <ServiceStatusCell status={row.original.serviceStatus} />
          ) : (
            <PaymentStatusCell
              status={row.original.paymentStatus}
              customerAmount={row.original.pendingCustomerAmount}
              vendorAmount={row.original.pendingVendorAmount}
            />
          ),
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div className="flex justify-center">
            <ColumnHeaderButton onClick={() => toggleSort('amount')}>
              Amount
              <BarSortIcon
                active={!!amountSort}
                direction={amountSort?.desc ? 'desc' : 'asc'}
              />
            </ColumnHeaderButton>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-center">
            <span className="text-[13px] font-medium text-[#111827]">
              {formatCurrency(getValue<number>())}
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        id: 'owner',
        header: () => (
          <div className="flex justify-center">
            <ColumnLabel>Owner</ColumnLabel>
          </div>
        ),
        cell: ({ row }) => <OwnerAvatars owners={row.original.owners} />,
      },
    )

    if (tab !== 'deleted') {
      cols.push(
        {
          id: 'voucher',
          header: () => <div className="text-center"><ColumnLabel>Voucher</ColumnLabel></div>,
          cell: ({ row }) =>
            showVoucherTasks(row.original) ? <VoucherButton /> : <EmptyCell />,
        },
        {
          id: 'tasks',
          header: () => <div className="text-center"><ColumnLabel>Tasks</ColumnLabel></div>,
          cell: ({ row }) =>
            showVoucherTasks(row.original) ? (
              <TasksButton count={row.original.taskCount} />
            ) : (
              <EmptyCell />
            ),
        },
      )
    }

    cols.push({
      id: 'actions',
      header: () => <div className="text-center"><ColumnLabel>Actions</ColumnLabel></div>,
      cell: ({ row }) => (
        <BookingActionsMenu
          booking={row.original}
          tab={tab}
          approvalFilter={approvalFilter}
          onAction={onAction}
        />
      ),
    })

    return cols
  }, [
    tab,
    approvalFilter,
    showBilledTo,
    showServiceStatus,
    dateColumn,
    dateFilterOpen,
    serviceFilterOpen,
    tempDateColumn,
    tempServices,
    tempOther,
    tempLimitless,
    selectedServices,
    otherServicesChecked,
    limitlessChecked,
    selectedRows,
    selectionMode,
    travelSort,
    amountSort,
    filteredData,
    pageSize,
    onAction,
    onLedgerOpen,
    onSelectedRowsChange,
  ])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const currentPage = table.getState().pagination.pageIndex + 1

  return (
    <div className={cn(!embedded && 'overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm')}>
      <div className={cn('overflow-x-auto', embedded && 'border-t border-[#E5E7EB]')}>
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[#E5E7EB] bg-[#F2F2F2]">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-2.5 text-left font-normal',
                      ['owner', 'voucher', 'tasks', 'actions', 'status', 'amount', 'service'].includes(header.id) &&
                        'text-center',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-[#F3F4F6] transition-colors hover:bg-[#F3F0F6]',
                  i % 2 === 1 ? 'bg-[#F8F8F8]' : 'bg-white',
                  selectedRows.has(row.original.id) && 'bg-primary-light/20',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      'px-4 py-3 align-middle',
                      ['owner', 'voucher', 'tasks', 'actions', 'status', 'amount', 'service'].includes(
                        cell.column.id,
                      ) && 'text-center',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={currentPage}
        pageSize={table.getState().pagination.pageSize}
        total={filteredData.length}
        onPageChange={(p) => table.setPageIndex(p - 1)}
        onPageSizeChange={(size) => {
          onPageSizeChange(size)
          table.setPageSize(size)
        }}
      />
    </div>
  )
}
