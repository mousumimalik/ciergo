import {
  Plane,
  Bed,
  Bus,
  MapPin,
  Building,
} from 'lucide-react'
import type { ServiceType } from '../../types/booking'
import { cn } from '../../utils/cn'

const serviceIcons: Record<ServiceType, React.ElementType> = {
  Flight: Plane,
  Accommodation: Bed,
  Transportation: Bus,
  'Explore UAE': MapPin,
  Hotel: Building,
}

interface ServiceCellProps {
  service: ServiceType
  destination?: string
  className?: string
}

export function ServiceCell({ service, destination, className }: ServiceCellProps) {
  const Icon = serviceIcons[service] ?? MapPin
  const isExplore = service === 'Explore UAE'

  return (
    <div className={cn('flex flex-col items-center gap-0.5 py-0.5', className)}>
      {destination && (
        <span className="text-[9px] font-semibold uppercase tracking-wide text-primary">
          {destination}
        </span>
      )}
      <Icon className="h-[18px] w-[18px] stroke-[1.5] text-primary" />
      {!isExplore && (
        <span className="text-[11px] leading-tight text-[#374151]">{service}</span>
      )}
      {isExplore && (
        <span className="mt-0.5 rounded-full bg-[#F3EBF9] px-2 py-0.5 text-[10px] font-medium text-primary">
          Explore UAE
        </span>
      )}
    </div>
  )
}

interface OwnerAvatarsProps {
  owners: { initials: string; color: string; name: string }[]
  max?: number
}

const AVATAR_COLORS = ['#FF284B', '#A548D9', '#4E4CD0', '#006FFF']

export function OwnerAvatars({ owners, max = 4 }: OwnerAvatarsProps) {
  const visible = owners.slice(0, max)

  return (
    <div className="flex justify-center">
      {visible.map((owner, i) => {
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
        return (
          <div
            key={`${owner.initials}-${i}`}
            className={cn('group relative', i === 1 ? 'ml-1' : i > 1 ? '-ml-2' : '')}
            style={{ zIndex: max - i }}
          >
            <div
              className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full border-[1.5px] bg-white text-[9px] font-bold"
              style={{ borderColor: color, color }}
            >
              {owner.initials}
            </div>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#2D2D2D] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {owner.name}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#2D2D2D]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
