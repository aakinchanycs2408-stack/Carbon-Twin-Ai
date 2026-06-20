'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const data = [
  { month: 'Jan', emissions: 5.2, target: 4.0 },
  { month: 'Feb', emissions: 4.9, target: 3.9 },
  { month: 'Mar', emissions: 5.4, target: 3.8 },
  { month: 'Apr', emissions: 4.7, target: 3.7 },
  { month: 'May', emissions: 4.3, target: 3.6 },
  { month: 'Jun', emissions: 3.9, target: 3.5 },
  { month: 'Jul', emissions: 4.1, target: 3.4 },
  { month: 'Aug', emissions: 3.8, target: 3.3 },
  { month: 'Sep', emissions: 3.6, target: 3.2 },
  { month: 'Oct', emissions: 4.7, target: 3.1 },
  { month: 'Nov', emissions: 4.2, target: 3.0 },
  { month: 'Dec', emissions: 3.9, target: 2.9 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(5,15,10,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(20px)',
    }}>
      <p style={{ fontSize: 12, color: '#71717a', margin: '0 0 8px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 13, color: '#d4d4d8', fontWeight: 500 }}>{p.name}:</span>
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{p.value}t</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyTrendChart() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: 28,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Monthly Trend</h2>
          <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>Your emissions vs. your AI twin's target path</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 12, color: '#71717a' }}>Your Emissions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1', opacity: 0.7 }} />
            <span style={{ fontSize: 12, color: '#71717a' }}>AI Target Path</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 240 }}>
        {!mounted ? <div style={{ height: 240 }} /> : <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="emissionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#52525b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#52525b' }} axisLine={false} tickLine={false} unit="t" />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="target" name="Target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 3" fill="url(#targetGrad)" dot={false} />
            <Area type="monotone" dataKey="emissions" name="Emissions" stroke="#10b981" strokeWidth={2.5} fill="url(#emissionsGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#050f0a', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>}
      </div>
    </motion.div>
  )
}
