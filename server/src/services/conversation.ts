import { config } from '../config/index.js'
import { llmService } from './llm.js'

const MAX_HISTORY = 20

interface Conversation {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
}

const sessions = new Map<string, Conversation>()

function getSession(socketId: string): Conversation {
  if (!sessions.has(socketId)) {
    sessions.set(socketId, {
      messages: [
        { role: 'system', content: config.aiPersona.description },
      ],
    })
  }
  return sessions.get(socketId)!
}

export const conversationService = {
  async chat(socketId: string, userText: string): Promise<string> {
    const session = getSession(socketId)

    // Add user message
    session.messages.push({ role: 'user', content: userText })

    // Trim history if too long (keep system prompt + recent messages)
    if (session.messages.length > MAX_HISTORY) {
      const systemMsg = session.messages[0]
      session.messages = [systemMsg, ...session.messages.slice(-(MAX_HISTORY - 1))]
    }

    // Get AI response
    const reply = await llmService.chat([...session.messages])

    // Add assistant message to history
    session.messages.push({ role: 'assistant', content: reply })

    return reply
  },

  reset(socketId: string): void {
    sessions.delete(socketId)
  },
}
