import { AnimatePresence, motion } from 'motion/react'
import { Z } from '@/shared/constants/zIndex'

type SidebarOverlayProps = {
  isOpen: boolean
  onClose: () => void
}

export function SidebarOverlay({ isOpen, onClose }: SidebarOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 lg:hidden"
          style={{ zIndex: Z.sidebar }}
        />
      )}
    </AnimatePresence>
  )
}
