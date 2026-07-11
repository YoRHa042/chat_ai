import { config } from '../config/index.js'

export const ttsService = {
  async generate(text: string): Promise<string> {
    try {
      const resp = await fetch(`${config.ttsServiceUrl}/api/tts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: config.aiPersona.voice,
        }),
      })

      if (!resp.ok) {
        throw new Error(`TTS service error: ${resp.status}`)
      }

      const data = await resp.json()
      return data.audio as string
    } catch (_err) {
      // Fallback: return empty audio if TTS service is unavailable
      console.warn('[tts] TTS service unavailable, returning empty audio')
      return ''
    }
  },
}
