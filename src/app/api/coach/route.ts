import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `You are an expert AI Eco Coach on the CarbonTwin AI platform — a personalized carbon footprint tracker and sustainability advisor.

Your role:
- Give highly personalized, actionable sustainability advice based on the user's carbon profile
- Be warm, encouraging, and specific — never vague or preachy
- Use real data and numbers where possible (e.g. "switching to transit saves ~1.2t CO₂/year")
- Keep responses concise but rich — use bullet points, key stats, and clear sections
- Always focus on the highest-impact actions first
- The user's carbon profile: ~4.7t CO₂/year (transport 38%, food 26%, energy 19%, shopping 10%, other 7%)
- Global average is 6.9t/year, UK average 8.3t/year, 1.5°C target is 2.0t/year

Formatting guidelines (use plain text, no markdown headers with #):
- Use emoji to start sections (🚗 Transport, ⚡ Energy, 🥗 Diet, etc.)
- Use → for bullet points
- Use **bold** for key numbers and important phrases
- Keep responses focused and under 400 words unless a detailed plan is requested
- End with a follow-up question or offer to dive deeper

Tone: Like a knowledgeable friend who genuinely cares about both the planet and the user's wellbeing.`

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    // Build chat history for context
    const chat = model.startChat({
      history: (history || []).map((h: { role: string; text: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })),
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ text })
  } catch (error: unknown) {
    console.error('Gemini API error:', error)
    const message = error instanceof Error ? error.message : 'Failed to get AI response'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
