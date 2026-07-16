import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { BalanceCard } from '../components/BalanceCard'
import { TransactionTable } from '../components/TransactionTable'
import { PaymentDialog } from '../components/PaymentDialog'
import { useFiados } from '../hooks/useFiados'
import type { RegisterPaymentInput } from '../api/requests'

export function ClientBalancePage() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    selectedClient,
    balance,
    transactions,
    isLoading,
    isSubmitting,
    error,
    fetchBalance,
    registerPayment,
    clearError,
  } = useFiados()

  useEffect(() => {
    if (clientId) {
      fetchBalance(clientId)
    }
  }, [clientId, fetchBalance])

  const handlePayment = async (data: RegisterPaymentInput) => {
    await registerPayment(data)
  }

  if (error) {
    return (
      <div className="p-4 pb-10">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              clearError()
              if (clientId) fetchBalance(clientId)
            }}
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 pb-10">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 pb-10">
      <Button
        variant="ghost"
        className="mb-2"
        onClick={() => navigate('/fiados')}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <h1 className="text-xl font-semibold">
        {selectedClient?.name ?? 'Cliente'}
      </h1>

      {balance !== null && <BalanceCard balance={balance} />}

      {balance !== null && balance !== 0 && (
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)}>
            Registrar Pago
          </Button>
        </div>
      )}

      <TransactionTable transactions={transactions} />

      {clientId && balance !== null && (
        <PaymentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          clientId={clientId}
          maxAmount={balance}
          isSubmitting={isSubmitting}
          onSubmit={handlePayment}
        />
      )}
    </div>
  )
}
