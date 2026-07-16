import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from './button'
import { cn } from '@/shared/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  confirmVariant?: 'default' | 'destructive' | 'outline'
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  confirmVariant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', handler)
    cancelRef.current?.focus()
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

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
              "relative w-full max-w-sm rounded-xl bg-background p-6 shadow-xl",
              "border border-border"
            )}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
          >
            <h2
              id="confirm-title"
              className="text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
            <p
              id="confirm-desc"
              className="mt-2 text-sm text-muted-foreground"
            >
              {description}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                ref={cancelRef}
                className="bg-sky-400 text-white hover:bg-sky-500"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                variant={confirmVariant}
                onClick={() => {
                  onConfirm()
                  onOpenChange(false)
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
