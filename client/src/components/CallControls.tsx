import { PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useCallStore } from '@/store/callStore'
import clsx from 'clsx'

interface Props {
  onEndCall: () => void
}

export function CallControls({ onEndCall }: Props) {
  const { isMuted, isSpeakerOn, toggleMute, toggleSpeaker } = useCallStore()

  return (
    <div className="flex items-center gap-6">
      {/* Mute */}
      <button
        onClick={toggleMute}
        className={clsx(
          'call-btn-secondary',
          isMuted && 'bg-red-500/20 border-red-500/50',
        )}
        title={isMuted ? '取消静音' : '静音'}
      >
        {isMuted ? (
          <MicOff className="w-6 h-6 text-red-400" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Hangup */}
      <button onClick={onEndCall} className="call-btn-end" title="挂断">
        <PhoneOff className="w-7 h-7 text-white" />
      </button>

      {/* Speaker */}
      <button
        onClick={toggleSpeaker}
        className={clsx(
          'call-btn-secondary',
          !isSpeakerOn && 'bg-white/5',
        )}
        title={isSpeakerOn ? '关闭扬声器' : '打开扬声器'}
      >
        {isSpeakerOn ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-400" />
        )}
      </button>
    </div>
  )
}
