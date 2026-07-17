export default async function handler(req, res) {
  return res.status(200).json({ catchAll: true, url: req.url });
}
