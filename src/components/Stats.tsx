'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, User, TrendingDown } from 'lucide-react'

const stats = [
  { Icon: Globe, value: 37.4, suffix: 'Gt', label: 'Global Emissions', sub: 'CO₂ released in 2023', decimals: 1 },
  { Icon: User, value: 6.9, suffix: 't', label: 'Avg Carbon Footprint', sub: 'Metric tons per person / year', decimals: 1 },
  { Icon: TrendingDown, value: 43, suffix: '%', label: 'Potential CO₂ Savings', sub: 'Achievable through lifestyle changes', decimals: 0 },
]

function Counter({ value, suffix, decimals, trigger }: { value: number; suffix: string; decimals: number; trigger: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let c = 0
    const timer = setInterval(() => {
      c += value / 60
      if (c >= value) { setCount(value); clearInterval(timer) } else setCount(c)
    }, 25)
    return () => clearInterval(timer)
  }, [trigger, value])
  return <span style={{ fontSize: 42, fontWeight: 900, color: '#34d399', fontVariantNumeric: 'tabular-nums', display: 'block', marginBottom: 8 }}>{count.toFixed(decimals)}{suffix}</span>
}

const iconBox: React.CSSProperties = {
  width: 44, height: 44, borderRadius: 12,
  background: 'rgba(16,185,129,0.1)',
  border: '1px solid rgba(16,185,129,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#34d399', margin: '0 auto 20px',
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="stats" ref={ref} style={{ background: '#050f0a', paddingTop: 96, paddingBottom: 96 }}>
      <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>The Numbers Don't Lie</p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,38px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: 0 }}>
            The Climate Crisis, <span style={{ color: '#34d399' }}>In Numbers</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {stats.map((s, i) => {
            const Icon = s.Icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32, textAlign: 'center', transition: 'border-color 0.25s, transform 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                <div style={iconBox}><Icon size={20} /></div>
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} trigger={inView} />
                <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{s.label}</p>
                <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>{s.sub}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
