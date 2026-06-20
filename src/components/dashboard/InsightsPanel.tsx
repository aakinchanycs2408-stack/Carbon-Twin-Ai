'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Zap, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react'

const insights = [
  {
    type: 'warning',
    icon: AlertTriangle,
    iconColor: '#f97316',
    iconBg: 'rgba(249,115,22,0.1)',
    title: 'Peak emissions in winter months',
    desc: 'Your energy usage spikes 40% in Dec–Jan. Consider smart thermostat scheduling to cut heating costs and CO₂.',
    tag: 'Energy',
    tagColor: '#f59e0b',
    priority: '🔴 High',
  },
  {
    type: 'positive',
    icon: TrendingDown,
    iconColor: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
    title: 'Emissions down 12% vs last quarter',
    desc: 'Great progress! Your transport habits improved. Maintaining this trajectory puts you on track for your 2026 target.',
    tag: 'Progress',
    tagColor: '#10b981',
    priority: '🟢 Good',
  },
  {
    type: 'info',
    icon: Info,
    iconColor: '#3b82f6',
    iconBg: 'rgba(59,130,246,0.1)',
    title: 'Air travel is your biggest one-off emitter',
    desc: 'A single long-haul flight adds ~0.8t CO₂ — equivalent to 2 months of your regular transport footprint.',
    tag: 'Travel',
    tagColor: '#3b82f6',
    priority: '🟡 Medium',
  },
  {
    type: 'action',
    icon: Zap,
    iconColor: '#a855f7',
    iconBg: 'rgba(168,85,247,0.1)',
    title: 'Switch to renewable energy tariff',
    desc: 'Your energy provider offers a 100% renewable plan for the same price. This single switch could cut your energy footprint by 80%.',
    tag: 'Quick Win',
    tagColor: '#a855f7',
    priority: '✦ Action',
  },
  {
    type: 'positive',
    icon: CheckCircle2,
    iconColor: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
    title: 'Your diet score is excellent',
    desc: 'Your food carbon footprint is in the top 15% globally. Occasional plant-based swaps can push you even further.',
    tag: 'Food',
    tagColor: '#10b981',
    priority: '🟢 Good',
  },
]

export default function InsightsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 28,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Corner glow */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Sparkles size={14} color="#10b981" />
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.015em' }}>Sustainability Insights</h2>
          </div>
          <p style={{ fontSize: 12, color: '#52525b', margin: 0 }}>AI-generated patterns from your carbon data</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#10b981',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          padding: '4px 12px', borderRadius: 99,
        }}>
          {insights.length} insights
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.map((ins, i) => {
          const Icon = ins.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex', gap: 12, padding: '13px 14px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `3px solid ${ins.iconColor}50`,
                cursor: 'default', transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = `${ins.iconBg}`
                el.style.borderColor = `${ins.iconColor}30`
                el.style.borderLeftColor = `${ins.iconColor}80`
                el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.2)`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.02)'
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.borderLeftColor = `${ins.iconColor}50`
                el.style.boxShadow = 'none'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: ins.iconBg, border: `1px solid ${ins.iconColor}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}
              >
                <Icon size={15} color={ins.iconColor} />
              </motion.div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#e4e4e7', margin: 0 }}>{ins.title}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: ins.tagColor,
                    background: `${ins.tagColor}15`, padding: '1px 7px', borderRadius: 99, flexShrink: 0,
                  }}>
                    {ins.tag}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#71717a', margin: 0, lineHeight: 1.55 }}>{ins.desc}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

