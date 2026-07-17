import { Map, BarChart3, ReceiptText, History, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Mapa', icon: Map },
  { to: '/historial', label: 'Historial', icon: History },
  { to: '/metricas', label: 'Métricas', icon: BarChart3 },
  { to: '/fiados', label: 'Fiados', icon: ReceiptText },
  { to: '/usuarios', label: 'Usuarios', icon: Users, adminOnly: true },
] as const
