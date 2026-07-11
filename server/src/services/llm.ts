import OpenAI from 'openai'
import { config } from '../config/index.js'

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
  baseURL: config.openaiBaseUrl,
})

export const llmService = {
  async chat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  ): Promise<string> {
    // If no API key, return mock response for development
    if (!config.openaiApiKey) {
      return getMockResponse(messages[messages.length - 1]?.content || '')
    }

    const response = await openai.chat.completions.create({
      model: config.llmModel,
      messages,
      max_tokens: 200,
      temperature: 0.8,
    })

    return response.choices[0]?.message?.content || 'ごめんね、ちょっと分からなかった…'
  },
}

// ── Mock responses for development without API key ──

const mockReplies = [
  'あの〜 这个问题好有趣！让我想想哦…我觉得是这样的呢！',
  'はい！我完全同意你的想法！すごい！你好厉害！',
  'えっと〜 其实我也有同感呢！我们真是心有灵犀呀~',
  '哈哈，和你聊天真的好开心！もっと話したいな〜',
  'なるほど！原来是这样啊！谢谢你告诉我这些！',
  'うーん…这个问题有点难呢。不过我会加油回答的！',
  '真的吗？すごい！我好想多了解一些呢！',
  'あのね〜 我觉得你是一个很有趣的人呢！',
]

let mockIndex = 0

function getMockResponse(userText: string): string {
  // Simple keyword-based mock responses
  const text = userText.toLowerCase()
  if (text.includes('你好') || text.includes('こんにちは')) {
    return 'こんにちは！今天过得好吗？我好开心能和你聊天呢！'
  }
  if (text.includes('再见') || text.includes('拜拜')) {
    return 'またね〜 下次再一起聊天吧！我会想你的！'
  }
  if (text.includes('谢谢')) {
    return 'どういたしまして！能帮到你我真的好开心！'
  }
  if (text.includes('喜欢')) {
    return 'えへへ〜 被夸奖了好害羞呢！我也很喜欢和你聊天！'
  }
  const reply = mockReplies[mockIndex % mockReplies.length]
  mockIndex++
  return reply
}
