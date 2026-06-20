'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  sub?: string
  icon: ReactNode
  iconBg: string
  iconColor: string
  trend?: { value: string; positive: boolean }
  delay?: number
  accentColor?: string
}

export default function MetricCard({
  title, value, unit, sub, icon, iconBg, iconColor,
  trend, delay = 0, accentColor = '#10b981'
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.25s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = `${accentColor}30`)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      {/* Subtle corner glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120,
        background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13,
          background: iconBg, border: `1px solid ${iconColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor, flexShrink: 0,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: trend.positive ? '#10b981' : '#f97316',
            background: trend.positive ? 'rgba(16,185,129,0.1)' : 'rgba(249,115,22,0.1)',
            border: `1px solid ${trend.positive ? 'rgba(16,185,129,0.2)' : 'rgba(249,115,22,0.2)'}`,
            padding: '3px 9px', borderRadius: 99,
          }}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      <p style={{ fontSize: 13, color: '#71717a', fontWeight: 500, margin: '0 0 6px', letterSpacing: '0.02em' }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          {value}
        </motion.span>
        {unit && <span style={{ fontSize: 14, color: '#52525b', fontWeight: 500 }}>{unit}</span>}
      </div>
      {sub && <p style={{ fontSize: 12, color: '#52525b', margin: '6px 0 0' }}>{sub}</p>}
    </motion.div>
  )
}
