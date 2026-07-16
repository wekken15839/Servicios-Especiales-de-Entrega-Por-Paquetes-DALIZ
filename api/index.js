import { getHandler } from '../server/dist/handler.js'

export default async function handler(req, res) {
  const fn = await getHandler()
  return fn(req, res)
}
