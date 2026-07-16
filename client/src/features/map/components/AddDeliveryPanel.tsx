import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { motion } from 'motion/react'
import { MapPin, User, Phone, FileText, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Sheet } from '@/shared/components/Sheet'
import { useMapStore } from '../store/mapStore'
import { cn } from '@/shared/lib/utils'

const createDeliverySchema = z.object({
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio'),
  clientPhone: z.string().optional(),
  address: z.string().min(1, 'La dirección es obligatoria'),
  notes: z.string().optional(),
})

type CreateDeliveryFormData = z.infer<typeof createDeliverySchema>

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.25, ease: 'easeOut' as const },
  }),
}

export function AddDeliveryPanel() {
  const pendingLocation = useMapStore((s) => s.pendingLocation)
  const clearPendingLocation = useMapStore((s) => s.clearPendingLocation)
  const addDelivery = useMapStore((s) => s.addDelivery)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDeliveryFormData>({
    resolver: zodResolver(createDeliverySchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      address: '',
      notes: '',
    },
  })

  const isOpen = pendingLocation.lat !== null && pendingLocation.lng !== null

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  const onSubmit = async (data: CreateDeliveryFormData) => {
    if (pendingLocation.lat === null || pendingLocation.lng === null) return

    const error = await addDelivery({
      title: data.clientName,
      ...data,
      lat: pendingLocation.lat,
      lng: pendingLocation.lng,
    })

    if (error) return
  }

  const handleCancel = () => {
    clearPendingLocation()
  }

  return (
    <Sheet
      open={isOpen}
      onClose={handleCancel}
      title="Nuevo pedido"
      titleIcon={<MapPin className="h-5 w-5 text-cyan-400" />}
      position="right"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="flex-1 space-y-4 p-5">

        <motion.div custom={0} initial="hidden" animate="visible" variants={itemVariants}>
          <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 p-4">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-teal-400" />
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ubicación seleccionada
                </p>
                <p className="mt-0.5 font-mono text-sm text-foreground">
                  {pendingLocation.lat?.toFixed(6)}, {pendingLocation.lng?.toFixed(6)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${pendingLocation.lat},${pendingLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={itemVariants} className="space-y-2">
          <Label htmlFor="clientName" className="text-cyan-400">Nombre del cliente</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400 pointer-events-none" />
            <Input
              id="clientName"
              className={cn('pl-9 text-cyan-50 placeholder:text-cyan-400/30', errors.clientName && 'border-destructive ring-1 ring-destructive')}
              placeholder="Ej. Juan Pérez"
              {...register('clientName')}
            />
          </div>
          {errors.clientName && (
            <p className="text-sm text-destructive">{errors.clientName.message}</p>
          )}
        </motion.div>

        <motion.div custom={2} initial="hidden" animate="visible" variants={itemVariants} className="space-y-2">
          <Label htmlFor="clientPhone" className="text-cyan-400">
            Teléfono <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400 pointer-events-none" />
            <Input
              id="clientPhone"
              className={cn('pl-9 text-cyan-50 placeholder:text-cyan-400/30', errors.clientPhone && 'border-destructive ring-1 ring-destructive')}
              placeholder="Ej. 3001234567"
              {...register('clientPhone')}
            />
          </div>
          {errors.clientPhone && (
            <p className="text-sm text-destructive">{errors.clientPhone.message}</p>
          )}
        </motion.div>

        <motion.div custom={3} initial="hidden" animate="visible" variants={itemVariants} className="space-y-2">
          <Label htmlFor="address" className="text-cyan-400">Dirección</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400 pointer-events-none" />
            <Input
              id="address"
              className={cn('pl-9 text-cyan-50 placeholder:text-cyan-400/30', errors.address && 'border-destructive ring-1 ring-destructive')}
              placeholder="Ej. Cra 5 #10-20"
              {...register('address')}
            />
          </div>
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </motion.div>

        <motion.div custom={4} initial="hidden" animate="visible" variants={itemVariants} className="space-y-2">
          <Label htmlFor="notes" className="text-cyan-400">
            Notas <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-cyan-400 pointer-events-none" />
            <Textarea
              id="notes"
              className={cn('pl-9 text-cyan-50 placeholder:text-cyan-400/30', errors.notes && 'border-destructive ring-1 ring-destructive')}
              placeholder="Ej. Dejar en la portería"
              {...register('notes')}
            />
          </div>
          {errors.notes && (
            <p className="text-sm text-destructive">{errors.notes.message}</p>
          )}
        </motion.div>

        </div>

        <div className="sticky bottom-0 shrink-0 border-t border-border bg-background p-5">
        <motion.div custom={5} initial="hidden" animate="visible" variants={itemVariants} className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-400 to-teal-400 text-white shadow-md hover:from-cyan-500 hover:to-teal-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar pedido'
            )}
          </Button>
        </motion.div>
        </div>
      </form>
    </Sheet>
  )
}
