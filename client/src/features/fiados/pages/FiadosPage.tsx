import { useEffect, useMemo } from 'react'
import { ClientTable } from '../components/ClientTable'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { useFiados } from '../hooks/useFiados'

function formatCOP(value: number): string {
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toLocaleString('de-DE')}`
}

export function FiadosPage() {
  const { clients, isLoading, error, fetchClients, clearError } = useFiados()

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const { totalDebt, clientsWithDebt } = useMemo(() => {
    const withDebt = clients.filter((c) => c.balance > 0)
    return {
      totalDebt: withDebt.reduce((sum, c) => sum + c.balance, 0),
      clientsWithDebt: withDebt.length,
    }
  }, [clients])

  if (error) {
    return (
      <div className="p-4 pb-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              clearError()
              fetchClients()
            }}
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 pb-10">
      <h1 className="text-xl font-semibold shrink-0">Fiados</h1>

      <div className="mt-4 grid grid-cols-2 gap-3 shrink-0 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Deuda total</p>
          <p className="mt-1 text-lg font-bold text-destructive">
            {formatCOP(totalDebt)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Clientes con deuda</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {clientsWithDebt}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Total clientes</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {clients.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Al día</p>
          <p className="mt-1 text-lg font-bold text-emerald-400">
            {clients.length - clientsWithDebt}
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1 min-h-0 overflow-auto">
        <ClientTable clients={clients} isLoading={isLoading} />
      </div>
    </div>
  )
}
