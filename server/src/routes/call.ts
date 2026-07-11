import { Router } from 'express'

export const callRouter = Router()

callRouter.post('/start', (_req, res) => {
  res.json({ success: true, message: 'Call started' })
})

callRouter.post('/end', (_req, res) => {
  res.json({ success: true, message: 'Call ended' })
})
