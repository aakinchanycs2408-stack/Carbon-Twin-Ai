'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Leaf, Send, Plus, Sparkles, Copy, RotateCcw,
  ChevronRight, Car, Zap, UtensilsCrossed, Plane,
  TreePine, TrendingDown, Target, Calendar, User, ChevronDown,
  BarChart2, Lightbulb, CheckCircle2, ArrowRight, MessageSquare,
  ShoppingBag, Home, Activity
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: MessagePart[]
  timestamp: Date
}

interface MessagePart {
  type: 'text' | 'heading' | 'bullet' | 'callout' | 'stat' | 'spacer' | 'divider' | 'action'
  content: string
  icon?: string
  color?: string
  value?: string
  label?: string
}

// ─── Parse Gemini plain-text response into MessageParts ──────────────────────
function parseGeminiResponse(text: string): MessagePart[] {
  const lines = text.split('\n')
  const parts: MessagePart[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { parts.push({ type: 'spacer', content: '' }); continue }

    // Detect callout lines (start with 💡 📊 🎯 💬 🌍 ⚠)
    if (/^(💡|📊|🎯|💬|🌍|⚠️|⚠)/.test(line)) {
      parts.push({ type: 'callout', content: line, color: '#10b981' })
      continue
    }

    // Detect section headings (start with emoji and have short content)
    if (/^(🚗|⚡|🥗|🏠|🌱|📅|🔴|🟡|🚀|🛒|✈️|♻️|🥩|💰|🌿|📈|🔋|🌎)/.test(line) && line.length < 80) {
      const color = line.startsWith('🔴') ? '#ef4444'
        : line.startsWith('🟡') ? '#f59e0b'
        : line.startsWith('🌱') || line.startsWith('✅') ? '#10b981'
        : line.startsWith('⚡') ? '#f59e0b'
        : line.startsWith('🚗') || line.startsWith('✈️') ? '#6366f1'
        : '#10b981'
      parts.push({ type: 'heading', content: line, color })
      continue
    }

    // Detect bullet lines (→ or numbered like 1. 2.)
    const bulletMatch = line.match(/^(→|•|-|\d+\.|[✓✗⚠]|[✓✗]|\*{1,2}[A-Z])(.+)/)
    if (line.startsWith('→') || line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line) || line.startsWith('✓') || line.startsWith('⚠')) {
      const iconMatch = line.match(/^(→|•|-|\d+\.|✓|⚠)\s*/)
      const icon = iconMatch ? iconMatch[1] : '→'
      const content = line.replace(/^(→|•|-|\d+\.|✓|⚠)\s*/, '').trim()
      parts.push({ type: 'bullet', content, icon })
      continue
    }

    // Everything else is plain text
    parts.push({ type: 'text', content: line })
  }

  // Collapse consecutive spacers
  return parts.filter((p, i) => !(p.type === 'spacer' && parts[i - 1]?.type === 'spacer'))
}

// ─── Suggested prompts ────────────────────────────────────────────────────────
const SUGGESTED: { icon: React.ElementType; text: string; color: string }[] = [

]

// ─── Mock response matcher ───────────────────────────────────────────────────────
function matchResponse(input: string): MessagePart[] {
  const lower = input.toLowerCase();
  if (lower.includes('reduce') && lower.includes('carbon')) {
    return [
      { type: 'heading', content: '💡 Reduce Your Carbon Footprint', color: '#10b981' },
      { type: 'text', content: 'Here are three quick actions you can take today:' },
      { type: 'bullet', content: 'Switch to LED lighting', icon: '→' },
      { type: 'bullet', content: 'Take shorter showers', icon: '→' },
      { type: 'bullet', content: 'Use public transport or bike', icon: '→' },
    ];
  }
  if (lower.includes('habit') && lower.includes('hurting')) {
    return [
      { type: 'heading', content: '🚗 Your biggest emission sources', color: '#6366f1' },
      { type: 'text', content: 'Based on your profile, transport and diet are the top contributors.' },
    ];
  }
  if (lower.includes('score') && lower.includes('global')) {
    return [
      { type: 'heading', content: '📊 Global Score Comparison', color: '#f59e0b' },
      { type: 'text', content: 'You are in the top 35% worldwide! Keep up the great work.' },
    ];
  }
  // Default fallback
  return [{ type: 'text', content: `I’m here to help you with sustainability. Ask me anything!` }];
}



// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(parts: MessagePart[], active: boolean, speed = 12) {
  const [charCount, setCharCount] = useState(0)
  const [done, setDone] = useState(false)
  const totalChars = parts.reduce((a, p) => a + (p.content?.length ?? 0) + (p.value?.length ?? 0) + (p.label?.length ?? 0), 0)

  useEffect(() => {
    if (!active || done) return
    setCharCount(0)
    setDone(false)
    let c = 0
    const tick = setInterval(() => {
      c += 3
      setCharCount(c)
      if (c >= totalChars) { setCharCount(totalChars); setDone(true); clearInterval(tick) }
    }, speed)
    return () => clearInterval(tick)
  }, [active, parts])

  return { charCount, done, totalChars }
}

// ─── Message Part Renderer ────────────────────────────────────────────────────
function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((p, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>{p}</strong> : <span key={i}>{p}</span>)
}

function MessageContent({ parts, charCount, totalChars }: { parts: MessagePart[]; charCount: number; totalChars: number }) {
  let rendered = 0
  return (
    <div style={{ fontSize: 14, lineHeight: 1.7, color: '#a1a1aa' }}>
      {parts.map((part, i) => {
        const partLen = (part.content?.length ?? 0) + (part.value?.length ?? 0) + (part.label?.length ?? 0)
        const show = rendered < charCount
        const partial = rendered < charCount && rendered + partLen > charCount
        rendered += partLen

        if (!show && !partial) return null

        const sliceLen = partial ? charCount - (rendered - partLen) : partLen

        if (part.type === 'spacer') return <div key={i} style={{ height: 10 }} />
        if (part.type === 'divider') return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '12px 0' }} />

        if (part.type === 'heading') return (
          <div key={i} style={{ fontSize: 14, fontWeight: 700, color: part.color ?? '#fff', margin: '4px 0 6px', letterSpacing: '-0.01em' }}>
            {part.content.slice(0, sliceLen)}
          </div>
        )

        if (part.type === 'bullet') return (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 7 }}>
            <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0, minWidth: 20, fontSize: 13 }}>{part.icon}</span>
            <span style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.65 }}>{renderBold(part.content.slice(0, sliceLen))}</span>
          </div>
        )

        if (part.type === 'callout') return (
          <div key={i} style={{
            margin: '4px 0', padding: '12px 14px', borderRadius: 10,
            background: `${part.color ?? '#10b981'}12`,
            border: `1px solid ${part.color ?? '#10b981'}25`,
          }}>
            <p style={{ fontSize: 13, color: part.color ?? '#10b981', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
              {part.content.slice(0, sliceLen)}
            </p>
          </div>
        )

        if (part.type === 'stat') return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 7 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: part.color ?? '#10b981', minWidth: 52, fontVariantNumeric: 'tabular-nums' }}>
              {(part.value ?? '').slice(0, sliceLen)}
            </span>
            <span style={{ fontSize: 13, color: '#71717a' }}>{(part.label ?? '').slice(0, Math.max(0, sliceLen - (part.value?.length ?? 0)))}</span>
          </div>
        )

        if (part.type === 'action') return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 7, cursor: 'pointer' }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span style={{ fontSize: 13, color: '#34d399', fontWeight: 500 }}>{part.content.slice(0, sliceLen)}</span>
            <ArrowRight size={13} color="#10b981" style={{ marginLeft: 'auto' }} />
          </div>
        )

        return (
          <p key={i} style={{ fontSize: 14, color: '#a1a1aa', margin: '0 0 4px', lineHeight: 1.7 }}>
            {renderBold(part.content.slice(0, sliceLen))}
          </p>
        )
      })}
      {charCount < totalChars && (
        <span style={{ display: 'inline-block', width: 2, height: 14, background: '#10b981', borderRadius: 1, animation: 'blink 0.8s infinite', verticalAlign: 'text-bottom', marginLeft: 2 }} />
      )}
    </div>
  )
}

