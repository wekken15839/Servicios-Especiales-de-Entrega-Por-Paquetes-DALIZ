import { useFiadosStore } from '../store/fiadosStore'

export function useFiados() {
  const clients = useFiadosStore((state) => state.clients)
  const selectedClient = useFiadosStore((state) => state.selectedClient)
  const balance = useFiadosStore((state) => state.balance)
  const transactions = useFiadosStore((state) => state.transactions)
  const isLoading = useFiadosStore((state) => state.isLoading)
  const isSubmitting = useFiadosStore((state) => state.isSubmitting)
  const error = useFiadosStore((state) => state.error)
  const fetchClients = useFiadosStore((state) => state.fetchClients)
  const fetchBalance = useFiadosStore((state) => state.fetchBalance)
  const registerPayment = useFiadosStore((state) => state.registerPayment)
  const clearError = useFiadosStore((state) => state.clearError)

  return {
    clients,
    selectedClient,
    balance,
    transactions,
    isLoading,
    isSubmitting,
    error,
    fetchClients,
    fetchBalance,
    registerPayment,
    clearError,
  }
}
