import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {!collapsed && (
        <Sidebar collapsed={false} onToggle={() => setCollapsed(true)} />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
        <main className="flex-1 overflow-auto bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
