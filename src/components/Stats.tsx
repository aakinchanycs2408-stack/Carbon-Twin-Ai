'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, User, TrendingDown, Leaf, ArrowUpRight } from 'lucide-react'

const stats = [
  {
    Icon: Globe,
    value: 37.4, suffix: 'Gt', label: 'Global CO₂ Emissions',
    sub: 'Released globally in 2023', decimals: 1,
    color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)',
    context: '↑ 1.1% year over year',
  },
  {
    Icon: User,
    value: 6.9, suffix: 't', label: 'Avg Carbon Footprint',
    sub: 'Metric tons per person / year', decimals: 1,
    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)',
    context: '3× the 1.5°C safe target',
  },
  {
    Icon: TrendingDown,
    value: 43, suffix: '%', label: 'Potential CO₂ Savings',
    sub: 'Achievable through lifestyle changes', decimals: 0,
    color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)',
    context: 'Start today with 3 changes',
  },
]

function Counter({ value, suffix, decimals, color, trigger }: {
  value: number; suffix: string; decimals: number; color: string; trigger: boolean
}) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start: number
    const duration = 1600
    const animate = (now: number) => {
      if (!start) start = now
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(value * eased)
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(value)
    }
    requestAnimationFrame(animate)
  }, [trigger, value])
  return (
    <span style={{
      fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 900, color,
      fontVariantNumeric: 'tabular-nums', display: 'block',
      lineHeight: 1, letterSpacing: '-0.04em',
    }}>
      {count.toFixed(decimals)}{suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="stats" ref={ref} style={{ background: '#050f0a', paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 24, height: 1, background: '#059669', borderRadius: 99 }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
              The Numbers Don't Lie
            </p>
            <div style={{ width: 24, height: 1, background: '#059669', borderRadius: 99 }} />
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em' }}>
            The Climate Crisis,{' '}
            <span style={{ color: '#34d399' }}>In Numbers</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {stats.map((s, i) => {
            const Icon = s.Icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 22, padding: '36px 32px', textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = s.border
                  el.style.boxShadow = `0 20px 56px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Top glow */}
                <div style={{
                  position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                  width: 180, height: 120,
                  background: `radial-gradient(ellipse, ${s.color}12 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div style={{
                  width: 50, height: 50, borderRadius: 15,
                  background: s.bg, border: `1px solid ${s.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: `0 0 20px ${s.color}20`,
                }}>
                  <Icon size={22} color={s.color} />
                </div>

                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} color={s.color} trigger={inView} />

                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '12px 0 6px' }}>{s.label}</p>
                <p style={{ fontSize: 13, color: '#52525b', margin: '0 0 16px' }}>{s.sub}</p>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 600, color: s.color,
                  background: s.bg, border: `1px solid ${s.border}`,
                  padding: '3px 10px', borderRadius: 99,
                }}>
                  {s.context}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: 36 }}
        >
          <a href="/assessment"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#34d399', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#10b981'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#34d399'}
          >
            <Leaf size={14} />
            See where you fit into this picture
            <ArrowUpRight size={13} />
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #stats > div > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
