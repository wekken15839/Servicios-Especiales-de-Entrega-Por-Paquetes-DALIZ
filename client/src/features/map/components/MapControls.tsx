import { useCallback } from "react";
import { useMap } from "react-leaflet";
import { LocateFixed, Route, MapPin } from "lucide-react";
import { useMapStore } from "../store/mapStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { AGUACHICA_CENTER, DEFAULT_ZOOM } from "../constants";
import { Z } from "@/shared/constants/zIndex";

export function MapControls() {
  const map = useMap();
  const showRoutes = useMapStore((s) => s.showRoutes);
  const showMarkers = useMapStore((s) => s.showMarkers);
  const setShowRoutes = useMapStore((s) => s.setShowRoutes);
  const setShowMarkers = useMapStore((s) => s.setShowMarkers);
  const showCenterButton = useSettingsStore((s) => s.showCenterButton);
  const showRoutesToggle = useSettingsStore((s) => s.showRoutesToggle);
  const showMarkersToggle = useSettingsStore((s) => s.showMarkersToggle);

  if (!showCenterButton && !showRoutesToggle && !showMarkersToggle) return null;

  const handleCenter = useCallback(() => {
    map.flyTo(AGUACHICA_CENTER, DEFAULT_ZOOM, { duration: 1 });
  }, [map]);

  return (
    <div
      className="absolute bottom-6 left-4 flex flex-col gap-1.5"
      style={{ zIndex: Z.mapFloating }}
    >
      {showCenterButton && (
        <button
          onClick={handleCenter}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-background/90 text-muted-foreground shadow-md transition-colors hover:bg-background hover:text-foreground"
          title="Centrar mapa"
        >
          <LocateFixed className="h-5 w-5" />
        </button>
      )}

      {showRoutesToggle && (
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`flex h-9 w-9 items-center justify-center rounded-md shadow-md transition-colors hover:text-foreground ${
            showRoutes
              ? "bg-background/90 text-muted-foreground hover:bg-background"
              : "bg-muted/80 text-muted-foreground/50 hover:bg-muted"
          }`}
          title={showRoutes ? "Ocultar rutas" : "Mostrar rutas"}
        >
          <Route className="h-5 w-5" />
        </button>
      )}

      {showMarkersToggle && (
        <button
          onClick={() => setShowMarkers(!showMarkers)}
          className={`flex h-9 w-9 items-center justify-center rounded-md shadow-md transition-colors hover:text-foreground ${
            showMarkers
              ? "bg-background/90 text-muted-foreground hover:bg-background"
              : "bg-muted/80 text-muted-foreground/50 hover:bg-muted"
          }`}
          title={showMarkers ? "Ocultar marcadores" : "Mostrar marcadores"}
        >
          <MapPin className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
