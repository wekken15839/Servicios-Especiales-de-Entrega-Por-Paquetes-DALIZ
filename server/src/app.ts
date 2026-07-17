import { createApp } from './create-app.js'
import { validateEnv } from './shared/config/env.js'
import { connectDB } from './shared/config/db.js'

const env = validateEnv()
await connectDB()

const { app } = createApp(env)

export default app
