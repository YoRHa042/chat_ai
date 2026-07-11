import { Router } from 'express'

export const ttsRouter = Router()

// Proxy to Python TTS service — keep for direct REST access
ttsRouter.get('/voices', async (_req, res) => {
  try {
    const resp = await fetch('http://localhost:5000/api/tts/voices')
    const data = await resp.json()
    res.json(data)
  } catch {
    res.json({
      voices: [
        { id: 'ja-JP-NanamiNeural', name: 'Nanami', language: 'ja-JP', gender: 'Female', style: '自然温暖' },
        { id: 'ja-JP-AoiNeural', name: 'Aoi', language: 'ja-JP', gender: 'Female', style: '年轻活泼' },
        { id: 'ja-JP-MayuNeural', name: 'Mayu', language: 'ja-JP', gender: 'Female', style: '可爱甜美' },
      ],
    })
  }
})
