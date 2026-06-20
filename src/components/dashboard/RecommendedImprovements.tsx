'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Car, Leaf, ShoppingBag, Plane, Home } from 'lucide-react'

const improvements = [
  {
    icon: Car,
    color: '#6366f1',
    title: 'Switch to an electric vehicle',
    desc: 'Replacing your petrol car with an EV reduces your transport footprint by up to 65% over its lifetime.',
    saving: '1.2t CO₂/yr',
    effort: 'High effort',
    effortColor: '#f97316',
    impact: 85,
  },
  {
    icon: Zap,
    color: '#f59e0b',
    title: 'Move to a renewable energy tariff',
    desc: 'Switch your home energy to 100% renewable. Same price, 80% less carbon from your electricity.',
    saving: '0.8t CO₂/yr',
    effort: 'Low effort',
    effortColor: '#10b981',
    impact: 72,
  },
  {
    icon: Leaf,
    color: '#10b981',
    title: 'Adopt a flexitarian diet',
    desc: 'Cutting meat from 2 meals per day to 1 can reduce your food emissions by nearly 40%.',
    saving: '0.6t CO₂/yr',
    effort: 'Medium effort',
    effortColor: '#f59e0b',
    impact: 60,
  },
  {
    icon: Plane,
    color: '#3b82f6',
    title: 'Replace one flight with rail travel',
    desc: 'A London–Paris train emits 90% less CO₂ than the same flight. Many routes now have overnight options.',
    saving: '0.5t CO₂/yr',
    effort: 'Medium effort',
    effortColor: '#f59e0b',
    impact: 50,
  },
  {
    icon: ShoppingBag,
    color: '#ec4899',
    title: 'Buy secondhand clothing',
    desc: 'Choosing secondhand for 50% of your purchases halves the carbon embedded in your wardrobe each year.',
    saving: '0.2t CO₂/yr',
    effort: 'Low effort',
    effortColor: '#10b981',
    impact: 35,
  },
  {
    icon: Home,
    color: '#a855f7',
    title: 'Install smart home energy management',
    desc: 'Smart thermostats and energy monitors typically cut home energy use by 15–20% with minimal behavior change.',
    saving: '0.3t CO₂/yr',
    effort: 'Low effort',
    effortColor: '#10b981',
    impact: 42,
  },
]

export default function RecommendedImprovements() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 28,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Recommended Improvements</h2>
          <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>Ranked by potential CO₂ reduction</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#10b981',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
          padding: '3px 10px', borderRadius: 99,
        }}>
          Save up to 3.6t/yr
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {improvements.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              style={{
                padding: '18px 18px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.18s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${item.color}35`
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              {/* Corner glow */}
              <div style={{
                position: 'absolute', top: -30, right: -30, width: 90, height: 90,
                background: `radial-gradient(circle, ${item.color}14 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${item.color}15`, border: `1px solid ${item.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={item.color} />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: item.effortColor,
                  background: `${item.effortColor}14`,
                  padding: '2px 8px', borderRadius: 99,
                }}>
                  {item.effort}
                </span>
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e4e4e7', margin: '0 0 6px', lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontSize: 12, color: '#71717a', margin: '0 0 14px', lineHeight: 1.55 }}>{item.desc}</p>

              {/* Impact bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#52525b' }}>Impact score</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.impact}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.impact}%` }}
                    transition={{ delay: 0.7 + i * 0.07, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', borderRadius: 99, background: item.color }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: '#10b981',
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  padding: '3px 10px', borderRadius: 99,
                }}>
                  {item.saving}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: item.color, fontWeight: 600 }}>
                  Start now <ArrowRight size={13} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
