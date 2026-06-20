'use client'

import { motion } from 'framer-motion'
import {
  BarChart2, Zap, MessageSquare, Trophy, Award,
  ClipboardList, ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: ClipboardList,
    title: 'Carbon Assessment',
    badge: 'Start Here',
    badgeColor: '#10b981',
    desc: 'A beautiful 7-step onboarding flow that builds your AI carbon twin from your real lifestyle — transport, diet, energy, travel, and more.',
    href: '/assessment',
    gradient: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    glow: '#10b981',
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    badge: 'Data Intelligence',
    badgeColor: '#6366f1',
    desc: 'A premium analytics hub with animated metric cards, a carbon heatmap, trend charts, breakdown pie chart, and AI-generated sustainability insights.',
    href: '/dashboard',
    gradient: 'rgba(99,102,241,0.07)',
    border: 'rgba(99,102,241,0.2)',
    glow: '#6366f1',
  },
  {
    icon: Zap,
    title: 'Future Impact Simulator',
    badge: 'Flagship Feature',
    badgeColor: '#f59e0b',
    desc: 'The "what-if" engine. Simulate switching to public transit, renewables, or a plant-based diet — and see your 10-year carbon trajectory change live.',
    href: '/simulator',
    gradient: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.2)',
    glow: '#f59e0b',
  },
  {
    icon: MessageSquare,
    title: 'AI Eco Coach',
    badge: 'Smart AI',
    badgeColor: '#a855f7',
    desc: 'ChatGPT-style conversational AI that knows your carbon profile and gives you hyper-personalised advice, 30-day action plans, and real-time coaching.',
    href: '/coach',
    gradient: 'rgba(168,85,247,0.07)',
    border: 'rgba(168,85,247,0.2)',
    glow: '#a855f7',
  },
  {
    icon: Award,
    title: 'Rewards & Gamification',
    badge: 'Motivation Engine',
    badgeColor: '#ec4899',
    desc: 'XP bars, level progression (Eco Rookie → Climate Hero), weekly challenges, achievement badges with rarity tiers, and confetti celebrations.',
    href: '/rewards',
    gradient: 'rgba(236,72,153,0.07)',
    border: 'rgba(236,72,153,0.2)',
    glow: '#ec4899',
  },
  {
    icon: Trophy,
    title: 'Community Leaderboard',
    badge: 'Social',
    badgeColor: '#f97316',
    desc: 'Global rankings with a gold/silver/bronze podium, animated rank changes, region filters, Most Improved leaderboard, and real-time community stats.',
    href: '/leaderboard',
    gradient: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.2)',
    glow: '#f97316',
  },
]

export default function Features() {
  return (
    <section id="features" style={{ background: '#050f0a', paddingTop: 96, paddingBottom: 96 }}>
      <div style={{ width: '100%', maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)', marginBottom: 80 }} />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
            6 Powerful Features
          </p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Everything You Need to{' '}
            <span style={{ color: '#34d399' }}>Own Your Carbon Future</span>
          </h2>
          <p style={{ fontSize: 15, color: '#71717a', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
            From your first carbon assessment to competing on a global leaderboard — all in one premium platform.
          </p>
        </motion.div>

        {/* 3-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.a
                key={i}
                href={f.href}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.01 }}
                style={{
                  display: 'block', textDecoration: 'none',
                  background: f.gradient,
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: 20, padding: '24px 26px',
                  position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = f.border
                  el.style.boxShadow = `0 0 32px ${f.glow}18`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Corner glow */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100,
                  background: `radial-gradient(circle, ${f.glow}18 0%, transparent 70%)`, pointerEvents: 'none' }} />

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 13,
                    background: `${f.glow}18`, border: `1px solid ${f.glow}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={f.glow} />
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: f.badgeColor,
                    background: `${f.badgeColor}15`, border: `1px solid ${f.badgeColor}25`,
                    padding: '3px 10px', borderRadius: 99, letterSpacing: '0.03em',
                  }}>
                    {f.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.65, margin: '0 0 20px' }}>
                  {f.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: f.glow, fontWeight: 600 }}>
                  Explore feature <ArrowRight size={13} />
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Bottom CTA row */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          style={{ marginTop: 40, textAlign: 'center' }}>
          <a href="/assessment"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14,
              background: '#10b981', color: '#000', fontSize: 14, fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 0 32px rgba(16,185,129,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 48px rgba(16,185,129,0.5)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(16,185,129,0.35)' }}>
            <ClipboardList size={16} /> Start Your Free Assessment
          </a>
          <p style={{ fontSize: 12, color: '#3f3f46', marginTop: 12 }}>No account required · Takes 3 minutes · Instant results</p>
        </motion.div>
      </div>
    </section>
  )
}
