import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Z } from '@/shared/constants/zIndex'

type SheetProps = {
  open: boolean
  onClose: () => void
  title?: string
  titleIcon?: ReactNode
  children: ReactNode
  position?: 'bottom' | 'right'
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function Sheet({ open, onClose, title, titleIcon, children, position = 'bottom' }: SheetProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const effectivePosition = isDesktop ? position : 'bottom'

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40"
            style={{ zIndex: Z.sheet }}
          />

          <motion.div
            initial={
              effectivePosition === 'bottom'
                ? { y: '100%' }
                : { x: '100%' }
            }
            animate={
              effectivePosition === 'bottom'
                ? { y: 0 }
                : { x: 0 }
            }
            exit={
              effectivePosition === 'bottom'
                ? { y: '100%' }
                : { x: '100%' }
            }
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            style={{ zIndex: Z.sheet }}
            className={`fixed bg-background shadow-xl flex flex-col ${
              effectivePosition === 'bottom'
                ? 'inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl'
                : 'inset-y-0 right-0 w-full max-w-md'
            }`}
          >
            {effectivePosition === 'bottom' && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-border" />
              </div>
            )}

            {title && (
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5 shrink-0">
                <h2 className="flex items-center gap-2 text-base font-semibold text-primary-foreground">
                  {titleIcon}
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
