'use client'

import { useEffect, useRef, useState } from 'react'
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

function useCountUp(target: number, duration = 900, delay = 0) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const started = useRef(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      started.current = true
      startRef.current = performance.now()
      const animate = (now: number) => {
        const elapsed = now - startRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(target * eased)
        if (progress < 1) frameRef.current = requestAnimationFrame(animate)
        else setDisplay(target)
      }
      frameRef.current = requestAnimationFrame(animate)
    }, delay * 1000)
    return () => { clearTimeout(timeout); cancelAnimationFrame(frameRef.current) }
  }, [target, duration, delay])

  return display
}

export default function MetricCard({
  title, value, unit, sub, icon, iconBg, iconColor,
  trend, delay = 0, accentColor = '#10b981'
}: MetricCardProps) {
  const isNumeric = typeof value === 'number' || (!isNaN(parseFloat(String(value))) && /^[\d.]+$/.test(String(value)))
  const numericValue = isNumeric ? parseFloat(String(value)) : 0
  const decimals = String(value).includes('.') ? (String(value).split('.')[1]?.length ?? 0) : 0
  const animated = useCountUp(numericValue, 1000, delay + 0.15)

  const displayValue = isNumeric
    ? animated.toFixed(decimals)
    : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accentColor}35`
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 140, height: 140,
        background: `radial-gradient(circle, ${accentColor}14 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${accentColor}50, transparent)`,
        borderRadius: '20px 20px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <motion.div
          whileHover={{ scale: 1.08, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            width: 44, height: 44, borderRadius: 13,
            background: iconBg, border: `1px solid ${iconColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: iconColor, flexShrink: 0,
            boxShadow: `0 0 16px ${iconColor}20`,
          }}
        >
          {icon}
        </motion.div>
        {trend && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 }}
            style={{
              fontSize: 11, fontWeight: 700,
              color: trend.positive ? '#10b981' : '#f97316',
              background: trend.positive ? 'rgba(16,185,129,0.1)' : 'rgba(249,115,22,0.1)',
              border: `1px solid ${trend.positive ? 'rgba(16,185,129,0.2)' : 'rgba(249,115,22,0.2)'}`,
              padding: '3px 9px', borderRadius: 99,
            }}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </motion.span>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#52525b', fontWeight: 600, margin: '0 0 5px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {title}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <motion.span
          key={String(displayValue)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.025em' }}
        >
          {displayValue}
        </motion.span>
        {unit && <span style={{ fontSize: 13, color: '#52525b', fontWeight: 500 }}>{unit}</span>}
      </div>
      {sub && <p style={{ fontSize: 11.5, color: '#3f3f46', margin: '7px 0 0', lineHeight: 1.5 }}>{sub}</p>}
    </motion.div>
  )
}
