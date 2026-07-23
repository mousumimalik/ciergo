import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Image,
  Hexagon,
  Briefcase,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  BookUser,
  FileClock,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeft,
} from 'lucide-react'
import { cn } from '../../utils/cn'

interface NavChild {
  label: string
  path: string
}

interface NavItem {
  label: string
  icon: React.ElementType
  path?: string
  children?: NavChild[]
}

/** Routes that exist in the app router — everything else is display-only. */
const ENABLED_PATHS = new Set(['/finance/bookings', '/finance/bookings/calendar'])

const DEFAULT_EXPANDED = ['Sales', 'Approvals', 'Finance', 'Directory']

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  {
    label: 'Sales',
    icon: Image,
    children: [
      { label: 'Leads', path: '/sales/leads' },
      { label: 'Quotations', path: '/sales/quotations' },
    ],
  },
  { label: 'Operations', icon: Hexagon, path: '/operations' },
  { label: 'Bookings', icon: Briefcase, path: '/bookings' },
  {
    label: 'Approvals',
    icon: ClipboardCheck,
    children: [
      { label: 'Bookings', path: '/approvals/bookings' },
      { label: 'Payments', path: '/approvals/payments' },
    ],
  },
  { label: 'Content', icon: ClipboardList, path: '/content' },
  {
    label: 'Finance',
    icon: CreditCard,
    children: [
      { label: 'Bookings', path: '/finance/bookings' },
      { label: 'Customers', path: '/finance/customers' },
      { label: 'Vendors', path: '/finance/vendors' },
      { label: 'Payments', path: '/finance/payments' },
      { label: 'Journals', path: '/finance/journals' },
      { label: 'Expense+', path: '/finance/expense' },
    ],
  },
  {
    label: 'Directory',
    icon: BookUser,
    children: [
      { label: 'Customers', path: '/directory/customers' },
      { label: 'Vendors', path: '/directory/vendors' },
      { label: 'Team', path: '/directory/team' },
    ],
  },
  { label: 'Reports', icon: FileClock, path: '/reports' },
]

function isEnabledPath(path: string) {
  return ENABLED_PATHS.has(path)
}

const disabledItemClass =
  'cursor-not-allowed select-none text-muted/60 opacity-70'

interface SidebarProps {
  collapsed?: boolean
  onToggle: () => void
}

export function Sidebar({ onToggle }: SidebarProps) {
  const location = useLocation()
  const [expanded, setExpanded] = useState<string[]>(() => {
    const initial = [...DEFAULT_EXPANDED]
    if (location.pathname.startsWith('/finance') && !initial.includes('Finance')) {
      initial.push('Finance')
    }
    return initial
  })

  function toggleExpand(label: string) {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )
  }

  function isChildActive(item: NavItem) {
    return (
      item.children?.some(
        (c) =>
          isEnabledPath(c.path) &&
          (location.pathname === c.path || location.pathname.startsWith(`${c.path}/`)),
      ) ?? false
    )
  }

  function renderDisabledLeaf(label: string, key: string, className?: string) {
    return (
      <span
        key={key}
        aria-disabled="true"
        className={cn('block rounded-md py-1.5 text-[13px]', disabledItemClass, className)}
      >
        {label}
      </span>
    )
  }

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-border bg-white">
      <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
        <span className="text-[22px] font-bold tracking-tight text-primary">ciergo</span>
        <button
          type="button"
          onClick={onToggle}
          className="cursor-pointer rounded-md p-1 text-muted hover:bg-surface"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {navItems.map((item) => {
          const hasChildren = !!item.children
          const isExpanded = expanded.includes(item.label)

          if (hasChildren) {
            return (
              <div
                key={item.label}
                className={cn('rounded-xl', isExpanded && 'bg-sidebar-group p-2')}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors',
                    isChildActive(item) ? 'text-[#374151]' : 'text-muted hover:text-text',
                  )}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                  )}
                </button>

                {isExpanded && (
                  <div className="relative mt-1 ml-[21px] border-l border-[#E0E0E0] pl-3">
                    <div className="space-y-0.5 py-0.5">
                      {item.children!.map((child) => {
                        if (isEnabledPath(child.path)) {
                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end={child.path === '/finance/bookings'}
                              className={({ isActive }) =>
                                cn(
                                  'block cursor-pointer rounded-md py-1.5 text-[13px] transition-colors',
                                  isActive
                                    ? 'font-semibold text-primary'
                                    : 'text-muted hover:text-text',
                                )
                              }
                            >
                              {child.label}
                            </NavLink>
                          )
                        }

                        return renderDisabledLeaf(child.label, child.path)
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          }

          if (item.path && isEnabledPath(item.path)) {
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end
                className={({ isActive }) =>
                  cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors',
                    isActive ? 'font-semibold text-primary' : 'text-muted hover:text-text',
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            )
          }

          return (
            <span
              key={item.label}
              aria-disabled="true"
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium',
                disabledItemClass,
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
              <span className="flex-1">{item.label}</span>
            </span>
          )
        })}
      </nav>

      <div className="border-t border-border-light px-3 py-3">
        <span
          aria-disabled="true"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium',
            disabledItemClass,
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
          <span className="flex-1">Settings</span>
          <ChevronRight className="h-4 w-4 text-muted/70" />
        </span>
      </div>
    </aside>
  )
}
