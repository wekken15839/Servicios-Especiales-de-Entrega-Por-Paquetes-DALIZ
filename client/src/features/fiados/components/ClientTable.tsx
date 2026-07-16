import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/shared/components/ui/table'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Badge } from '@/shared/components/ui/badge'
import { PackageOpen, Phone, MapPin, ChevronRight } from 'lucide-react'
import type { ClientSummary } from '../types'

interface ClientTableProps {
  clients: ClientSummary[]
  isLoading: boolean
}

function formatCOP(value: number): string {
  const sign = value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toLocaleString('de-DE')}`
}

export function ClientTable({ clients, isLoading }: ClientTableProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <>
        <div className="hidden space-y-2 sm:block">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="space-y-3 sm:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </>
    )
  }

  if (clients.length === 0) {
    return (
      <Alert>
        <PackageOpen className="h-4 w-4" />
        <AlertDescription>No hay clientes registrados</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      {/* Desktop: Table */}
      <div className="hidden rounded-lg border border-border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Debe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer"
                onClick={() => navigate(`/fiados/${client.id}`)}
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone ?? '—'}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  {client.balance > 0 ? (
                    <Badge variant="destructive">Sí</Badge>
                  ) : (
                    <Badge variant="success">No</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: Cards */}
      <div className="space-y-3 sm:hidden">
        {clients.map((client) => (
          <button
            key={client.id}
            type="button"
            onClick={() => navigate(`/fiados/${client.id}`)}
            className="group flex w-full items-start justify-between rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex flex-col gap-1.5 min-w-0">
              <span className="font-medium text-sm text-foreground truncate">
                {client.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                {client.phone ?? '—'}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{client.address}</span>
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <div className="text-right">
                {client.balance > 0 ? (
                  <Badge variant="destructive" className="text-xs">
                    {formatCOP(client.balance)}
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-xs">Sin deuda</Badge>
                )}
              </div>
              <div className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
