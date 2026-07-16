import type { ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/shared/components/Toaster'
import { router } from './router'

interface ProvidersProps {
  children?: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      {children}
    </>
  )
}
