import { create } from 'zustand'

type SidebarState = {
  isOpen: boolean
  isCollapsed: boolean
  toggle: () => void
  open: () => void
  close: () => void
  toggleCollapse: () => void
  expand: () => void
  collapse: () => void
}

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: false,
  isCollapsed: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  expand: () => set({ isCollapsed: false }),
  collapse: () => set({ isCollapsed: true }),
}))
