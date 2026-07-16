import { create } from 'zustand'
import { toast } from 'sonner'
import { clientsService } from '../api/clients.service'
import { fiadosService } from '../api/fiados.service'
import type { FiadosState, FiadosActions, ClientSummary } from '../types'

type FiadosStore = FiadosState & FiadosActions

export const useFiadosStore = create<FiadosStore>((set) => ({
  clients: [],
  selectedClient: null,
  balance: null,
  transactions: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null })

    const result = await clientsService.getAll()

    if (result.error) {
      set({ error: result.error, isLoading: false })
      toast.error(result.error)
      return
    }

    set({ clients: result.data ?? [], isLoading: false })
  },

  fetchBalance: async (clientId: string) => {
    set({ isLoading: true, error: null })

    const result = await fiadosService.getBalance(clientId)

    if (result.error) {
      set({ error: result.error, isLoading: false })
      toast.error(result.error)
      return
    }

    const client = useFiadosStore.getState().clients.find(
      (c: ClientSummary) => c.id === clientId,
    ) ?? null

    set({
      selectedClient: client,
      balance: result.data?.balance ?? 0,
      transactions: result.data?.transactions ?? [],
      isLoading: false,
    })
  },

  registerPayment: async (input) => {
    set({ isSubmitting: true, error: null })

    const result = await fiadosService.registerPayment(input)

    if (result.error) {
      set({ isSubmitting: false })
      toast.error(result.error)
      throw result.error
    }

    if (result.data) {
      toast.success('Pago registrado exitosamente')

      // Refresh balance after successful payment
      const balanceResult = await fiadosService.getBalance(input.clientId)

      if (balanceResult.data) {
        set({
          balance: balanceResult.data.balance,
          transactions: balanceResult.data.transactions,
          isSubmitting: false,
        })
      } else {
        set({ isSubmitting: false })
      }
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
