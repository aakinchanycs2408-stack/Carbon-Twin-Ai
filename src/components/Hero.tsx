'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Leaf, TrendingDown, Users, Award } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ─── Particle field ───────────────────────────────────────────────────────────
function Particles() {
  const [mounted, setMounted] = useState(false)
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 0, y: 0, size: 1, opacity: 0.15, duration: 6, delay: 0,
    }))
  )

  useEffect(() => {
    particles.current = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.35,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 4,
    }))
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.current.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -20, 0], opacity: [p.opacity, p.opacity * 1.8, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: `0 0 ${p.size * 3}px rgba(16,185,129,0.6)`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Morphing orb ─────────────────────────────────────────────────────────────
function MorphingOrb() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.12, 1],
        rotate: [0, 8, -4, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 500,
        background: 'radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)',
        borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
    />
  )
}

// ─── Floating metric badge ────────────────────────────────────────────────────
function FloatingBadge({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { delay: 1.4 + delay, duration: 0.5 },
        scale:   { delay: 1.4 + delay, duration: 0.5 },
        y:       { delay: 1.4 + delay, duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'absolute',
        background: 'rgba(5,15,10,0.9)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: 14, padding: '10px 16px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.08)',
        ...style,
      }}>
      {children}
    </motion.div>
  )
}

