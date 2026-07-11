import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/components/HomePage'
import { VoiceCallScreen } from '@/components/VoiceCallScreen'
import { VideoCallScreen } from '@/components/VideoCallScreen'

export default function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/call/voice" element={<VoiceCallScreen />} />
        <Route path="/call/video" element={<VideoCallScreen />} />
      </Routes>
    </div>
  )
}
