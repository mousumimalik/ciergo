import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  label?: string
}

const PAGE_SIZES = [6, 10, 20, 50, 100]

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  label = 'Bookings',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-2.5">
      <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
        <span>Rows per page:</span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value))
              onPageChange(1)
            }}
            className="appearance-none rounded-md border border-[#E5E7EB] bg-white py-1 pl-2 pr-7 text-[12px] text-[#374151] focus:border-primary focus:outline-none"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#9CA3AF]" />
        </div>
      </div>

      <p className="text-[12px] text-[#6B7280]">
        Showing {start}-{end} of {total} {label}
      </p>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded p-1 text-[#9CA3AF] hover:bg-[#F3F4F6] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-[12px] text-[#6B7280]">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md text-[12px]',
                page === p
                  ? 'bg-[#F3F4F6] font-medium text-[#374151]'
                  : 'text-[#6B7280] hover:bg-[#F3F4F6]',
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded p-1 text-[#9CA3AF] hover:bg-[#F3F4F6] disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, '...', total]
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}
