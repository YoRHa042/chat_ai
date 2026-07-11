"""
GPT-SoVITS engine — reserved for future GPU-accelerated anime voice cloning.

Pre-trained models for anime characters are available at:
    https://huggingface.co/lpkpaco/Bocchi-The-Rock-GPT-SoVITS-Models

Setup:
    1. Install GPT-SoVITS: git clone https://github.com/RVC-Boss/GPT-SoVITS
    2. Download character model from Hugging Face
    3. Place model files in the appropriate directories
    4. Start the API server: python api_v2.py
    5. Set engine: gpt-sovits in voice_config.yaml

This module provides the client interface to GPT-SoVITS API.
"""

import base64
import requests


class GPTSovitsClient:
    """Client for GPT-SoVITS API server."""

    def __init__(self, api_url: str = 'http://localhost:9880'):
        self.api_url = api_url

    def set_model(self, gpt_model: str, sovits_model: str):
        """Set the GPT and SoVITS model weights."""
        resp = requests.get(f'{self.api_url}/set_model', params={
            'gpt_model': gpt_model,
            'sovits_model': sovits_model,
        })
        return resp.json()

    def synthesize(self, text: str, character_emotion: str = 'default') -> str:
        """
        Generate speech for the given text.

        Returns base64-encoded WAV audio.
        """
        resp = requests.post(f'{self.api_url}/tts', json={
            'text': text,
            'text_language': 'auto',
            'character_emotion': character_emotion,
            'stream': False,
        })

        if resp.status_code != 200:
            raise Exception(f'GPT-SoVITS error: {resp.text}')

        data = resp.json()
        # GPT-SoVITS returns audio as a file path or base64
        # This depends on the API version — adjust accordingly
        audio_path = data.get('audio_path', '')
        if audio_path:
            with open(audio_path, 'rb') as f:
                return base64.b64encode(f.read()).decode('utf-8')

        return data.get('audio', '')


# Singleton
gpt_sovits_client = GPTSovitsClient()
