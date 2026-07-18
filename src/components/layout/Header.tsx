import { useLocation, Link } from 'react-router-dom'
import { Bell, Search, Home } from 'lucide-react'
import { currentUser } from '../../data/mockBookings'

interface Crumb {
  label: string
  path?: string
}

const routeCrumbs: Record<string, Crumb[]> = {
  '/finance/bookings': [
    { label: 'Finance', path: '/finance/bookings' },
    { label: 'Bookings' },
  ],
  '/finance/bookings/calendar': [
    { label: 'Finance', path: '/finance/bookings' },
    { label: 'Bookings', path: '/finance/bookings' },
    { label: 'Booking Calendar' },
  ],
}

export function Header() {
  const location = useLocation()
  const crumbs = routeCrumbs[location.pathname] ?? routeCrumbs['/finance/bookings']

  return (
    <header className="flex h-[56px] shrink-0 items-center border-b border-border bg-white px-5">
      <div className="flex min-w-0 flex-1 items-center">
        <nav className="flex items-center gap-1.5 text-[13px]">
          <Link to="/finance/bookings" className="text-muted hover:text-text-secondary">
            <Home className="h-4 w-4" />
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              <span className="text-muted/60">/</span>
              {crumb.path && i < crumbs.length - 1 ? (
                <Link
                  to={crumb.path}
                  className="text-muted hover:text-text-secondary"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-primary">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="relative mx-4 w-full max-w-[480px]">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search or type command..."
          className="h-[38px] w-full rounded-full border border-border bg-white py-2 pl-10 pr-16 text-[13px] placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
        <kbd className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
          ⌘ K
        </kbd>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <button type="button" className="relative rounded-lg p-2 hover:bg-surface">
          <Bell className="h-[18px] w-[18px] text-text-secondary" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-[13px] font-medium leading-tight text-text">
              {currentUser.name}
            </p>
            <p className="text-[11px] leading-tight text-muted">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
