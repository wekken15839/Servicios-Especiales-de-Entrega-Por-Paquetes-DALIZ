import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { useAuth } from '../hooks/useAuth'
import { Users } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['user', 'admin']).default('user'),
})

type RegisterFormData = z.input<typeof registerSchema>

interface RegisterFormProps {
  mode?: 'admin' | 'public'
}

export function RegisterForm({ mode = 'admin' }: RegisterFormProps) {
  const navigate = useNavigate()
  const { register: registerUser, createUser, isLoading, error, clearError, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && mode !== 'admin') {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate, mode])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      role: 'user',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    if (mode === 'admin') {
      const err = await createUser(data)
      if (err === null) reset()
    } else {
      await registerUser(data)
    }
  }

  const isAdminMode = mode === 'admin'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          placeholder="Tu nombre"
          {...register('name')}
          onFocus={clearError}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          placeholder="tu_usuario"
          {...register('username')}
          onFocus={clearError}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••"
          {...register('password')}
          onFocus={clearError}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {isAdminMode && (
        <div className="space-y-2">
          <Label htmlFor="role" className="text-cyan-400">Rol</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400 pointer-events-none" />
            <Select
              id="role"
              className="pl-9"
              {...register('role')}
            >
              <option value="user">Usuario repartidor</option>
              <option value="admin">Administrador</option>
            </Select>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? 'Creando...'
          : isAdminMode
            ? 'Crear usuario'
            : 'Crear cuenta'}
      </Button>

      {!isAdminMode && (
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      )}
    </form>
  )
}
