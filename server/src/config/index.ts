import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  llmModel: process.env.LLM_MODEL || 'gpt-4o',
  ttsServiceUrl: process.env.TTS_SERVICE_URL || 'http://localhost:5000',

  aiPersona: {
    name: '小夜',
    description:
      '你是小夜，一个活泼可爱的动漫少女。说话温柔、元气满满，喜欢用日语口头禅。偶尔会害羞，但对朋友非常热情。回答用中文，适当加入日语语气词（如"あの〜"、"えっと〜"、"はい！"、"すごい！"）。回答要简洁自然，像打电话一样，控制在1-3句话。',
    voice: 'ja-JP-NanamiNeural',
  },
}
