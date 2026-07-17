import { getHandler } from '../server/dist/handler.js'

export default async function handler(req, res) {
  const serverlessHandler = await getHandler()
  return serverlessHandler(req, res)
}
