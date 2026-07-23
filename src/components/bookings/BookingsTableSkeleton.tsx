import { cn } from '../../utils/cn'

const SKELETON_ROWS = 6

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#E5E7EB]', className)}
      aria-hidden
    />
  )
}

export function BookingsTableSkeleton({ embedded = true }: { embedded?: boolean }) {
  return (
    <div className={cn(!embedded && 'overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm')}>
      <div className={cn('overflow-x-auto', embedded && 'border-t border-[#E5E7EB]')}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F2F2F2]">
              {[
                'Booking ID',
                'Lead Pax',
                'Travel Date',
                'Service',
                'Status',
                'Amount',
                'Owner',
                'Voucher',
                'Tasks',
                'Actions',
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 py-2.5 text-left text-[12px] font-normal text-[#6B7280]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <tr
                key={i}
                className={cn(
                  'border-b border-[#F3F4F6]',
                  i % 2 === 1 ? 'bg-[#F8F8F8]' : 'bg-white',
                )}
              >
                <td className="px-4 py-3">
                  <SkeletonBar className="h-4 w-20" />
                </td>
                <td className="px-4 py-3">
                  <SkeletonBar className="h-4 w-28" />
                </td>
                <td className="px-4 py-3">
                  <SkeletonBar className="h-4 w-16" />
                </td>
                <td className="px-4 py-3">
                  <div className="mx-auto flex w-12 flex-col items-center gap-1">
                    <SkeletonBar className="h-4 w-4 rounded-full" />
                    <SkeletonBar className="h-3 w-10" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <SkeletonBar className="h-5 w-16 rounded-full" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <SkeletonBar className="h-4 w-14" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <SkeletonBar className="h-6 w-6 rounded-full" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <SkeletonBar className="h-[30px] w-[62px]" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <SkeletonBar className="h-[30px] w-[30px]" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    <SkeletonBar className="h-[30px] w-14" />
                    <SkeletonBar className="h-[30px] w-14" />
                    <SkeletonBar className="h-[30px] w-[30px]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-2.5">
        <SkeletonBar className="h-4 w-32" />
        <SkeletonBar className="h-8 w-48" />
      </div>
    </div>
  )
}
