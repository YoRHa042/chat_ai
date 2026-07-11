import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Wifi } from 'lucide-react'
import { useCallStore } from '@/store/callStore'
import { useSocket } from '@/hooks/useSocket'
import { useAudioCapture } from '@/hooks/useAudioCapture'
import { CallControls } from './CallControls'
import { AudioVisualizer } from './AudioVisualizer'
import { ChatBubble } from './ChatBubble'
import clsx from 'clsx'

export function VoiceCallScreen() {
  const navigate = useNavigate()
  const { callState, callMode, duration, subtitles, incrementDuration } = useCallStore()
  const subtitlesEndRef = useRef<HTMLDivElement>(null)

  const { sendSTTResult, endCall: socketEndCall, initiateCall } = useSocket()

  // Start the call automatically
  useEffect(() => {
    if (callState === 'idle') {
      initiateCall('voice')
    }
  }, [callState, initiateCall])

  // Handle STT results
  const handleSTTResult = useCallback(
    (text: string) => {
      sendSTTResult(text)
    },
    [sendSTTResult],
  )

  const { isListening, isSupported, startListening, stopListening } =
    useAudioCapture(handleSTTResult)

  // Start listening when connected
  useEffect(() => {
    if (callState === 'connected') {
      startListening()
    }
    return () => {
      stopListening()
    }
  }, [callState, startListening, stopListening])

  // Call duration timer
  useEffect(() => {
    if (callState !== 'connected') return
    const timer = setInterval(incrementDuration, 1000)
    return () => clearInterval(timer)
  }, [callState, incrementDuration])

  // Auto-scroll subtitles
  useEffect(() => {
    subtitlesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [subtitles])

  const handleEndCall = () => {
    socketEndCall()
    stopListening()
    setTimeout(() => navigate('/'), 400)
  }

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // If ended, show transition
  if (callState === 'idle') {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Wifi
            className={clsx(
              'w-4 h-4',
              callState === 'connected' ? 'text-green-400' : 'text-yellow-400',
            )}
          />
          <span className="text-sm text-gray-400">
            {callState === 'connecting'
              ? '连接中...'
              : callState === 'ending'
                ? '通话结束'
                : formatDuration(duration)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'w-2 h-2 rounded-full',
              isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-600',
            )}
          />
          <span className="text-xs text-gray-500">
            {!isSupported
              ? 'STT 不可用'
              : isListening
                ? '正在听...'
                : '麦克风关闭'}
          </span>
        </div>
      </div>

      {/* Main area — AI avatar placeholder + visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* AI Avatar circle */}
        <div className="relative mb-8">
          <div
            className={clsx(
              'w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500',
              'flex items-center justify-center shadow-2xl shadow-purple-500/30',
              callState === 'connected' && 'animate-pulse-slow',
            )}
          >
            <span className="text-5xl">🌸</span>
          </div>

          {/* Connection ring animation */}
          {callState === 'connecting' && (
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-ping" />
          )}
          {callState === 'connected' && (
            <div className="absolute -inset-2 rounded-full border border-purple-400/20 animate-pulse" />
          )}
        </div>

        {/* AI Name + status */}
        <h2 className="text-2xl font-bold text-white mb-2">小夜</h2>
        <p className="text-gray-400 text-sm mb-6">
          {callState === 'connecting'
            ? '接通中...'
            : callState === 'connected'
              ? '通话中 💬'
              : '通话结束'}
        </p>

        {/* Audio visualizer */}
        <AudioVisualizer
          active={callState === 'connected' && isListening}
          bars={7}
        />
      </div>

      {/* Subtitles area */}
      <div className="flex-1 max-h-[30vh] overflow-y-auto px-6 pb-2">
        <div className="flex flex-col gap-2">
          {subtitles.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          <div ref={subtitlesEndRef} />
        </div>
      </div>

      {/* Call controls */}
      <div className="flex justify-center py-6">
        <CallControls onEndCall={handleEndCall} />
      </div>
    </div>
  )
}
