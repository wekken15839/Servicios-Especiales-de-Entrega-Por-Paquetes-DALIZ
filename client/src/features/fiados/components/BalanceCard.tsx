import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface BalanceCardProps {
  balance: number
}

function formatCOP(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  const parts = abs.toLocaleString('de-DE')
  return `${sign}$${parts}`
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const isPositive = balance > 0
  const isZero = balance === 0

  const colorClass = isZero
    ? 'text-muted-foreground'
    : isPositive
      ? 'text-destructive'
      : 'text-emerald-400'

  const label = isZero
    ? 'Sin deuda'
    : isPositive
      ? 'Deuda'
      : 'Saldo a favor'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Balance actual</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${colorClass}`}>
          {formatCOP(balance)}
        </p>
        <p className={`mt-1 text-sm ${colorClass}`}>{label}</p>
      </CardContent>
    </Card>
  )
}
