import type { Server, Socket } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents } from './types/index.js'
import { conversationService } from './services/conversation.js'
import { ttsService } from './services/tts.js'

export function setupSignaling(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  // ── Start call ──
  socket.on('call:start', async ({ mode }) => {
    console.log(`[call] ${socket.id} started ${mode} call`)

    // Reset conversation for new call
    conversationService.reset(socket.id)

    socket.emit('call:connected')

    // Greeting message
    const greeting = 'もしもし〜 こんにちは！我是小夜，很高兴能和你聊天！今天想聊什么呢？'
    socket.emit('message:subtitle', { text: greeting, role: 'ai' })

    // Generate greeting audio
    try {
      const audioBase64 = await ttsService.generate(greeting)
      socket.emit('audio:reply', { audio: audioBase64 })
    } catch (err) {
      console.error('[tts] greeting failed:', err)
    }
  })

  // ── Receive STT result (user speech as text) ──
  socket.on('stt:result', async ({ text }) => {
    console.log(`[stt] ${socket.id}: "${text}"`)

    if (!text.trim()) return

    try {
      // Get AI response from LLM
      const replyText = await conversationService.chat(socket.id, text)

      // Send subtitle to client
      socket.emit('message:subtitle', { text: replyText, role: 'ai' })

      // Generate TTS audio
      const audioBase64 = await ttsService.generate(replyText)
      socket.emit('audio:reply', { audio: audioBase64 })
    } catch (err) {
      console.error('[chat] error:', err)
      socket.emit('error', { message: 'AI 回复生成失败，请稍后再试' })
    }
  })

  // ── End call ──
  socket.on('call:end', () => {
    console.log(`[call] ${socket.id} ended call`)
    conversationService.reset(socket.id)
    socket.emit('call:disconnected')
  })

  // ── Raw audio chunk (for server-side STT, currently unused) ──
  socket.on('audio:chunk', (_data) => {
    // Reserved for server-side Whisper STT integration
  })
}
