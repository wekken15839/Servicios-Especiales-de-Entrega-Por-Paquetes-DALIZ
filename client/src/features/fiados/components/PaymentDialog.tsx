import { useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { cn } from '@/shared/lib/utils'

type PaymentFormData = {
  clientId: string
  amount: number
  description?: string
}

function formatCOP(value: number): string {
  return `$${value.toLocaleString('de-DE')}`
}

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  maxAmount: number
  isSubmitting: boolean
  onSubmit: (data: PaymentFormData) => Promise<void>
}

export function PaymentDialog({
  open,
  onOpenChange,
  clientId,
  maxAmount,
  isSubmitting,
  onSubmit,
}: PaymentDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  const schema = useMemo(
    () =>
      z.object({
        clientId: z.string(),
        amount: z
          .number()
          .positive('Monto requerido')
          .max(maxAmount, `Máximo ${formatCOP(maxAmount)}`),
        description: z.string().optional(),
      }),
    [maxAmount],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId,
      amount: undefined,
      description: '',
    },
  })

  // Focus cancel button and reset form on open
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', handler)
    setTimeout(() => cancelRef.current?.focus(), 0)
    reset({ clientId, amount: undefined, description: '' })
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange, reset, clientId])

  const onFormSubmit = async (data: PaymentFormData) => {
    try {
      await onSubmit(data)
      onOpenChange(false)
      reset()
    } catch {
      // Error stays in form, form stays open preserving values
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'relative w-full max-w-md rounded-xl bg-background p-6 shadow-xl text-foreground',
              'border border-border',
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
          >
            <h2
              id="payment-title"
              className="text-lg font-semibold text-foreground"
            >
              Registrar Pago
            </h2>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="mt-4 space-y-4"
            >
              <input type="hidden" {...register('clientId')} />

              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  step="100"
                  min="0"
                  max={maxAmount}
                  placeholder="0"
                  disabled={isSubmitting}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  {...register('amount', {
                    valueAsNumber: true,
                    onChange: (e) => {
                      const v = e.target.value || ''
                      const n = parseInt(v, 10)
                      if (v && n > maxAmount) {
                        e.target.value = String(maxAmount)
                      }
                    },
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Máximo {formatCOP(maxAmount)}
                </p>
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Ej: Pago en efectivo"
                  disabled={isSubmitting}
                  {...register('description')}
                />
              </div>

              {errors.root && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  ref={cancelRef}
                  type="button"
                  className="bg-sky-400 text-white hover:bg-sky-500"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
