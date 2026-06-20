'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Zap, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

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
  },
  {
    type: 'positive',
    icon: TrendingDown,
    iconColor: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
    title: 'Emissions down 12% vs last quarter',
    desc: 'Great progress! Your transport habits improved. Maintaining this trajectory puts you on track for your 2026 twin target.',
    tag: 'Progress',
    tagColor: '#10b981',
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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Sustainability Insights</h2>
          <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>AI-generated patterns from your carbon data</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#10b981',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          padding: '3px 10px', borderRadius: 99,
        }}>
          {insights.length} insights
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.map((ins, i) => {
          const Icon = ins.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              style={{
                display: 'flex', gap: 14, padding: '14px 16px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'default', transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${ins.iconColor}25`
                ;(e.currentTarget as HTMLElement).style.background = `${ins.iconBg}`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: ins.iconBg, border: `1px solid ${ins.iconColor}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 2,
              }}>
                <Icon size={16} color={ins.iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#e4e4e7', margin: 0 }}>{ins.title}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: ins.tagColor,
                    background: `${ins.tagColor}18`, padding: '1px 7px', borderRadius: 99, flexShrink: 0,
                  }}>
                    {ins.tag}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#71717a', margin: 0, lineHeight: 1.6 }}>{ins.desc}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
