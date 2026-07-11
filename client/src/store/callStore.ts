import { create } from 'zustand'
import type { CallMode, CallState, SubtitleMessage, Emotion } from '@/types'

interface CallStore {
  // Call state
  callState: CallState
  callMode: CallMode | null
  duration: number
  isMuted: boolean
  isSpeakerOn: boolean

  // Subtitles
  subtitles: SubtitleMessage[]

  // Live2D emotion
  emotion: Emotion

  // Actions
  setCallState: (state: CallState) => void
  startCall: (mode: CallMode) => void
  endCall: () => void
  toggleMute: () => void
  toggleSpeaker: () => void
  incrementDuration: () => void
  addSubtitle: (msg: { role: 'user' | 'ai'; text: string }) => void
  setEmotion: (emotion: Emotion) => void
  reset: () => void
}

export const useCallStore = create<CallStore>((set) => ({
  callState: 'idle',
  callMode: null,
  duration: 0,
  isMuted: false,
  isSpeakerOn: true,
  subtitles: [],
  emotion: 'neutral',

  setCallState: (callState) => set({ callState }),
  startCall: (callMode) =>
    set({ callMode, callState: 'connecting', duration: 0, subtitles: [] }),
  endCall: () => set({ callState: 'ending' }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleSpeaker: () => set((s) => ({ isSpeakerOn: !s.isSpeakerOn })),
  incrementDuration: () => set((s) => ({ duration: s.duration + 1 })),
  addSubtitle: (msg) =>
    set((s) => ({
      subtitles: [
        ...s.subtitles,
        { id: Date.now().toString(36), ...msg, timestamp: Date.now() },
      ],
    })),
  setEmotion: (emotion) => set({ emotion }),
  reset: () =>
    set({
      callState: 'idle',
      callMode: null,
      duration: 0,
      isMuted: false,
      isSpeakerOn: true,
      subtitles: [],
      emotion: 'neutral',
    }),
}))
