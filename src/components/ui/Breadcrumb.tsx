import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { cn } from '../../utils/cn'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1.5 text-sm', className)}>
      <Link to="/finance/bookings" className="text-muted hover:text-gray-700">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className="text-muted">/</span>
          {item.path && i < items.length - 1 ? (
            <Link to={item.path} className="text-muted hover:text-gray-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-primary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
