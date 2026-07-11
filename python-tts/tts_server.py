"""
Chat AI — TTS Server (FastAPI)

Provides REST API for text-to-speech with anime character voices.
Default engine: Microsoft Edge TTS (free, Japanese neural voices).

Usage:
    python tts_server.py
    → Runs on http://localhost:5000
"""

import base64
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from edge_tts import synthesize, VOICES

app = FastAPI(title='Chat AI TTS Server', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


# ── Request/Response models ──

class TTSRequest(BaseModel):
    text: str
    voice: str = 'ja-JP-NanamiNeural'


class TTSResponse(BaseModel):
    audio: str        # base64-encoded WAV
    format: str = 'wav'
    sampleRate: int = 24000


# ── Routes ──

@app.get('/api/tts/voices')
async def list_voices():
    """Return available anime-style voices."""
    return {
        'voices': [
            {
                'id': voice_id,
                'name': info['name'],
                'gender': info['gender'],
                'style': info['style'],
            }
            for voice_id, info in VOICES.items()
        ],
        'default': 'ja-JP-NanamiNeural',
    }


@app.post('/api/tts/generate', response_model=TTSResponse)
async def generate_tts(req: TTSRequest):
    """Generate speech audio from text."""
    try:
        audio_bytes = await synthesize(req.text, req.voice)

        if not audio_bytes:
            raise HTTPException(status_code=500, detail='TTS generated empty audio')

        audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')

        return TTSResponse(audio=audio_b64, format='wav', sampleRate=24000)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f'TTS error: {str(e)}')


@app.get('/api/health')
async def health():
    return {'status': 'ok', 'engine': 'edge-tts'}


# ── Main ──

if __name__ == '__main__':
    import uvicorn
    print('🎤 Chat AI TTS Server starting...')
    print('   Engine: Edge TTS (Microsoft)')
    print('   Default Voice: ja-JP-NanamiNeural (七海 Nanami)')
    print('   Endpoint: http://localhost:5000')
    print('   API Docs: http://localhost:5000/docs')
    uvicorn.run(app, host='0.0.0.0', port=5000)
