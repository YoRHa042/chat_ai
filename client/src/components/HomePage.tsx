import { useNavigate } from 'react-router-dom'
import { Phone, Video, Sparkles } from 'lucide-react'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {/* Title */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold gradient-text">Chat AI</h1>
        </div>
        <p className="text-gray-400 text-lg">
          和小夜一起聊天吧！选择你喜欢的通话方式 ~
        </p>
      </div>

      {/* Call mode cards */}
      <div className="flex gap-8 flex-wrap justify-center animate-slide-up">
        {/* Voice Call */}
        <button
          onClick={() => navigate('/call/voice')}
          className="glass-card p-8 w-64 flex flex-col items-center gap-5
                     hover:bg-white/10 hover:scale-105 transition-all duration-300
                     group cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500
                          flex items-center justify-center shadow-lg shadow-purple-500/30
                          group-hover:shadow-purple-500/50 transition-shadow">
            <Phone className="w-9 h-9 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-1">语音通话</h3>
            <p className="text-gray-400 text-sm">Voice Call</p>
          </div>
          <div className="flex items-center gap-1 text-purple-400 text-sm group-hover:translate-x-1 transition-transform">
            <span>开始通话</span>
            <span>→</span>
          </div>
        </button>

        {/* Video Call */}
        <button
          onClick={() => navigate('/call/video')}
          className="glass-card p-8 w-64 flex flex-col items-center gap-5
                     hover:bg-white/10 hover:scale-105 transition-all duration-300
                     group cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500
                          flex items-center justify-center shadow-lg shadow-cyan-500/30
                          group-hover:shadow-cyan-500/50 transition-shadow">
            <Video className="w-9 h-9 text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-1">视频通话</h3>
            <p className="text-gray-400 text-sm">Video Call</p>
          </div>
          <div className="flex items-center gap-1 text-cyan-400 text-sm group-hover:translate-x-1 transition-transform">
            <span>开始通话</span>
            <span>→</span>
          </div>
        </button>
      </div>

      {/* AI Character info */}
      <div className="mt-12 glass-card px-6 py-4 flex items-center gap-4 max-w-md animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400
                        flex items-center justify-center text-xl flex-shrink-0">
          🌸
        </div>
        <div>
          <p className="text-white font-medium">小夜 (Saya)</p>
          <p className="text-gray-400 text-sm">AI 虚拟伙伴 · 元气动漫少女</p>
        </div>
      </div>
    </div>
  )
}
