import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Package, Settings } from 'lucide-react'
import { useSidebar } from '@/shared/hooks/useSidebar'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Z } from '@/shared/constants/zIndex'
import { NAV_ITEMS } from './NavItems'
import { SidebarOverlay } from './SidebarOverlay'

const SIDEBAR_EXPANDED = 240
const SIDEBAR_COLLAPSED = 64

export function Sidebar() {
  const isOpen = useSidebar((s) => s.isOpen)
  const isCollapsed = useSidebar((s) => s.isCollapsed)
  const close = useSidebar((s) => s.close)
  const expand = useSidebar((s) => s.expand)
  const collapse = useSidebar((s) => s.collapse)
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const handleNav = () => {
    if (!isDesktop) close()
  }

  const sidebarContent = (
    <motion.aside
      onMouseEnter={() => { if (isDesktop) expand() }}
      onMouseLeave={() => { if (isDesktop) collapse() }}
      animate={{
        width: isDesktop ? (isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED) : SIDEBAR_EXPANDED,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex h-full flex-col border-r border-border bg-background overflow-hidden shrink-0"
      style={{ zIndex: Z.sidebar }}
    >
      <div className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
          <Package className="h-5 w-5" />
        </div>
        <AnimatePresence mode="wait">
          {(!isDesktop || !isCollapsed) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-base text-foreground whitespace-nowrap overflow-hidden"
            >
              DaLiz
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to
            const Icon = item.icon

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={handleNav}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-6 w-6 shrink-0" />
                  {(!isDesktop || !isCollapsed) && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-2">
        <div className="flex items-center justify-between rounded-md px-3 py-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              D
            </div>
            {(!isDesktop || !isCollapsed) && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">DaLiz</p>
                <p className="truncate text-xs text-muted-foreground">v1.0</p>
              </div>
            )}
          </div>
          <NavLink
            to="/configuracion"
            onClick={handleNav}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
              location.pathname === '/configuracion'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Configuración"
          >
            <Settings className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </motion.aside>
  )

  if (isDesktop) {
    return sidebarContent
  }

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClose={close} />
      <div
        className={`fixed inset-y-0 left-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: Z.sidebar }}
      >
        {sidebarContent}
      </div>
    </>
  )
}
