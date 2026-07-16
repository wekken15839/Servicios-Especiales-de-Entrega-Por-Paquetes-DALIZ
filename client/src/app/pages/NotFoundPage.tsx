import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="pt-6">
          <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Página no encontrada
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
