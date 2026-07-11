interface Props {
  active: boolean
  bars?: number
}

export function AudioVisualizer({ active, bars = 5 }: Props) {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-pink-500"
          style={{
            animation: active
              ? `wave ${0.8 + Math.random() * 0.7}s ease-in-out infinite`
              : 'none',
            animationDelay: `${i * 0.15}s`,
            height: active ? undefined : '4px',
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
