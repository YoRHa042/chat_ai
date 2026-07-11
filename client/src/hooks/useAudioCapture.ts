import { useRef, useCallback, useState, useEffect } from 'react'

// Check for browser speech recognition support
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

export function useAudioCapture(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'zh-CN' // Chinese + some Japanese words

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1]
      if (last.isFinal) {
        const text = last[0].transcript.trim()
        if (text) {
          onResult(text)
        }
      }
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Ignore — user just didn't speak
        return
      }
      console.warn('[stt] recognition error:', event.error)
      // Auto-restart on non-fatal errors
      if (event.error !== 'aborted' && isListening) {
        try {
          recognition.start()
        } catch {
          // ignore
        }
      }
    }

    recognition.onend = () => {
      // Auto-restart if still in listening mode
      if (isListening) {
        try {
          recognition.start()
        } catch {
          // ignore
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.abort()
      } catch {
        // ignore
      }
    }
  }, [onResult, isListening])

  // Start listening
  const startListening = useCallback(async () => {
    // Request microphone access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
    } catch (err) {
      console.error('[audio] microphone access denied:', err)
      setIsSupported(false)
      return
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        // already started
        setIsListening(true)
      }
    }
  }, [])

  // Stop listening
  const stopListening = useCallback(() => {
    setIsListening(false)

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {
        // ignore
      }
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      mediaStreamRef.current = null
    }
  }, [])

  return { isListening, isSupported, startListening, stopListening }
}