// ─── Animated dashboard preview ───────────────────────────────────────────────
function DashboardMockup() {
  const bars = [40, 55, 38, 70, 52, 35, 60, 75, 45, 80, 65, 90]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        maxWidth: 660, margin: '0 auto',
        borderRadius: 22, overflow: 'hidden',
        background: 'rgba(5,12,9,0.8)',
        border: '1px solid rgba(16,185,129,0.15)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(239,68,68,0.6)', boxShadow: '0 0 6px rgba(239,68,68,0.3)' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(234,179,8,0.6)',  boxShadow: '0 0 6px rgba(234,179,8,0.3)'  }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(16,185,129,0.6)', boxShadow: '0 0 6px rgba(16,185,129,0.3)'  }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: '#3f3f46', fontFamily: 'monospace', background: 'rgba(255,255,255,0.03)', padding: '2px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
            app.carbontwin.ai/dashboard
          </span>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { label: 'Carbon Score',    value: '4.2t',  sub: '↓ 12% this month',  color: '#34d399' },
          { label: 'Twin Projection', value: '2.1t',  sub: 'by 2026 on path',   color: '#6366f1' },
          { label: 'Global Average',  value: '6.9t',  sub: 'you\'re 39% below', color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 + i * 0.1 }}
            style={{ padding: '16px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', textAlign: 'left' }}>
            <p style={{ fontSize: 10, color: '#52525b', margin: '0 0 5px', letterSpacing: '0.04em' }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: s.color, margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</p>
            <p style={{ fontSize: 10, color: '#3f3f46', margin: '4px 0 0' }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ padding: '18px 18px 14px' }}>
        <p style={{ fontSize: 10, color: '#52525b', margin: '0 0 12px', letterSpacing: '0.04em' }}>MONTHLY EMISSIONS · 12-MONTH TREND</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 56 }}>
          {bars.map((h, i) => (
            <motion.div key={i}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${h}%`, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
              style={{
                flex: 1, borderRadius: '3px 3px 2px 2px',
                background: i >= 9
                  ? `linear-gradient(180deg, #34d399, #10b981)`
                  : 'rgba(16,185,129,0.12)',
                boxShadow: i >= 9 ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
              }}
            />
          ))}
        </div>
        {/* Trend line overlay text */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 10, color: '#3f3f46' }}>Jan</span>
          <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>↓ 22% reduction trend</span>
          <span style={{ fontSize: 10, color: '#3f3f46' }}>Dec</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#050f0a' }}>

      {/* Layered background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        {/* Radial vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to bottom, transparent, #050f0a)' }} />
        <MorphingOrb />
        <Particles />
      </div>

      <motion.div variants={container} initial="hidden" animate="show"
        className="container-main"
        style={{ paddingTop: 130, paddingBottom: 80, textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Eyebrow badge */}
        <motion.div variants={item} style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <motion.span
            whileHover={{ scale: 1.04 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 99,
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.2)',
              fontSize: 12, fontWeight: 700, color: '#34d399',
              letterSpacing: '0.04em', cursor: 'default',
              boxShadow: '0 0 20px rgba(16,185,129,0.1)',
            }}>
            <Sparkles size={13} />
            AI-Powered Carbon Intelligence Platform
            <span className="glow-dot" />
          </motion.span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={item} style={{
          fontSize: 'clamp(42px, 7.5vw, 84px)',
          fontWeight: 900, lineHeight: 1.04,
          letterSpacing: '-0.035em', color: '#fff',
          margin: '0 0 8px',
        }}>
          Your Lifestyle Has
        </motion.h1>
        <motion.h1 variants={item} style={{
          fontSize: 'clamp(42px, 7.5vw, 84px)',
          fontWeight: 900, lineHeight: 1.04,
          letterSpacing: '-0.035em',
          background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #6ee7b7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 28px',
        }}>
          A Carbon Shadow.
        </motion.h1>

        {/* Subheading */}
        <motion.p variants={item} style={{
          fontSize: 'clamp(15px, 2vw, 19px)', color: '#71717a',
          lineHeight: 1.65, maxWidth: 560, margin: '0 auto 44px',
          fontWeight: 400,
        }}>
          CarbonTwin AI creates a{' '}
          <span style={{ color: '#a1a1aa', fontWeight: 500 }}>personalised digital twin</span> of your daily
          habits — then shows you exactly how your choices are shaping the future of our planet.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <motion.a href="/assessment" id="hero-start-cta"
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 14,
              background: 'linear-gradient(135deg, #10b981, #0ea472)',
              color: '#000', fontWeight: 800, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 0 32px rgba(16,185,129,0.45), 0 4px 20px rgba(0,0,0,0.3)',
              letterSpacing: '-0.01em', position: 'relative', overflow: 'hidden',
            }}
          >
            <span style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 60%)',
              borderRadius: 'inherit',
            }} />
            Start Free Assessment
            <ArrowRight size={17} />
          </motion.a>

          <motion.a href="/dashboard" id="hero-demo-btn"
            whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 28px', borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontWeight: 600, fontSize: 15,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={11} color="#34d399" style={{ marginLeft: 2 }} />
            </span>
            Live Dashboard
          </motion.a>
        </motion.div>

        {/* Social proof */}
        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 64, flexWrap: 'wrap' }}>
          {[
            { icon: Users,        text: '20,847 members', color: '#10b981' },
            { icon: TrendingDown, text: '142t CO₂ saved',  color: '#34d399' },
            { icon: Award,        text: '4.9★ rating',     color: '#f59e0b' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 16px' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#52525b' }}>
                  <Icon size={13} color={s.color} />
                  <span style={{ fontWeight: 600 }}>{s.text}</span>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Dashboard mockup */}
        <div style={{ position: 'relative' }}>
          <DashboardMockup />

          {/* Floating badges */}
          <FloatingBadge style={{ top: '10%', left: '-4%' }} delay={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌱</div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#10b981', margin: 0 }}>Level Up!</p>
                <p style={{ fontSize: 10, color: '#52525b', margin: 0 }}>Carbon Crusher</p>
              </div>
            </div>
          </FloatingBadge>

          <FloatingBadge style={{ top: '10%', right: '-4%' }} delay={0.3}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', margin: 0 }}>+150 XP</p>
                <p style={{ fontSize: 10, color: '#52525b', margin: 0 }}>Challenge done</p>
              </div>
            </div>
          </FloatingBadge>

          <FloatingBadge style={{ bottom: '-4%', left: '12%' }} delay={0.6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🏆</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', margin: 0 }}>Rank #9 Global</p>
                <p style={{ fontSize: 10, color: '#52525b', margin: 0 }}>Top 35% worldwide</p>
              </div>
            </div>
          </FloatingBadge>

          {/* Glow beneath mockup */}
          <div style={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)', width: 600, height: 140, background: 'radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(8px)' }} />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#27272a', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Scroll to explore</span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 16, height: 28, borderRadius: 99, border: '1px solid #27272a', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 5 }}>
          <div style={{ width: 4, height: 6, borderRadius: 99, background: '#10b981' }} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
      `}</style>
    </section>
  )
}
