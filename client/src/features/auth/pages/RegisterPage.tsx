import { RegisterForm } from '../components/RegisterForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Crear cuenta</CardTitle>
          <p className="text-sm text-muted-foreground">
            Regístrate para comenzar a usar la plataforma
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
