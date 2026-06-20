'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// ─── Page Transition Wrapper ──────────────────────────────────────────────────
const variants = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Skeleton components ──────────────────────────────────────────────────────
export function SkeletonLine({ width = '100%', height = 14 }: { width?: string | number; height?: number }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: 4 }} />
  )
}

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return <div className="skeleton-card">{children}</div>
}

export function SkeletonMetricCard() {
  return (
    <div style={{ padding: '20px 22px', borderRadius: 18, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 11 }} />
        <div className="skeleton" style={{ width: 50, height: 20, borderRadius: 99 }} />
      </div>
      <div className="skeleton skeleton-title" style={{ width: '60%', marginBottom: 8 }} />
      <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 5, borderRadius: 99 }} />
    </div>
  )
}

export function SkeletonTableRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', marginBottom: 4 }}>
      <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
      <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: 6 }} />
        <div className="skeleton skeleton-text" style={{ width: '25%', height: 11 }} />
      </div>
      <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 8 }} />
      <div className="skeleton" style={{ width: 80, height: 6, borderRadius: 99 }} />
    </div>
  )
}

export function SkeletonChatMessage({ isUser = false }: { isUser?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 20 }}>
      {!isUser && <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 11, marginRight: 12, flexShrink: 0 }} />}
      <div style={{ maxWidth: '70%' }}>
        <div className="skeleton" style={{ height: isUser ? 44 : 80, borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px', marginBottom: 6 }} />
        <div className="skeleton" style={{ width: 50, height: 10, borderRadius: 3, marginLeft: isUser ? 'auto' : 0 }} />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div style={{ padding: '32px 24px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[0,1,2,3].map(i => <SkeletonMetricCard key={i} />)}
      </div>
      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[0,1].map(i => (
          <div key={i} style={{ padding: '24px', borderRadius: 20, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="skeleton skeleton-title" style={{ width: '40%', marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 180, borderRadius: 12 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  accentColor?: string
}

export function EmptyState({ icon, title, description, action, accentColor = '#10b981' }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="empty-state">
      <div className="empty-state-icon" style={{ borderColor: `${accentColor}20`, background: `${accentColor}10` }}>
        <div style={{ color: accentColor, opacity: 0.7 }}>{icon}</div>
      </div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e4e4e7', margin: '0 0 6px' }}>{title}</h3>
        <p style={{ fontSize: 13, color: '#52525b', margin: '0 0 16px', lineHeight: 1.6, maxWidth: 320 }}>{description}</p>
        {action}
      </div>
    </motion.div>
  )
}

// ─── Error state ─────────────────────────────────────────────────────────────
interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load this data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-state">
      <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#52525b', margin: '4px 0 16px', lineHeight: 1.6, maxWidth: 280 }}>{description}</p>
      {onRetry && (
        <button onClick={onRetry}
          style={{ padding: '8px 20px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Try Again
        </button>
      )}
    </motion.div>
  )
}

// ─── Loading spinner overlay ──────────────────────────────────────────────────
export function LoadingOverlay({ label = 'Loading…' }: { label?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(5,15,10,0.85)', backdropFilter: 'blur(8px)', zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      {/* Orbital spinner */}
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(16,185,129,0.15)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#10b981', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#34d399', animation: 'spin 1.2s linear infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</div>
      </div>
      <p style={{ fontSize: 14, color: '#71717a', fontWeight: 500 }}>{label}</p>
    </motion.div>
  )
}

// ─── Top progress bar ─────────────────────────────────────────────────────────
export function TopProgressBar({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: [1, 1, 0] }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], times: [0, 0.7, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2.5, zIndex: 9999,
        background: 'linear-gradient(90deg, #10b981, #34d399, #6366f1)',
        transformOrigin: 'left',
        boxShadow: '0 0 12px rgba(16,185,129,0.7)',
      }}
    />
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({ value, duration = 800, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    if (from === to) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      const cur = from + (to - from) * ease
      setDisplay(cur)
      if (t < 1) requestAnimationFrame(tick)
      else { setDisplay(to); prevRef.current = to }
    }
    requestAnimationFrame(tick)
  }, [value, duration])

  return <>{Math.round(display).toLocaleString()}{suffix}</>
}
