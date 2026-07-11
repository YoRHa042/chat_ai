"""
Edge TTS engine — uses Microsoft Edge's free neural TTS.
Provides high-quality Japanese anime-style voices.
"""

import asyncio
import edge_tts
import io
import base64

# Supported Japanese voices
VOICES = {
    'ja-JP-NanamiNeural': {'name': '七海 (Nanami)', 'gender': 'female', 'style': '自然温暖'},
    'ja-JP-AoiNeural': {'name': '葵 (Aoi)', 'gender': 'female', 'style': '年轻活泼'},
    'ja-JP-MayuNeural': {'name': '真由 (Mayu)', 'gender': 'female', 'style': '可爱甜美'},
    'ja-JP-ShioriNeural': {'name': '栞 (Shiori)', 'gender': 'female', 'style': '清晰知性'},
    'ja-JP-NaokiNeural': {'name': '直樹 (Naoki)', 'gender': 'male', 'style': '年轻自信'},
}


async def synthesize(text: str, voice: str = 'ja-JP-NanamiNeural') -> bytes:
    """
    Generate speech audio from text using Edge TTS.

    Args:
        text: The text to convert to speech
        voice: Edge TTS voice ID (default: ja-JP-NanamiNeural)

    Returns:
        WAV audio bytes
    """
    if not text.strip():
        return b''

    communicate = edge_tts.Communicate(text, voice)
    audio_chunks = []

    async for chunk in communicate.stream():
        if chunk['type'] == 'audio':
            audio_chunks.append(chunk['data'])

    return b''.join(audio_chunks)


def synthesize_sync(text: str, voice: str = 'ja-JP-NanamiNeural') -> str:
    """
    Synchronous wrapper — returns base64-encoded WAV.
    Used when async isn't available.
    """
    if not text.strip():
        return ''

    async def _run():
        return await synthesize(text, voice)

    audio_bytes = asyncio.run(_run())
    return base64.b64encode(audio_bytes).decode('utf-8')
