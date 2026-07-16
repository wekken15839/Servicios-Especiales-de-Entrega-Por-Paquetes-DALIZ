import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { ReceiptText, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { CreditTransaction } from '@daliz/shared'

interface TransactionTableProps {
  transactions: CreditTransaction[]
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatAmount(amount: number, type: 'credit' | 'payment'): string {
  const formatted = Math.abs(amount).toLocaleString('de-DE')
  const sign = type === 'credit' ? '+' : '-'
  return `${sign}$${formatted}`
}

function formatCOP(value: number): string {
  return `$${value.toLocaleString('de-DE')}`
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <Alert>
        <ReceiptText className="h-4 w-4" />
        <AlertDescription>Sin movimientos</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="hidden rounded-lg border border-border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <Badge variant={tx.type === 'credit' ? 'success' : 'default'}>
                    {tx.type === 'credit' ? 'Crédito' : 'Pago'}
                  </Badge>
                </TableCell>
                <TableCell
                  className={
                    tx.type === 'credit' ? 'text-destructive' : 'text-emerald-400'
                  }
                >
                  {formatAmount(tx.amount, tx.type)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(tx.createdAt)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {tx.description ?? '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: Cards */}
      <div className="space-y-2 sm:hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                tx.type === 'credit'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-emerald-400/10 text-emerald-400'
              }`}
            >
              {tx.type === 'credit' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownLeft className="h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={tx.type === 'credit' ? 'success' : 'default'}
                  className="text-[11px]"
                >
                  {tx.type === 'credit' ? 'Crédito' : 'Pago'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(tx.createdAt)}
                </span>
              </div>
              {tx.description && (
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {tx.description}
                </p>
              )}
            </div>
            <span
              className={`text-sm font-semibold shrink-0 ${
                tx.type === 'credit' ? 'text-destructive' : 'text-emerald-400'
              }`}
            >
              {formatCOP(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
