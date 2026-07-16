import serverless from 'serverless-http'
import { createApp } from './app.js'
import { validateEnv } from './shared/config/env.js'
import { connectDB } from './shared/config/db.js'

let cachedHandler: ReturnType<typeof serverless> | null = null

export async function getHandler() {
  if (cachedHandler) return cachedHandler

  const env = validateEnv()
  await connectDB()

  const { app } = createApp(env)
  cachedHandler = serverless(app, {
    request: (req: any) => {
      req.serverless = { event: req.event, context: req.context }
    },
  })

  return cachedHandler
}
