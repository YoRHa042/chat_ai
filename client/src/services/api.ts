const API_BASE = '/api'

export const api = {
  async health() {
    const res = await fetch(`${API_BASE}/health`)
    return res.json()
  },

  async startCall() {
    const res = await fetch(`${API_BASE}/call/start`, { method: 'POST' })
    return res.json()
  },

  async endCall() {
    const res = await fetch(`${API_BASE}/call/end`, { method: 'POST' })
    return res.json()
  },

  async getVoices() {
    const res = await fetch(`${API_BASE}/tts/voices`)
    return res.json()
  },
}
