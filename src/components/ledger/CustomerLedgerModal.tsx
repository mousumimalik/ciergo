import { useState } from 'react'
import {
  Eye,
  Pencil,
  RefreshCw,
  FileText,
  ChevronDown,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  ArrowUpDown,
  X,
  Download,
  Share2,
  MessageCircle,
  Mail,
  Link2,
  Copy,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Toggle } from '../ui/Toggle'
import { Pagination } from '../ui/Pagination'
import { ServiceCell } from '../bookings/ServiceCell'
import { StatusBadge } from '../ui/StatusBadge'
import { Dropdown, DropdownItem } from '../ui/Dropdown'
import {
  mockLedgerData,
  calculateCollectPay,
} from '../../data/mockLedger'
import type { LedgerEntry } from '../../types/ledger'
import { formatCurrency, formatDate, getCurrentFinancialYear } from '../../utils/format'
import { cn } from '../../utils/cn'

interface CustomerLedgerModalProps {
  open: boolean
  onClose: () => void
  customerName: string
  customerId: string
}

export function CustomerLedgerModal({
  open,
  onClose,
  customerName,
  customerId,
}: CustomerLedgerModalProps) {
  const fy = getCurrentFinancialYear()
  const [bookingDateStart, setBookingDateStart] = useState(fy.start)
  const [bookingDateEnd, setBookingDateEnd] = useState(fy.end)
  const [travelDateStart, setTravelDateStart] = useState('')
  const [travelDateEnd, setTravelDateEnd] = useState('')
  const [showPendingInvoices, setShowPendingInvoices] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pdfViewOpen, setPdfViewOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [viewPdfOpen, setViewPdfOpen] = useState(false)

  const filteredEntries = mockLedgerData.entries.filter((entry) => {
    if (showPendingInvoices && !entry.isPendingInvoice) return false
    if (bookingDateStart && entry.bookingDate < bookingDateStart) return false
    if (bookingDateEnd && entry.bookingDate > bookingDateEnd) return false
    if (travelDateStart && entry.travelDate < travelDateStart) return false
    if (travelDateEnd && entry.travelDate > travelDateEnd) return false
    return true
  })

  const paginatedEntries = filteredEntries.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  const collectPay = calculateCollectPay(filteredEntries)

  return (
    <>
      <Modal open={open && !pdfViewOpen} onClose={onClose} size="xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              Ledger | {customerName} | {customerId}
            </h2>
            <button type="button" className="rounded-md p-1 hover:bg-surface">
              <Eye className="h-4 w-4 text-muted" />
            </button>
            <button type="button" className="rounded-md p-1 hover:bg-surface">
              <Pencil className="h-4 w-4 text-primary" />
            </button>
          </div>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2',
                collectPay.status === 'You Collect'
                  ? 'bg-success-light text-success'
                  : 'bg-danger-light text-danger',
              )}
            >
              <span className="text-sm font-semibold">{collectPay.status}</span>
              <span className="text-sm font-bold">
                {formatCurrency(collectPay.amount)}
              </span>
              <button type="button" className="ml-1">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dropdown
              open={viewPdfOpen}
              onOpenChange={setViewPdfOpen}
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
                >
                  <FileText className="h-4 w-4" />
                  View PDF
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              }
            >
              <DropdownItem
                icon={<FileText className="h-4 w-4" />}
                label="View PDF"
                onClick={() => {
                  setViewPdfOpen(false)
                  setPdfViewOpen(true)
                }}
              />
              <DropdownItem
                icon={<Download className="h-4 w-4" />}
                label="Download"
                onClick={() => {
                  setViewPdfOpen(false)
                  setDownloadOpen(true)
                }}
              />
              <DropdownItem
                icon={<Share2 className="h-4 w-4" />}
                label="Share"
                onClick={() => {
                  setViewPdfOpen(false)
                  setShareOpen(true)
                }}
              />
            </Dropdown>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 px-6 py-4">
          <DateFilter
            label="Booking Date"
            start={bookingDateStart}
            end={bookingDateEnd}
            onStartChange={setBookingDateStart}
            onEndChange={setBookingDateEnd}
          />
          <DateFilter
            label="Travel Date"
            start={travelDateStart}
            end={travelDateEnd}
            onStartChange={setTravelDateStart}
            onEndChange={setTravelDateEnd}
          />
          <Toggle
            checked={showPendingInvoices}
            onChange={setShowPendingInvoices}
            label="Show bookings with pending invoices"
            className="ml-auto"
          />
        </div>

        <div className="px-6 pb-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                {['ID', 'Service', 'Booking / Payment Date', 'Status / Mode', 'Account', 'Amount', 'Closing Balance', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-3 py-2.5 text-left text-xs font-medium text-muted"
                    >
                      <div className="flex items-center gap-1">
                        {col}
                        {(col.includes('Service') || col.includes('Status') || col.includes('Account')) && (
                          <Filter className="h-3 w-3" />
                        )}
                        {col.includes('Date') || col === 'Amount' ? (
                          <ArrowUpDown className="h-3 w-3" />
                        ) : null}
                      </div>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.map((entry, i) => (
                <LedgerRow key={entry.id} entry={entry} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredEntries.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <ArrowUpRight className="h-4 w-4" />
            You Gave
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <ArrowDownLeft className="h-4 w-4" />
            You Got
          </button>
        </div>
      </Modal>

      {pdfViewOpen && (
        <LedgerPdfView
          customerName={customerName}
          customerId={customerId}
          entries={filteredEntries}
          onClose={() => setPdfViewOpen(false)}
        />
      )}

      <ShareLedgerDialog open={shareOpen} onClose={() => setShareOpen(false)} />
      <DownloadDialog open={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </>
  )
}

function LedgerRow({ entry, index }: { entry: LedgerEntry; index: number }) {
  const isCredit = entry.type === 'Money Received' || entry.type === 'Booking Cancelled'
  const isDebit = entry.type === 'Booking Created' || entry.type === 'Money Paid'
  const sign = isCredit ? '+' : isDebit ? '-' : ''
  const amountColor = isCredit ? 'text-success' : isDebit ? 'text-danger' : 'text-gray-900'
  const balanceColor =
    entry.closingBalance >= 0 ? 'text-danger' : 'text-success'

  return (
    <tr className={cn('border-b border-border', index % 2 === 1 && 'bg-surface/30')}>
      <td className="px-3 py-2.5 text-sm font-medium">{entry.id}</td>
      <td className="px-3 py-2.5">
        <ServiceCell service={entry.service as never} />
      </td>
      <td className="px-3 py-2.5 text-sm">{formatDate(entry.date)}</td>
      <td className="px-3 py-2.5">
        <div className="flex flex-col gap-0.5">
          <StatusBadge status={entry.status as never} />
          <span className="text-xs text-muted">{entry.mode}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-sm">{entry.account}</td>
      <td className={cn('px-3 py-2.5 text-sm font-medium', amountColor)}>
        {sign} {formatCurrency(entry.amount)}
      </td>
      <td className={cn('px-3 py-2.5 text-sm font-medium', balanceColor)}>
        {formatCurrency(Math.abs(entry.closingBalance))}
      </td>
      <td className="px-3 py-2.5">
        <button type="button" className="text-xs text-primary hover:underline">
          View
        </button>
      </td>
    </tr>
  )
}

function DateFilter({
  label,
  start,
  end,
  onStartChange,
  onEndChange,
}: {
  label: string
  start: string
  end: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      <div className="flex items-center gap-1 rounded-lg border border-border px-2 py-1.5">
        <input
          type="date"
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="border-none bg-transparent text-xs focus:outline-none"
        />
        <span className="text-xs text-muted">→</span>
        <input
          type="date"
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          className="border-none bg-transparent text-xs focus:outline-none"
        />
      </div>
    </div>
  )
}

function LedgerPdfView({
  customerName,
  customerId,
  entries,
  onClose,
}: {
  customerName: string
  customerId: string
  entries: LedgerEntry[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">
          Ledger | {customerName} | {customerId}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface"
          >
            <Download className="h-4 w-4" /> Download
          </button>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold">Customer Ledger</h1>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                {['ID', 'Service', 'Date', 'Status', 'Account', 'Amount', 'Balance'].map(
                  (h) => (
                    <th key={h} className="px-3 py-2 text-left text-sm font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-sm">{entry.id}</td>
                  <td className="px-3 py-2 text-sm">{entry.service}</td>
                  <td className="px-3 py-2 text-sm">{formatDate(entry.date)}</td>
                  <td className="px-3 py-2 text-sm">{entry.status}</td>
                  <td className="px-3 py-2 text-sm">{entry.account}</td>
                  <td className="px-3 py-2 text-sm">{formatCurrency(entry.amount)}</td>
                  <td className="px-3 py-2 text-sm">
                    {formatCurrency(Math.abs(entry.closingBalance))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ShareLedgerDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [pendingOnly, setPendingOnly] = useState(false)
  const [customRange, setCustomRange] = useState(false)
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [copied, setCopied] = useState(false)

  const link = 'https://ciergo.app/ledger/share/abc123xyz'

  function handleCopy() {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Ledger Settings</h2>
        <button type="button" onClick={onClose}>
          <X className="h-5 w-5 text-muted" />
        </button>
      </div>
      <div className="space-y-4 px-6 py-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={(e) => setPendingOnly(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div>
            <p className="text-sm font-medium">Share Pending Invoices only</p>
            <p className="text-xs text-muted">
              Display only pending invoices those are not settled yet
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={customRange}
            onChange={(e) => setCustomRange(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Share in a custom Date Range</p>
            <p className="text-xs text-muted">
              Only data of selected date range would be shown
            </p>
            {customRange && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="rounded-lg border border-border px-2 py-1 text-sm"
                />
                <span className="text-muted">→</span>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="rounded-lg border border-border px-2 py-1 text-sm"
                />
              </div>
            )}
          </div>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            Share on WhatsApp
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Mail className="h-4 w-4" />
            Share on Email
          </button>
        </div>

        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <span className="flex-1 truncate text-sm text-primary">{link}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md p-1 hover:bg-white"
            >
              <Copy className="h-4 w-4 text-muted" />
            </button>
          </div>
          {!customRange && (
            <p className="mt-1 text-xs text-muted">
              Note: This link contains full ledger data
            </p>
          )}
          {copied && (
            <p className="mt-1 text-xs text-success">Link copied!</p>
          )}
        </div>
      </div>
    </Modal>
  )
}

function DownloadDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [fileName, setFileName] = useState('customer-ledger')
  const [format, setFormat] = useState('PDF')

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Download Ledger</h2>
        <button type="button" onClick={onClose}>
          <X className="h-5 w-5 text-muted" />
        </button>
      </div>
      <div className="space-y-4 px-6 py-4">
        <div>
          <label className="mb-1 block text-sm font-medium">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="Excel">Excel</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </Modal>
  )
}
