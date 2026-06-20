'use client'

import { motion } from 'framer-motion'

const categories = ['Transport', 'Electricity', 'Food', 'Shopping', 'Travel']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Intensity 0–1 per cell (mocked realistic data)
const heatData: Record<string, number[]> = {
  Transport:   [0.75, 0.70, 0.80, 0.65, 0.60, 0.55, 0.60, 0.58, 0.55, 0.90, 0.72, 0.68],
  Electricity: [0.85, 0.80, 0.70, 0.55, 0.40, 0.35, 0.45, 0.42, 0.50, 0.65, 0.78, 0.88],
  Food:        [0.50, 0.48, 0.52, 0.46, 0.42, 0.44, 0.50, 0.48, 0.45, 0.55, 0.58, 0.62],
  Shopping:    [0.30, 0.25, 0.60, 0.28, 0.30, 0.32, 0.35, 0.45, 0.30, 0.40, 0.70, 0.90],
  Travel:      [0.20, 0.15, 0.40, 0.55, 0.70, 0.80, 0.95, 0.85, 0.50, 0.20, 0.15, 0.10],
}

function getColor(intensity: number): string {
  if (intensity < 0.2) return 'rgba(16,185,129,0.12)'
  if (intensity < 0.4) return 'rgba(16,185,129,0.28)'
  if (intensity < 0.6) return 'rgba(16,185,129,0.50)'
  if (intensity < 0.75) return 'rgba(245,158,11,0.55)'
  if (intensity < 0.9) return 'rgba(249,115,22,0.65)'
  return 'rgba(239,68,68,0.75)'
}

function getLabelColor(intensity: number): string {
  return intensity > 0.55 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'
}

const categoryColors: Record<string, string> = {
  Transport: '#6366f1',
  Electricity: '#f59e0b',
  Food: '#10b981',
  Shopping: '#ec4899',
  Travel: '#3b82f6',
}

export default function CarbonHeatmap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 28,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Carbon Heatmap</h2>
          <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>Emission intensity by category × month</p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#52525b' }}>Low</span>
          {['rgba(16,185,129,0.25)', 'rgba(16,185,129,0.5)', 'rgba(245,158,11,0.55)', 'rgba(249,115,22,0.65)', 'rgba(239,68,68,0.75)'].map((c, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: c }} />
          ))}
          <span style={{ fontSize: 11, color: '#52525b' }}>High</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 640 }}>
          {/* Month headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(12, 1fr)', gap: 4, marginBottom: 4 }}>
            <div />
            {months.map(m => (
              <div key={m} style={{ textAlign: 'center', fontSize: 11, color: '#52525b', fontWeight: 600, padding: '2px 0' }}>{m}</div>
            ))}
          </div>

          {/* Category rows */}
          {categories.map((cat, ci) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + ci * 0.07 }}
              style={{ display: 'grid', gridTemplateColumns: '110px repeat(12, 1fr)', gap: 4, marginBottom: 4, alignItems: 'center' }}
            >
              {/* Category label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: categoryColors[cat], flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa' }}>{cat}</span>
              </div>

              {/* Heat cells */}
              {heatData[cat].map((val, mi) => (
                <motion.div
                  key={mi}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 + ci * 0.07 + mi * 0.015, duration: 0.3 }}
                  title={`${cat} – ${months[mi]}: ${(val * 100).toFixed(0)}% intensity`}
                  style={{
                    height: 36, borderRadius: 7,
                    background: getColor(val),
                    border: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'default', transition: 'transform 0.15s',
                    fontSize: 10, fontWeight: 700,
                    color: getLabelColor(val),
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; (e.currentTarget as HTMLElement).style.zIndex = '10' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.zIndex = '1' }}
                >
                  {(val * 100).toFixed(0)}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
