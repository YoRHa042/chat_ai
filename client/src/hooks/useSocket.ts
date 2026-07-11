import { useEffect, useRef, useCallback } from 'react'
import { socket } from '@/services/socket'
import { useCallStore } from '@/store/callStore'
import type { CallMode } from '@/types'

export function useSocket() {
  const { startCall: setCallMode, setCallState, addSubtitle, setEmotion, reset } =
    useCallStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element for playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Setup socket listeners
  useEffect(() => {
    socket.on('call:connected', () => {
      setCallState('connected')
    })

    socket.on('call:disconnected', () => {
      reset()
    })

    socket.on('message:subtitle', ({ text, role }) => {
      addSubtitle({ text, role })
    })

    socket.on('audio:reply', ({ audio }) => {
      if (!audio || !audioRef.current) return
      // Play base64 WAV audio
      const audioEl = audioRef.current
      audioEl.src = `data:audio/wav;base64,${audio}`
      audioEl.play().catch((err) => {
        console.warn('[audio] playback failed:', err)
      })
    })

    socket.on('live2d:emotion', ({ emotion }) => {
      setEmotion(emotion)
    })

    socket.on('error', ({ message }) => {
      console.error('[socket] error:', message)
    })

    return () => {
      socket.off('call:connected')
      socket.off('call:disconnected')
      socket.off('message:subtitle')
      socket.off('audio:reply')
      socket.off('live2d:emotion')
      socket.off('error')
    }
  }, [setCallState, addSubtitle, setEmotion, reset])

  const initiateCall = useCallback(
    (mode: CallMode) => {
      setCallMode(mode)
      if (!socket.connected) {
        socket.connect()
      }
      socket.emit('call:start', { mode })
    },
    [setCallMode],
  )

  const endCall = useCallback(() => {
    socket.emit('call:end')
    setCallState('ending')
    setTimeout(() => reset(), 300)
  }, [setCallState, reset])

  const sendSTTResult = useCallback((text: string) => {
    socket.emit('stt:result', { text })
  }, [])

  return { initiateCall, endCall, sendSTTResult, socket }
}
