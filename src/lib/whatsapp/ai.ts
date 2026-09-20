import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// sk-ant- → Claude Haiku, diğerleri → GPT-4o Mini
export async function generateReply(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  if (!apiKey) throw new Error('AI API key ayarlanmamış')

  if (apiKey.startsWith('sk-ant-')) {
    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
    const block = msg.content[0]
    if (block.type !== 'text') throw new Error('Beklenmedik Claude yanıt tipi')
    return block.text
  }

  const client = new OpenAI({ apiKey })
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  })
  return completion.choices[0].message.content ?? ''
}
