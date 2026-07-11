import clsx from 'clsx'
import type { SubtitleMessage } from '@/types'

interface Props {
  message: SubtitleMessage
}

export function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div
      className={clsx(
        'subtitle-bubble animate-slide-up',
        isUser
          ? 'self-end bg-purple-500/20 border-purple-500/30 text-right'
          : 'self-start bg-white/5 border-white/10 text-left',
      )}
    >
      <span className="text-xs text-gray-500 block mb-0.5">
        {isUser ? '你' : '🌸 小夜'}
      </span>
      <span className="text-white text-sm leading-relaxed">{message.text}</span>
    </div>
  )
}
