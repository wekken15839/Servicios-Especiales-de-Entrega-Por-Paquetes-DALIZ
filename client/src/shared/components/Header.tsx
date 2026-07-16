import { useState } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSidebar } from '@/shared/hooks/useSidebar'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'

export function Header() {
  const { user, logout } = useAuth()
  const toggle = useSidebar((s) => s.toggle)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4">
      <button
        onClick={toggle}
        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="ms-auto flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{user?.name}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowLogoutDialog(true)}
          title="Cerrar sesión"
        >
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Cerrar sesión"
        description="¿Estás seguro de que deseas cerrar sesión?"
        confirmLabel="Cerrar sesión"
        confirmVariant="destructive"
        onConfirm={logout}
      />
    </header>
  )
}
