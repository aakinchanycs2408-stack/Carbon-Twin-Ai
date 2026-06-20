'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2, Users, TrendingDown, Zap } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: CheckCircle2, text: '3-minute setup'        },
  { icon: Zap,          text: 'AI-powered results'    },
  { icon: Users,        text: '20,847 members'         },
  { icon: TrendingDown, text: '100% free to start'    },
]

export default function CTA() {
  return (
    <section id="assessment" style={{ background: '#050f0a', paddingTop: 80, paddingBottom: 96 }}>
      <div className="container-main">
        <div className="divider" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', borderRadius: 28,
            overflow: 'hidden', padding: '88px 48px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Animated background glows */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(16,185,129,0.1) 0%, transparent 65%)', borderRadius: '50%' }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{ position: 'absolute', bottom: '-10%', right: '15%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
            />
            {/* Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.025) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.3), transparent)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 99,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                fontSize: 12, fontWeight: 700, color: '#34d399', marginBottom: 28,
              }}>
                <Sparkles size={13} />
                Free to Start · No Credit Card Required
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}
              style={{ fontSize: 'clamp(32px, 5.5vw, 58px)', fontWeight: 900, color: '#fff', lineHeight: 1.07, margin: '0 0 20px', letterSpacing: '-0.03em' }}>
              Start Seeing Your<br />
              <span style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 60%, #6ee7b7 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Carbon Shadow
              </span>{' '}Today.
            </motion.h2>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.26 }}
              style={{ fontSize: 16, color: '#71717a', maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.7 }}>
              Join thousands of people who've discovered the environmental cost of their lifestyle — and taken meaningful action to change it.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.32 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <motion.a id="cta-main-btn" href="/assessment"
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  padding: '14px 34px', borderRadius: 14,
                  background: '#10b981', color: '#000',
                  fontWeight: 800, fontSize: 15, textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  boxShadow: '0 0 32px rgba(16,185,129,0.3), 0 4px 16px rgba(0,0,0,0.3)',
                }}>
                Start Free Assessment
                <ArrowRight size={17} />
              </motion.a>
              <motion.a id="cta-demo-btn" href="/dashboard"
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 26px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#a1a1aa', fontWeight: 600, fontSize: 15, textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.35)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#a1a1aa' }}>
                View Demo Dashboard
              </motion.a>
            </motion.div>

            {/* Trust items */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
              {TRUST_ITEMS.map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#52525b' }}>
                  <Icon size={14} color="#10b981" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
