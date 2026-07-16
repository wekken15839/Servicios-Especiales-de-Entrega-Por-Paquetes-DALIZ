import { create } from 'zustand'

export type SettingsState = {
  autoCenterOnMobile: boolean
  showCenterButton: boolean
  showRoutesToggle: boolean
  showMarkersToggle: boolean
  showZoomControls: boolean
  quickDeliveryPopup: boolean
}

type SettingsActions = {
  setAutoCenterOnMobile: (value: boolean) => void
  setShowCenterButton: (value: boolean) => void
  setShowRoutesToggle: (value: boolean) => void
  setShowMarkersToggle: (value: boolean) => void
  setShowZoomControls: (value: boolean) => void
  setQuickDeliveryPopup: (value: boolean) => void
}

type SettingsStore = SettingsState & SettingsActions

const STORAGE_KEY = 'daliz-settings'

function loadSettings(): SettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // corrupted data, fall through to defaults
  }
  return {
    autoCenterOnMobile: true,
    showCenterButton: true,
    showRoutesToggle: true,
    showMarkersToggle: true,
    showZoomControls: true,
    quickDeliveryPopup: false,
  }
}

function persist(state: SettingsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const defaults = loadSettings()

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaults,

  setAutoCenterOnMobile: (value) =>
    set((s) => {
      const next = { ...s, autoCenterOnMobile: value }
      persist(next)
      return { autoCenterOnMobile: value }
    }),

  setShowCenterButton: (value) =>
    set((s) => {
      const next = { ...s, showCenterButton: value }
      persist(next)
      return { showCenterButton: value }
    }),

  setShowRoutesToggle: (value) =>
    set((s) => {
      const next = { ...s, showRoutesToggle: value }
      persist(next)
      return { showRoutesToggle: value }
    }),

  setShowMarkersToggle: (value) =>
    set((s) => {
      const next = { ...s, showMarkersToggle: value }
      persist(next)
      return { showMarkersToggle: value }
    }),

  setShowZoomControls: (value) =>
    set((s) => {
      const next = { ...s, showZoomControls: value }
      persist(next)
      return { showZoomControls: value }
    }),

  setQuickDeliveryPopup: (value) =>
    set((s) => {
      const next = { ...s, quickDeliveryPopup: value }
      persist(next)
      return { quickDeliveryPopup: value }
    }),
}))
