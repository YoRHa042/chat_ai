import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { config } from './config/index.js'
import { setupSignaling } from './signaling.js'
import { callRouter } from './routes/call.js'
import type { ClientToServerEvents, ServerToClientEvents } from './types/index.js'

const app = express()
const httpServer = createServer(app)

// ── Middleware ──
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))

// ── REST routes ──
app.use('/api/call', callRouter)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', aiName: config.aiPersona.name })
})

// ── Socket.IO ──
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  maxHttpBufferSize: 1e7, // 10 MB for audio chunks
})

io.on('connection', (socket) => {
  console.log(`[socket] client connected: ${socket.id}`)
  setupSignaling(io, socket)
  socket.on('disconnect', () => {
    console.log(`[socket] client disconnected: ${socket.id}`)
  })
})

// ── Start ──
httpServer.listen(config.port, () => {
  console.log(`\n🚀 Chat AI Server running on http://localhost:${config.port}`)
  console.log(`   AI Character: ${config.aiPersona.name}`)
  console.log(`   TTS Service:  ${config.ttsServiceUrl}`)
  console.log(`   LLM Model:    ${config.llmModel}\n`)
})
