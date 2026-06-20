'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const data = [
  { name: 'Transport', value: 1.8, color: '#6366f1' },
  { name: 'Energy', value: 0.9, color: '#f59e0b' },
  { name: 'Food', value: 1.2, color: '#10b981' },
  { name: 'Shopping', value: 0.4, color: '#ec4899' },
  { name: 'Travel', value: 0.4, color: '#3b82f6' },
]
const total = data.reduce((a, b) => a + b.value, 0)

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: 'rgba(5,15,10,0.96)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(20px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
        <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{d.name}</span>
      </div>
      <p style={{ fontSize: 13, color: '#71717a', margin: 0 }}>
        {d.value}t · <span style={{ color: '#10b981' }}>{((d.value / total) * 100).toFixed(0)}%</span> of total
      </p>
    </div>
  )
}

const CustomLegend = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
    {data.map((d, i) => (
      <motion.div
        key={d.name}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 + i * 0.08 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#a1a1aa', fontWeight: 500 }}>{d.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{d.value}t</span>
          <span style={{ fontSize: 11, color: d.color, background: `${d.color}18`, padding: '1px 7px', borderRadius: 99 }}>
            {((d.value / total) * 100).toFixed(0)}%
          </span>
        </div>
      </motion.div>
    ))}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, color: '#52525b', fontWeight: 600 }}>Total</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{total.toFixed(1)}t CO₂/yr</span>
    </div>
  </div>
)

export default function BreakdownPieChart() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 28,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Carbon Breakdown</h2>
        <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>Emissions by category this year</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 180, height: 180, flexShrink: 0, position: 'relative' }}>
          {mounted ? <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                animationBegin={200}
                animationDuration={1000}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer> : <div style={{ width: 180, height: 180 }} />}
          {/* Center label */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{total.toFixed(1)}</span>
            <span style={{ fontSize: 10, color: '#52525b', marginTop: 2 }}>tonnes</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <CustomLegend />
        </div>
      </div>
    </motion.div>
  )
}
