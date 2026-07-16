import { useEffect } from 'react'
import { toast } from 'sonner'
import { useMapStore } from '../store/mapStore'

export function useMapData() {
  const fetchMapData = useMapStore((s) => s.fetchMapData)
  const isLoading = useMapStore((s) => s.isLoading)
  const error = useMapStore((s) => s.error)
  const deliveries = useMapStore((s) => s.deliveries)

  useEffect(() => {
    fetchMapData()
  }, [fetchMapData])

  useEffect(() => {
    if (error) {
      toast.error(error, { id: 'map-error', duration: 5000 })
    }
  }, [error])

  return {
    isLoading,
    error,
    isEmpty: !isLoading && !error && deliveries.length === 0,
  }
}