// ─── Chat message component ───────────────────────────────────────────────────
function ChatMessage({ msg, isLatest }: { msg: Message; isLatest: boolean }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'
  const { charCount, done, totalChars } = useTypewriter(msg.content, !isUser && isLatest)

  const plainText = msg.content.map(p => p.content || `${p.value} ${p.label}`).join(' ')

  function copy() {
    navigator.clipboard.writeText(plainText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <div style={{ maxWidth: '70%' }}>
          <div style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            borderRadius: '18px 18px 4px 18px',
            padding: '12px 16px',
            boxShadow: '0 4px 20px rgba(16,185,129,0.2)',
          }}>
            <p style={{ fontSize: 14, color: '#fff', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              {msg.content[0]?.content}
            </p>
          </div>
          <p style={{ fontSize: 11, color: '#3f3f46', margin: '4px 6px 0', textAlign: 'right' }}>
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-start' }}>
      {/* Avatar */}
      <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <Leaf size={16} color="#10b981" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>Eco Coach</span>
          <span style={{ fontSize: 11, color: '#3f3f46' }}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {!isLatest && (
            <span style={{ fontSize: 10, fontWeight: 600, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 7px', borderRadius: 99, border: '1px solid rgba(16,185,129,0.2)' }}>AI</span>
          )}
        </div>

        {/* Message bubble */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px', padding: '16px 18px', backdropFilter: 'blur(12px)' }}>
          <MessageContent
            parts={msg.content}
            charCount={isLatest ? charCount : totalChars}
            totalChars={totalChars}
          />
        </div>

        {/* Actions */}
        {(done || !isLatest) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#52525b', fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a1a1aa'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#52525b'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)' }}>
              <Copy size={11} />{copied ? 'Copied!' : 'Copy'}
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#52525b', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
              <RotateCcw size={11} /> Regenerate
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Leaf size={16} color="#10b981" />
      </div>
      <div style={{ paddingTop: 8 }}>
        <p style={{ fontSize: 12, color: '#10b981', fontWeight: 600, margin: '0 0 8px' }}>Eco Coach</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 5 }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', opacity: 0.7 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Welcome state ────────────────────────────────────────────────────────────
function WelcomeScreen({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      {/* Logo glow */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto' }}>
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
            <Sparkles size={30} color="#10b981" />
          </div>
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
        style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
        Your AI Eco Coach
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        style={{ fontSize: 15, color: '#52525b', maxWidth: 420, margin: '0 0 40px', lineHeight: 1.65 }}>
        I've analysed your Carbon Twin profile and I'm ready to give you hyper-personalised sustainability advice. Ask me anything.
      </motion.p>

      {/* Suggested prompts grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, width: '100%', maxWidth: 580 }}>
        {SUGGESTED.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.button key={i} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => onPrompt(s.text)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${s.color}30`}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={s.color} />
              </div>
              <span style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.4, fontWeight: 500 }}>{s.text}</span>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, typing])

  async function sendMessage(text: string) {
    if (!text.trim() || typing) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: [{ type: 'text', content: text.trim() }],
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    scrollToBottom()

    // Simulate network delay
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: matchResponse(text),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMsg])
    setTyping(false)
    scrollToBottom()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const hasMessages = messages.length > 0

  return (
    <div style={{ height: '100vh', background: '#050f0a', fontFamily: 'Inter, system-ui, sans-serif', color: '#f0fdf4', display: 'flex', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.015) 1px,transparent 1px)', backgroundSize: '72px 72px', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{
              width: 260, flexShrink: 0, height: '100vh',
              background: 'rgba(5,10,8,0.95)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column',
              position: 'relative', zIndex: 10,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Sidebar header */}
            <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Leaf size={13} color="#34d399" />
                </div>
                <span style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>Carbon<span style={{ color: '#34d399' }}>Twin</span> <span style={{ color: '#10b981', fontSize: 10 }}>AI</span></span>
              </Link>

              <button onClick={() => { setMessages([]); inputRef.current?.focus() }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 11, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                <Plus size={15} /> New Chat
              </button>
            </div>

            {/* Quick access */}
            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#3f3f46', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px 2px' }}>Quick Prompts</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {SUGGESTED.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <button key={i} onClick={() => sendMessage(s.text)}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10, background: 'transparent', border: 'none', color: '#71717a', fontSize: 12, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#e4e4e7' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#71717a' }}>
                      <Icon size={13} color={s.color} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.text}</span>
                    </button>
                  )
                })}
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
              <p style={{ fontSize: 10, fontWeight: 700, color: '#3f3f46', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px 2px' }}>Navigate</p>
              {[
                { icon: BarChart2, label: 'Dashboard', href: '/dashboard', color: '#6366f1' },
                { icon: Activity, label: 'Simulator', href: '/simulator', color: '#10b981' },
                { icon: Target, label: 'Assessment', href: '/assessment', color: '#f59e0b' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Link key={i} href={item.href}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10, color: '#71717a', fontSize: 12, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#e4e4e7' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#71717a' }}>
                    <Icon size={13} color={item.color} />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Profile footer */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={15} color="#10b981" />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7', margin: 0 }}>Your Profile</p>
                <p style={{ fontSize: 11, color: '#3f3f46', margin: 0 }}>4.7t CO₂/yr · Top 35%</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main chat area ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ padding: '0 20px', height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,10,8,0.8)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setSidebarOpen(p => !p)}
              style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', cursor: 'pointer' }}>
              <MessageSquare size={14} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#a1a1aa' }}>Eco Coach — AI-powered sustainability advisor</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/simulator" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', fontSize: 12, textDecoration: 'none' }}>
              <Activity size={12} /> Simulator
            </Link>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              <BarChart2 size={12} /> Dashboard
            </Link>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
            {!hasMessages ? (
              <WelcomeScreen onPrompt={text => sendMessage(text)} />
            ) : (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage key={msg.id} msg={msg} isLatest={i === messages.length - 1} />
                ))}
                {typing && <TypingIndicator />}
                <div ref={chatEndRef} />
              </>
            )}
          </div>
        </div>

        {/* ── Input bar ─────────────────────────────────────────────────────── */}
        <div style={{ padding: '16px 24px 20px', background: 'rgba(5,10,8,0.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            {/* Quick suggestion chips when chatting */}
            {hasMessages && !typing && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {SUGGESTED.slice(0, 3).map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.text)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.3)'; (e.currentTarget as HTMLElement).style.color = '#34d399' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#71717a' }}>
                    <ChevronRight size={11} />
                    {s.text.length > 36 ? s.text.slice(0, 36) + '…' : s.text}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, backdropFilter: 'blur(12px)', transition: 'border-color 0.2s', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.35)'}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your Eco Coach anything… (Enter to send, Shift+Enter for new line)"
                rows={1}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#e4e4e7', fontSize: 14, lineHeight: 1.6, resize: 'none',
                  fontFamily: 'inherit', maxHeight: 160, overflowY: 'auto',
                }}
                onInput={e => {
                  const t = e.currentTarget
                  t.style.height = 'auto'
                  t.style.height = Math.min(t.scrollHeight, 160) + 'px'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                style={{
                  width: 38, height: 38, borderRadius: 11, border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                  background: input.trim() && !typing ? '#10b981' : 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.2s',
                  boxShadow: input.trim() && !typing ? '0 0 16px rgba(16,185,129,0.4)' : 'none',
                }}>
                <Send size={16} color={input.trim() && !typing ? '#000' : '#3f3f46'} />
              </motion.button>
            </div>

            <p style={{ fontSize: 11, color: '#27272a', textAlign: 'center', marginTop: 8 }}>
              Eco Coach uses your Carbon Twin data to personalise all responses.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        textarea::placeholder { color: #3f3f46; }
      `}</style>
    </div>
  )
}
