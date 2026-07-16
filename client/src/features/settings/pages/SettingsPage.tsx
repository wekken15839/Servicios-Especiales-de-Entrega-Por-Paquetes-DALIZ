import { toast } from 'sonner'
import { MapPin, Route, LocateFixed, ZoomIn, Crosshair, Sun, Flag } from 'lucide-react'
import { useSettingsStore } from '../store/settingsStore'
import { Switch } from '@/shared/components/ui/switch'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

export function SettingsPage() {
  const settings = useSettingsStore()

  const handleLightMode = () => {
    toast('Próximamente', {
      description: 'El modo claro estará disponible pronto.',
    })
  }

  return (
    <div className="space-y-6 p-4 pb-10 max-w-lg">
      <h1 className="text-xl font-bold text-foreground">Configuración</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mapa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crosshair className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Centrar waypoint automáticamente en mobile</span>
            </div>
            <Switch
              checked={settings.autoCenterOnMobile}
              onCheckedChange={settings.setAutoCenterOnMobile}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LocateFixed className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Botón de centrar mapa</span>
            </div>
            <Switch
              checked={settings.showCenterButton}
              onCheckedChange={settings.setShowCenterButton}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Route className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Botón de mostrar rutas</span>
            </div>
            <Switch
              checked={settings.showRoutesToggle}
              onCheckedChange={settings.setShowRoutesToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Botón de mostrar marcadores</span>
            </div>
            <Switch
              checked={settings.showMarkersToggle}
              onCheckedChange={settings.setShowMarkersToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Controles de zoom</span>
            </div>
            <Switch
              checked={settings.showZoomControls}
              onCheckedChange={settings.setShowZoomControls}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Popup rápido de entrega</span>
            </div>
            <Switch
              checked={settings.quickDeliveryPopup}
              onCheckedChange={settings.setQuickDeliveryPopup}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apariencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Modo claro</span>
            </div>
            <Switch
              checked={false}
              onCheckedChange={handleLightMode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
