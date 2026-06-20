'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  BarChart2, Zap, MessageSquare, Trophy, Award,
  ClipboardList, ArrowRight, Sparkles
} from 'lucide-react'

const features = [
  {
    icon: ClipboardList,
    title: 'Carbon Assessment',
    badge: 'Start Here',
    badgeColor: '#10b981',
    desc: 'A beautiful 7-step onboarding that builds your AI carbon twin from your real lifestyle — transport, diet, energy, travel, and more.',
    href: '/assessment',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 70%)',
    border: 'rgba(16,185,129,0.25)',
    glow: '#10b981',
    num: '01',
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    badge: 'Data Intelligence',
    badgeColor: '#6366f1',
    desc: 'Premium analytics with animated metric cards, carbon heatmap, trend charts, breakdown charts, and AI-generated sustainability insights.',
    href: '/dashboard',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 70%)',
    border: 'rgba(99,102,241,0.25)',
    glow: '#6366f1',
    num: '02',
  },
  {
    icon: Zap,
    title: 'Future Impact Simulator',
    badge: '✦ Flagship',
    badgeColor: '#f59e0b',
    desc: 'The "what-if" engine. Simulate switching to public transit, renewables, or a plant-based diet — see your 10-year carbon trajectory change live.',
    href: '/simulator',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 70%)',
    border: 'rgba(245,158,11,0.25)',
    glow: '#f59e0b',
    num: '03',
  },
  {
    icon: MessageSquare,
    title: 'AI Eco Coach',
    badge: 'Smart AI',
    badgeColor: '#a855f7',
    desc: 'Conversational AI that knows your carbon profile and gives hyper-personalised advice, 30-day action plans, and real-time coaching.',
    href: '/coach',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, transparent 70%)',
    border: 'rgba(168,85,247,0.25)',
    glow: '#a855f7',
    num: '04',
  },
  {
    icon: Award,
    title: 'Rewards & Gamification',
    badge: 'Motivation Engine',
    badgeColor: '#ec4899',
    desc: 'XP bars, level progression (Eco Rookie → Climate Hero), weekly challenges, achievement badges with rarity tiers, and confetti celebrations.',
    href: '/rewards',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, transparent 70%)',
    border: 'rgba(236,72,153,0.25)',
    glow: '#ec4899',
    num: '05',
  },
  {
    icon: Trophy,
    title: 'Community Leaderboard',
    badge: 'Social',
    badgeColor: '#f97316',
    desc: 'Global rankings with a gold/silver/bronze podium, animated rank changes, region filters, Most Improved leaderboard, and real-time community stats.',
    href: '/leaderboard',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 70%)',
    border: 'rgba(249,115,22,0.25)',
    glow: '#f97316',
    num: '06',
  },
]

function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const Icon = f.icon
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      ref={ref}
      href={f.href}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: f.gradient,
        border: `1px solid ${hovered ? f.border : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 22, padding: '26px 28px',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px ${f.glow}15, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Corner glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', top: -40, right: -40, width: 140, height: 140,
          background: `radial-gradient(circle, ${f.glow}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom glow line */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0.6 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(to right, transparent, ${f.glow}60, transparent)`,
          transformOrigin: 'center',
        }}
      />

      {/* Step number */}
      <div style={{
        position: 'absolute', top: 22, right: 24,
        fontSize: 11, fontWeight: 800, color: hovered ? f.glow : '#27272a',
        letterSpacing: '0.08em', transition: 'color 0.3s',
      }}>
        {f.num}
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
        <motion.div
          animate={{ boxShadow: hovered ? `0 0 20px ${f.glow}40` : '0 0 0px transparent' }}
          style={{
            width: 50, height: 50, borderRadius: 15,
            background: `${f.glow}18`, border: `1px solid ${f.glow}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background 0.3s',
          }}
        >
          <Icon size={22} color={f.glow} />
        </motion.div>
        <div style={{ paddingTop: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: f.badgeColor,
            background: `${f.badgeColor}14`, border: `1px solid ${f.badgeColor}28`,
            padding: '3px 10px', borderRadius: 99, letterSpacing: '0.04em',
            display: 'inline-block',
          }}>
            {f.badge}
          </span>
        </div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.015em' }}>
        {f.title}
      </h3>
      <p style={{ fontSize: 13.5, color: '#71717a', lineHeight: 1.7, margin: '0 0 22px' }}>
        {f.desc}
      </p>

      <motion.div
        animate={{ x: hovered ? 4 : 0, color: hovered ? f.glow : '#52525b' }}
        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, transition: 'color 0.2s' }}
      >
        Explore feature <ArrowRight size={13} />
      </motion.div>
    </motion.a>
  )
}

export default function Features() {
  return (
    <section id="features" style={{ background: '#050f0a', paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ width: '100%', maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.5), transparent)', marginBottom: 88 }} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Sparkles size={13} color="#10b981" />
            <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
              6 Powerful Features
            </p>
            <Sparkles size={13} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 18px', letterSpacing: '-0.025em' }}>
            Everything You Need to{' '}
            <span style={{ color: '#34d399' }}>Own Your Carbon Future</span>
          </h2>
          <p style={{ fontSize: 15.5, color: '#52525b', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            From your first carbon assessment to competing on a global leaderboard — one premium platform.
          </p>
        </motion.div>

        {/* 3-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="features-grid">
          {features.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 44, textAlign: 'center' }}
        >
          <a href="/assessment" className="btn-primary"
            style={{ padding: '14px 32px', borderRadius: 15, fontSize: 15, boxShadow: '0 0 36px rgba(16,185,129,0.4)' }}>
            <ClipboardList size={17} /> Start Your Free Assessment
          </a>
          <p style={{ fontSize: 12, color: '#3f3f46', marginTop: 12 }}>No account required · Takes 3 minutes · Instant results</p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
