export type CallMode = 'voice' | 'video'
export type Emotion = 'neutral' | 'happy' | 'sad' | 'surprised' | 'shy' | 'angry'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ServerToClientEvents {
  'call:connected': () => void
  'call:disconnected': () => void
  'audio:reply': (data: { audio: string }) => void
  'message:subtitle': (msg: { text: string; role: 'ai' }) => void
  'live2d:emotion': (data: { emotion: Emotion }) => void
  'error': (data: { message: string }) => void
}

export interface ClientToServerEvents {
  'call:start': (data: { mode: CallMode }) => void
  'call:end': () => void
  'audio:chunk': (data: { audio: string }) => void
  'stt:result': (data: { text: string }) => void
}
