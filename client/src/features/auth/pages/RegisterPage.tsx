import { RegisterForm } from '../components/RegisterForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

interface RegisterPageProps {
  mode?: 'admin' | 'public'
}

export function RegisterPage({ mode = 'admin' }: RegisterPageProps) {
  const isAdminMode = mode === 'admin'

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>{isAdminMode ? 'Crear usuario' : 'Crear cuenta'}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {isAdminMode
              ? 'Registra un nuevo usuario en la plataforma'
              : 'Regístrate para comenzar a usar la plataforma'}
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm mode={mode} />
        </CardContent>
      </Card>
    </div>
  )
}
