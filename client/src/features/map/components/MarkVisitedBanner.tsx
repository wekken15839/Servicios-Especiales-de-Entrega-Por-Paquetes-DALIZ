import { useState, useEffect, useCallback } from "react";
import { Package } from "lucide-react";
import { useMapStore } from "../store/mapStore";
import { clientsService } from "@/features/fiados/api/clients.service";
import { fiadosService } from "@/features/fiados/api/fiados.service";
import { Sheet } from "@/shared/components/Sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/shared/components/ui/skeleton";

type MarkVisitedBannerProps = {
  open: boolean;
  onClose: () => void;
};

function formatCOP(value: number): string {
  return `$${value.toLocaleString("de-DE")}`;
}

export function MarkVisitedBanner({ open, onClose }: MarkVisitedBannerProps) {
  const selectedDeliveryId = useMapStore((s) => s.selectedDeliveryId);
  const deliveries = useMapStore((s) => s.deliveries);
  const routes = useMapStore((s) => s.routes);
  const activeRouteId = useMapStore((s) => s.activeRouteId);
  const markVisited = useMapStore((s) => s.markVisited);
  const selectDelivery = useMapStore((s) => s.selectDelivery);
  const updateRouteNotes = useMapStore((s) => s.updateRouteNotes);

  const [packagesDelivered, setPackagesDelivered] = useState("1");
  const [paid, setPaid] = useState(true);
  const [partialPayment, setPartialPayment] = useState("");   // abono de ESTA entrega
  const [oldDebtPayment, setOldDebtPayment] = useState("");   // abono a deuda anterior
  const [oldDebtDesc, setOldDebtDesc] = useState("");
  const [routeNotes, setRouteNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const route = routes.find((r) => r.id === activeRouteId);
  const waypoint = route?.waypoints.find(
    (wp) => wp.deliveryId === selectedDeliveryId,
  );
  const delivery = deliveries.find((d) => d.id === selectedDeliveryId);

  const canShow = !!(
    open && activeRouteId && selectedDeliveryId && route &&
    (route.status === "in_progress" || route.status === "paused") &&
    waypoint && !waypoint.visited && delivery
  );

  const fetchBalance = useCallback(async () => {
    if (!delivery?.clientName) return;
    setBalanceLoading(true);
    setCurrentBalance(null);

    const clientsRes = await clientsService.getAll();
    if (clientsRes.error || !clientsRes.data) {
      setBalanceLoading(false);
      return;
    }

    const client = clientsRes.data.find(
      (c) => c.name.toLowerCase() === delivery.clientName.toLowerCase(),
    );
    if (!client) { setBalanceLoading(false); return; }

    const balanceRes = await fiadosService.getBalance(client.id);
    if (!balanceRes.error && balanceRes.data) {
      setCurrentBalance(balanceRes.data.balance);
    }
    setBalanceLoading(false);
  }, [delivery?.clientName]);

  useEffect(() => {
    if (canShow) {
      setCurrentBalance(null);
      fetchBalance();
      setRouteNotes(route?.notes ?? '');
    }
  }, [canShow, fetchBalance, route?.notes]);

  const reset = () => {
    selectDelivery(null);
    onClose();
    setPackagesDelivered("1");
    setPaid(true);
    setPartialPayment("");
    setOldDebtPayment("");
    setOldDebtDesc("");
    setRouteNotes("");
    setIsSubmitting(false);
    setCurrentBalance(null);
  };

  const totalAmount = parseInt(packagesDelivered, 10) * 4000;
  const partial = parseInt(partialPayment, 10) || 0;
  const remainingDebt = Math.max(0, totalAmount - partial);

  const handleConfirm = async () => {
    if (!activeRouteId || !selectedDeliveryId) return;

    setIsSubmitting(true);
    const count = parseInt(packagesDelivered, 10) || 1;

    // Credit amount = total - partial payment (can be 0 if fully paid)
    const creditAmount = paid ? 0 : remainingDebt;

    // Old debt payment
    const oldDebt = parseInt(oldDebtPayment, 10) || 0;

    // Save route notes in parallel if changed
    const notesPromise =
      routeNotes !== (route?.notes ?? '')
        ? updateRouteNotes(activeRouteId, routeNotes)
        : Promise.resolve();

    await notesPromise;

    await markVisited(
      activeRouteId,
      selectedDeliveryId,
      count,
      paid ? "paid" : "pending",
      count,
      creditAmount,                                          // credit amount (net)
      partial > 0 ? partial : undefined,                    // partial payment for this delivery
      oldDebt > 0 ? oldDebt : undefined,                    // old debt payment
      oldDebtDesc || undefined,
    );

    setIsSubmitting(false);
    reset();
  };

  return (
    <Sheet open={canShow} onClose={reset} title="Completar entrega" position="bottom">
      <div className="p-5 space-y-5">
        {/* Client info + balance */}
        <div className="space-y-2">
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>
              Cliente:{" "}
              <strong className="text-foreground">{delivery?.clientName}</strong>
            </span>
            <strong className="text-foreground">{delivery?.address}</strong>
          </div>

          <div className="flex items-center gap-2">
            {balanceLoading ? (
              <Skeleton className="h-6 w-32 rounded-full" />
            ) : currentBalance !== null && currentBalance > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-0.5 text-xs font-semibold text-destructive">
                Debe {formatCOP(currentBalance)}
              </span>
            ) : currentBalance !== null ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                Sin deuda
              </span>
            ) : null}
          </div>
        </div>

        {/* Packages count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-foreground">Paquetes entregados</label>
          <div className="flex items-center justify-center gap-3">
            <button type="button" onClick={() => setPackagesDelivered((p) => String(Math.max(1, parseInt(p, 10) - 1)))}
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border bg-muted text-xl font-medium text-muted-foreground transition-colors hover:bg-muted/80">
              −
            </button>
            <input type="number" min="1" value={packagesDelivered}
              onChange={(e) => setPackagesDelivered(e.target.value || "1")}
              className="h-12 w-20 rounded-xl border-2 border-border bg-input text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring" />
            <button type="button" onClick={() => setPackagesDelivered((p) => String(parseInt(p, 10) + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary/30 bg-primary/10 text-xl font-medium text-primary transition-colors hover:bg-primary/20">
              +
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">Total: {formatCOP(totalAmount)}</p>
        </div>

        {/* Payment toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-foreground">¿Pagó esta entrega?</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaid(true)}
              disabled={isSubmitting}
              className={`flex-1 h-12 rounded-xl border text-sm font-medium transition-all ${
                paid
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-sm'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Sí, pagó
            </button>
            <button
              type="button"
              onClick={() => setPaid(false)}
              disabled={isSubmitting}
              className={`flex-1 h-12 rounded-xl border text-sm font-medium transition-all ${
                !paid
                  ? 'border-border bg-muted/50 text-foreground shadow-sm'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Quedó debiendo
            </button>
          </div>
        </div>

        {/* PENDING: partial payment for THIS delivery */}
        {!paid && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Total: {formatCOP(totalAmount)}
            </p>
            <div className="space-y-1">
              <label className="text-xs">¿Cuánto abonó ahora?</label>
              <div className="flex items-center gap-2">
                <Input type="number" min="0" max={totalAmount} step="100"
                  placeholder="$0"
                  value={partialPayment}
                  onChange={(e) => {
                    const v = e.target.value || "";
                    const n = parseInt(v, 10);
                    if (v && n > totalAmount) return;
                    setPartialPayment(v);
                  }}
                  disabled={isSubmitting}
                  className="h-10 w-28" />
                <span className="text-xs text-muted-foreground">
                  {partial > 0
                    ? `Queda debiendo ${formatCOP(remainingDebt)}`
                    : `Queda debiendo ${formatCOP(totalAmount)}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Abono to EXISTING debt — only if client has debt */}
        {currentBalance !== null && currentBalance > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">¿Abono a deuda anterior?</p>
              <p className="text-xs text-muted-foreground">
                Debe {formatCOP(currentBalance)} — máximo {formatCOP(currentBalance)}
              </p>
            </div>
            <div className="flex gap-2">
              <Input type="number" min="0" max={currentBalance} step="100"
                placeholder="$0" value={oldDebtPayment}
                onChange={(e) => {
                  const v = e.target.value || "";
                  const n = parseInt(v, 10);
                  if (v && n > currentBalance) return;
                  setOldDebtPayment(v);
                }}
                disabled={isSubmitting}
                className="h-10 w-28" />
              <Input placeholder="Descripción (opcional)" value={oldDebtDesc}
                onChange={(e) => setOldDebtDesc(e.target.value)}
                disabled={isSubmitting}
                className="h-10 flex-1" />
            </div>
          </div>
        )}

        {/* Route notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-foreground">
            Nota de la ruta
          </label>
          <Textarea
            value={routeNotes}
            onChange={(e) => setRouteNotes(e.target.value)}
            placeholder="Escribí una nota general para esta ruta..."
            className="min-h-[72px] text-sm resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 h-12" onClick={reset} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            className={`flex-1 h-12 gap-2 ${paid ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90"}`}
            variant="default"
            onClick={handleConfirm} disabled={isSubmitting}>
            <Package className="h-5 w-5" />
            {isSubmitting ? "Confirmando..." : "Confirmar entrega"}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
