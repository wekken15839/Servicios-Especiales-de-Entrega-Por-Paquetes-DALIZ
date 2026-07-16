import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMapStore } from "../store/mapStore";
import { useMapData } from "../hooks/useMapData";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { MapView } from "../components/MapView";
import { AddDeliveryPanel } from "../components/AddDeliveryPanel";
import { CreateRoutePanel } from "../components/CreateRoutePanel";
import { MarkVisitedBanner } from "../components/MarkVisitedBanner";
import { FilterBar } from "../components/FilterBar";
import { DeliveryDetailPanel } from "../components/DeliveryDetailPanel";
import { Z } from "@/shared/constants/zIndex";
import { cn } from "@/shared/lib/utils";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import {
  Plus,
  Route,
  Flag,
  Maximize2,
  Minimize2,
  X,
  MapPin,
  Crosshair,
} from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

export function MapPage() {
  const { isLoading, isEmpty } = useMapData();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const error = useMapStore((s) => s.error);
  const setError = useMapStore((s) => s.setError);
  const isPlacing = useMapStore((s) => s.isPlacing);
  const setPlacing = useMapStore((s) => s.setPlacing);
  const setCreatingRoute = useMapStore((s) => s.setCreatingRoute);
  const pendingLocation = useMapStore((s) => s.pendingLocation);
  const isFullscreen = useMapStore((s) => s.isFullscreen);
  const toggleFullscreen = useMapStore((s) => s.toggleFullscreen);
  const deliveries = useMapStore((s) => s.deliveries);
  const routes = useMapStore((s) => s.routes);
  const selectedDeliveryId = useMapStore((s) => s.selectedDeliveryId);
  const filters = useMapStore((s) => s.filters);
  const selectDelivery = useMapStore((s) => s.selectDelivery);
  const clearPendingLocation = useMapStore((s) => s.clearPendingLocation);
  const activeRouteId = useMapStore((s) => s.activeRouteId);

  const quickDeliveryPopup = useSettingsStore((s) => s.quickDeliveryPopup);

  const hasDraftRoute = routes.some((r) => r.status === "draft");
  const hasActiveRoute = routes.some(
    (r) => r.status === "in_progress" || r.status === "paused",
  );

  const activeRoute = routes.find((r) => r.id === activeRouteId);
  const selectedWaypoint = activeRoute?.waypoints.find(
    (wp) => wp.deliveryId === selectedDeliveryId,
  );

  const canMarkVisited =
    hasActiveRoute && selectedWaypoint && !selectedWaypoint.visited;

  useEffect(() => {
    if (!selectedDeliveryId) return;
    const delivery = deliveries.find((d) => d.id === selectedDeliveryId);
    if (!delivery) {
      selectDelivery(null);
      return;
    }
    if (filters.status && delivery.status !== filters.status) {
      selectDelivery(null);
      return;
    }
  }, [filters, deliveries, selectedDeliveryId, selectDelivery]);

  useEffect(() => {
    if (!isPlacing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearPendingLocation();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPlacing, clearPendingLocation]);

  useEffect(() => {
    console.log("selectedDeliveryId:", selectedDeliveryId);
    console.log(selectedWaypoint);
    console.log(activeRoute);
  }, [selectedDeliveryId]);

  useEffect(() => {
    if (!quickDeliveryPopup) return;
    if (!selectedDeliveryId) return;
    if (canMarkVisited) {
      setIsMarkingOpen(true);
    }
  }, [selectedDeliveryId, quickDeliveryPopup, canMarkVisited]);

  const handleAddClick = () => {
    setPlacing(true);
  };

  const [isMarkingOpen, setIsMarkingOpen] = useState(false);

  const isPlacingMode = isPlacing && pendingLocation.lat === null;

  return (
    <div className={cn("flex flex-col bg-background", isFullscreen && "h-full")}>
      <div
        className={`relative transition-all duration-300 ${isFullscreen ? "h-full" : "h-[63dvh] md:h-[62dvh]"} ${isPlacingMode ? "[&_.leaflet-container]:cursor-crosshair" : ""}`}
      >
        <MapView />

        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/10"
            style={{ zIndex: Z.mapOverlays }}
          >
            <div className="flex items-center gap-2.5 rounded-lg bg-background px-5 py-3 shadow-lg">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium">Cargando mapa...</span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="absolute left-1/2 top-4 -translate-x-1/2 w-full max-w-md"
            style={{ zIndex: Z.mapOverlays }}
          >
            <Alert variant="destructive" className="shadow-lg">
              <AlertDescription className="flex items-center gap-3">
                <span className="flex-1">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-1 rounded p-0.5 font-bold leading-none hover:bg-destructive/20 shrink-0"
                >
                  &times;
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {isEmpty && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/80"
              style={{ zIndex: Z.mapOverlays }}
            >
              <p className="text-lg text-muted-foreground">
                No hay entregas para mostrar
              </p>
            </div>
        )}

        {isPlacingMode && (
          <>
            <div
              className="absolute left-1/2 top-4 -translate-x-1/2 flex items-center gap-3 rounded-xl bg-primary px-5 py-3 text-sm text-primary-foreground shadow-lg"
              style={{ zIndex: Z.mapBanners }}
            >
              <MapPin className="h-7 w-7 shrink-0" />
              <span>Selecciona un punto en el mapa para colocar el pedido</span>
              <button
                onClick={clearPendingLocation}
                  className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs text-white shadow-lg backdrop-blur-sm"
              style={{ zIndex: Z.mapBanners }}
            >
              <Crosshair className="h-4 w-4 shrink-0" />
              <span>Haz clic en el mapa &middot; Esc para cancelar</span>
            </div>
          </>
        )}

        {!hasActiveRoute && pendingLocation.lat === null && (
          <div
            className={cn(
              "group absolute",
              isMobile ? "bottom-4 right-16" : "bottom-3 right-16"
            )}
            style={{ zIndex: Z.mapFloating }}
          >
            <motion.button
              onClick={isPlacing ? undefined : handleAddClick}
              className={cn(
                "flex items-center justify-center rounded-full text-white shadow-lg",
                "bg-gradient-to-br from-cyan-400 to-teal-400",
                "ring-1 ring-cyan-300/30",
                "focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isPlacing
                  ? "animate-bounce shadow-[0_0_24px_rgba(34,211,238,0.4)]"
                  : "animate-[pulse-glow_3s_ease-in-out_infinite] shadow-[0_0_24px_rgba(34,211,238,0.3)]",
                isMobile ? "h-14 w-14" : "h-12 w-12"
              )}
              whileHover={{ scale: 1.08 }}
              whileTap={isPlacing ? {} : { scale: 0.85 }}
              aria-label={
                isPlacing
                  ? "Seleccionar ubicación — Paso 1 de 2"
                  : "Agregar nuevo pedido"
              }
            >
              <AnimatePresence mode="wait">
                {isPlacing ? (
                  <motion.span
                    key="pin"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className={isMobile ? "h-8 w-8" : "h-7 w-7"} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className={isMobile ? "h-8 w-8" : "h-7 w-7"} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {isPlacing && (
              <span
                className={cn(
                  "absolute flex items-center justify-center rounded-full bg-fuchsia-400 text-white font-bold shadow-md",
                  isMobile
                    ? "-top-1 -right-1 h-6 w-6 text-xs"
                    : "-top-1 -right-1 h-5 w-5 text-[10px]"
                )}
              >
                1
              </span>
            )}

            <div
              className={cn(
                "pointer-events-none absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                isMobile
                  ? "bottom-full left-1/2 -translate-x-1/2 mb-3"
                  : "right-full top-1/2 -translate-y-1/2 mr-3"
              )}
            >
              <div className="rounded-lg bg-popover px-3 py-1.5 shadow-lg whitespace-nowrap">
                {isPlacing ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-popover-foreground">
                      Paso 1 de 2 — Haz clic en el mapa
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Esc para cancelar
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-popover-foreground">
                    Agregar pedido
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        {!isPlacing &&
          pendingLocation.lat === null &&
          !hasDraftRoute &&
          !hasActiveRoute && (
            <button
              onClick={() => setCreatingRoute(true)}
              className="absolute bottom-4 right-32 md:bottom-3 md:right-32 flex h-14 w-14 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              title="Crear ruta"
              style={{ zIndex: Z.mapFloating }}
            >
              <Route className="h-7 w-7" />
            </button>
          )}

        {canMarkVisited && !quickDeliveryPopup && (
          <button
            onClick={() => setIsMarkingOpen(true)}
            className="absolute bottom-6 right-16 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ zIndex: Z.mapFloating }}
            title="Marcar como visitado"
          >
            <Flag className="h-7 w-7" />
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-background/90 text-muted-foreground shadow-md transition-colors hover:bg-background hover:text-foreground"
          style={{ zIndex: Z.mapFloating }}
          title={
            isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
          }
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </button>

        {hasActiveRoute && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden flex items-center gap-3 rounded-lg bg-background px-4 py-2.5 text-sm shadow-lg ring-1 ring-border"
            style={{ zIndex: Z.mapBanners }}
          >
            <span className="text-muted-foreground">Ruta activa</span>
          </div>
        )}
        {hasDraftRoute && !hasActiveRoute && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden flex items-center gap-3 rounded-lg bg-background px-4 py-2.5 text-sm shadow-lg ring-1 ring-border"
            style={{ zIndex: Z.mapBanners }}
          >
            <span className="text-muted-foreground">
              Ruta lista para iniciar
            </span>
          </div>
        )}
      </div>

      <AddDeliveryPanel />
      <CreateRoutePanel />
      <MarkVisitedBanner
        open={isMarkingOpen}
        onClose={() => setIsMarkingOpen(false)}
      />

      {!isFullscreen && (
        <div className="mt-4 space-y-4 pb-6">
          {hasActiveRoute && <FilterBar />}
          <DeliveryDetailPanel />
        </div>
      )}
    </div>
  );
}
