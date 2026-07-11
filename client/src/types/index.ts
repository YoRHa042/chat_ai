export type CallMode = 'voice' | 'video'
export type CallState = 'idle' | 'connecting' | 'connected' | 'ending'

export interface CallStatus {
  state: CallState
  mode: CallMode
  duration: number
  isMuted: boolean
  isSpeakerOn: boolean
}

export interface SubtitleMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  timestamp: number
}

export type Emotion = 'neutral' | 'happy' | 'sad' | 'surprised' | 'shy' | 'angry'

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
