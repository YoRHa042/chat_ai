import { useEffect, useRef, useState } from 'react'
import type { Emotion } from '@/types'
import clsx from 'clsx'

interface Props {
  emotion?: Emotion
  playing?: boolean
}

/**
 * Live2DAvatar — Renders the anime character avatar.
 *
 * Currently uses a CSS-animated character placeholder with
 * emotion-based expressions. This component is designed to
 * be swapped with a full Live2D Cubism renderer when the
 * model files are available.
 *
 * Live2D Integration (Phase 5):
 *   1. npm install live2d-renderer
 *   2. Place .model3.json + assets in public/models/
 *   3. Replace placeholder with Live2DCubismModel canvas
 */
export function Live2DAvatar({ emotion = 'neutral', playing = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [modelLoaded, setModelLoaded] = useState(false)

  // Placeholder avatar — will be replaced by Live2D renderer
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // Draw the placeholder character
    let animId: number
    let time = 0

    const emotionConfigs: Record<string, { eyes: string; mouth: string; blush: string }> = {
      neutral: { eyes: '◉◉', mouth: '﹏', blush: 'rgba(255,150,150,0.15)' },
      happy: { eyes: '^^', mouth: 'ω', blush: 'rgba(255,100,100,0.3)' },
      sad: { eyes: '◡◡', mouth: '︿', blush: 'rgba(100,150,255,0.1)' },
      surprised: { eyes: '○○', mouth: '○', blush: 'rgba(255,150,150,0.1)' },
      shy: { eyes: '><', mouth: '~', blush: 'rgba(255,100,100,0.4)' },
      angry: { eyes: '◣◢', mouth: 'へ', blush: 'rgba(255,50,50,0.2)' },
    }

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      const cx = w / 2
      const cy = h * 0.4
      const headRad = Math.min(w, h) * 0.22
      const cfg = emotionConfigs[emotion] || emotionConfigs.neutral

      // Breathing animation
      const breath = Math.sin(time * 0.5) * 3 * (playing ? 1 : 0)
      const tiltHead = Math.sin(time * 0.3) * 2 * (playing ? 1 : 0)

      ctx.save()
      ctx.translate(cx, cy + breath)
      ctx.rotate((tiltHead * Math.PI) / 180)

      // Hair (back)
      ctx.fillStyle = '#2d1b4e'
      ctx.beginPath()
      ctx.arc(0, -headRad * 0.3, headRad * 1.25, Math.PI, 0)
      ctx.fill()

      // Face
      ctx.fillStyle = '#ffe4c9'
      ctx.beginPath()
      ctx.arc(0, 0, headRad, 0, Math.PI * 2)
      ctx.fill()

      // Blush
      ctx.fillStyle = cfg.blush
      ctx.beginPath()
      ctx.ellipse(-headRad * 0.55, headRad * 0.15, headRad * 0.15, headRad * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(headRad * 0.55, headRad * 0.15, headRad * 0.15, headRad * 0.1, 0, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      ctx.fillStyle = '#2d1b4e'
      ctx.font = `${headRad * 0.35}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(cfg.eyes, 0, -headRad * 0.08)

      // Mouth
      ctx.font = `${headRad * 0.3}px sans-serif`
      ctx.fillText(cfg.mouth, 0, headRad * 0.35)

      // Hair (front bangs)
      ctx.fillStyle = '#2d1b4e'
      ctx.beginPath()
      ctx.arc(0, -headRad * 0.5, headRad * 1.05, Math.PI * 0.15, Math.PI * 0.85)
      ctx.fill()

      // Hair sides
      ctx.fillStyle = '#2d1b4e'
      ctx.beginPath()
      ctx.ellipse(-headRad * 0.9, headRad * 0.6, headRad * 0.25, headRad * 0.7, 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(headRad * 0.9, headRad * 0.6, headRad * 0.25, headRad * 0.7, -0.3, 0, Math.PI * 2)
      ctx.fill()

      // Body
      ctx.fillStyle = '#4a3060'
      ctx.beginPath()
      ctx.moveTo(-headRad * 0.5, headRad * 0.7)
      ctx.lineTo(headRad * 0.5, headRad * 0.7)
      ctx.lineTo(headRad * 1.0, h * 0.9)
      ctx.lineTo(-headRad * 1.0, h * 0.9)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
      time += 0.05
      animId = requestAnimationFrame(draw)
    }

    draw()
    setModelLoaded(true)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [emotion, playing])

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Live2D label (will be removed when real model loads) */}
      {!modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Loading character...</span>
        </div>
      )}

      {/* Canvas for character rendering */}
      <canvas
        ref={canvasRef}
        className={clsx(
          'live2d-canvas transition-opacity duration-500',
          modelLoaded ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* "Live2D Ready" indicator — shows when we could load a real model */}
      <div className="absolute bottom-4 left-4 glass-card px-3 py-1 text-xs text-gray-500">
        {playing ? '🎤 Live' : '💤 Idle'} · {emotion}
      </div>
    </div>
  )
}
