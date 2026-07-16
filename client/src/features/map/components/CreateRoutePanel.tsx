import { useState, useEffect } from 'react'
import { Route } from 'lucide-react'
import { useMapStore } from '../store/mapStore'
import { Sheet } from '@/shared/components/Sheet'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'

export function CreateRoutePanel() {
  const isCreatingRoute = useMapStore((s) => s.isCreatingRoute)
  const setCreatingRoute = useMapStore((s) => s.setCreatingRoute)
  const deliveries = useMapStore((s) => s.deliveries)
  const createRoute = useMapStore((s) => s.createRoute)

  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [optimize, setOptimize] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isCreatingRoute) {
      setName('')
      setSelectedIds([])
      setOptimize(true)
    }
  }, [isCreatingRoute])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    setSelectedIds(deliveries.map((d) => d.id))
  }

  const handleSubmit = async () => {
    if (!name.trim() || selectedIds.length === 0) return
    setIsSubmitting(true)
    await createRoute({ name: name.trim(), deliveryIds: selectedIds, optimize })
    setIsSubmitting(false)
  }

  return (
    <Sheet open={isCreatingRoute} onClose={() => setCreatingRoute(false)} title="Nueva ruta" titleIcon={<Route className="h-5 w-5 text-cyan-400" />} position="right">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="flex min-h-full flex-col">
        <div className="flex-1 space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="routeName" className="text-cyan-400">Nombre de la ruta</Label>
            <Input
              id="routeName"
              className="text-cyan-50 placeholder:text-cyan-400/30"
              placeholder="Ej. Ruta Centro - Mañana"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={optimize}
                onCheckedChange={(checked) => setOptimize(checked === true)}
                id="optimize"
                className="border-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-white"
              />
              <span className="text-cyan-50">Optimizar orden híbrido</span>
            </label>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedIds.length} de {deliveries.length} seleccionados
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
              type="button"
            >
              Seleccionar todos
            </button>
          </div>

          <div className="space-y-1">
            {deliveries.map((d) => {
              const checked = selectedIds.includes(d.id)
              return (
                <label
                  key={d.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                    checked ? 'border-cyan-400 bg-cyan-400/10' : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => handleToggle(d.id)}
                    className="border-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-cyan-50">{d.clientName}</p>
                    <p className="text-xs text-cyan-400/60 truncate">{d.address}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        <div className="sticky bottom-0 shrink-0 border-t border-border bg-background p-5">
          <Button
            type="submit"
            className="w-full gap-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-white shadow-md hover:from-cyan-500 hover:to-teal-500"
            disabled={!name.trim() || selectedIds.length === 0 || isSubmitting}
          >
            <Route className="h-5 w-5" />
            {isSubmitting ? 'Creando...' : `Crear ruta (${selectedIds.length} deliveries)`}
          </Button>
        </div>
      </form>
    </Sheet>
  )
}
