import { createBrowserRouter } from 'react-router-dom'
import { LoginPage, RegisterPage } from '@/features/auth'
import { MapPage, RouteDetailPage } from '@/features/map'
import { MetricsPage } from '@/features/metrics'
import { FiadosPage, ClientBalancePage } from '@/features/fiados'
import { RouteHistoryPage } from '@/features/history'
import { SettingsPage } from '@/features/settings'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { AdminGuard } from '@/shared/components/AdminGuard'
import { PublicRoute } from '@/shared/components/PublicRoute'
import { Layout } from '@/shared/components/Layout'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <MapPage />,
          },
          {
            path: 'mapa',
            element: <MapPage />,
          },
          {
            path: 'ruta/:routeId',
            element: <RouteDetailPage />,
          },
          {
            path: 'metricas',
            element: <MetricsPage />,
          },
          {
            path: 'fiados',
            element: <FiadosPage />,
          },
          {
            path: 'fiados/:clientId',
            element: <ClientBalancePage />,
          },
          {
            path: 'configuracion',
            element: <SettingsPage />,
          },
          {
            path: 'historial',
            element: <RouteHistoryPage />,
          },
        ],
      },
      {
        element: <AdminGuard />,
        children: [
          {
            path: 'usuarios',
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
