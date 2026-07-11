import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wifi, Camera, CameraOff } from 'lucide-react'
import { useCallStore } from '@/store/callStore'
import { useSocket } from '@/hooks/useSocket'
import { useAudioCapture } from '@/hooks/useAudioCapture'
import { CallControls } from './CallControls'
import { AudioVisualizer } from './AudioVisualizer'
import { ChatBubble } from './ChatBubble'
import { Live2DAvatar } from './Live2DAvatar'
import clsx from 'clsx'

export function VideoCallScreen() {
  const navigate = useNavigate()
  const { callState, duration, subtitles, emotion, incrementDuration } =
    useCallStore()
  const subtitlesEndRef = useRef<HTMLDivElement>(null)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const { sendSTTResult, endCall: socketEndCall, initiateCall } = useSocket()

  // Start the call automatically
  useEffect(() => {
    if (callState === 'idle') {
      initiateCall('video')
    }
  }, [callState, initiateCall])

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

  // Start user camera
  useEffect(() => {
    if (callState !== 'connected' || !cameraEnabled) return

    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240 }, audio: false })
      .then((stream) => {
        streamRef.current = stream
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream
        }
      })
      .catch(() => setCameraEnabled(false))

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [callState, cameraEnabled])

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
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setTimeout(() => navigate('/'), 400)
  }

  const toggleCamera = () => {
    if (cameraEnabled) {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
    setCameraEnabled(!cameraEnabled)
  }

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (callState === 'idle') {
    navigate('/')
    return null
  }

  // Emotion-based gradient for the avatar background
  const emotionGradients: Record<string, string> = {
    neutral: 'from-purple-900/50 via-gray-900 to-gray-950',
    happy: 'from-pink-900/50 via-gray-900 to-gray-950',
    sad: 'from-blue-900/50 via-gray-900 to-gray-950',
    surprised: 'from-yellow-900/50 via-gray-900 to-gray-950',
    shy: 'from-rose-900/50 via-gray-900 to-gray-950',
    angry: 'from-red-900/50 via-gray-900 to-gray-950',
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Wifi
            className={clsx(
              'w-4 h-4',
              callState === 'connected' ? 'text-green-400' : 'text-yellow-400',
            )}
          />
          <span className="text-sm text-white/70 glass-card px-2 py-0.5 rounded-full">
            {callState === 'connecting' ? '连接中...' : formatDuration(duration)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={clsx(
              'w-2 h-2 rounded-full',
              isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-600',
            )}
          />
        </div>
      </div>

      {/* Live2D Avatar area (main) */}
      <div
        className={clsx(
          'flex-1 bg-gradient-to-b',
          emotionGradients[emotion] || emotionGradients.neutral,
        )}
      >
        <Live2DAvatar
          emotion={emotion}
          playing={callState === 'connected'}
        />
      </div>

      {/* Subtitles overlay */}
      <div className="absolute bottom-40 left-4 right-4 max-h-[20vh] overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          {subtitles.slice(-3).map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          <div ref={subtitlesEndRef} />
        </div>
      </div>

      {/* Audio visualizer */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
        <AudioVisualizer
          active={callState === 'connected' && isListening}
          bars={5}
        />
      </div>

      {/* User self-view PIP */}
      {cameraEnabled && (
        <div className="absolute top-16 right-4 w-28 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
          <video
            ref={userVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
        {/* Camera toggle */}
        <button
          onClick={toggleCamera}
          className={clsx(
            'call-btn-secondary',
            !cameraEnabled && 'bg-red-500/20 border-red-500/50',
          )}
        >
          {cameraEnabled ? (
            <Camera className="w-5 h-5 text-white" />
          ) : (
            <CameraOff className="w-5 h-5 text-red-400" />
          )}
        </button>

        <CallControls onEndCall={handleEndCall} />
      </div>
    </div>
  )
}
