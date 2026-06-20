'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ClipboardList, Dna, Gauge, Leaf, ArrowRight } from 'lucide-react'
import { useRef } from 'react'

const steps = [
  {
    num: '01', Icon: ClipboardList, color: '#10b981',
    title: 'Assess Your Lifestyle',
    desc: 'Answer our intelligent questionnaire about your daily commute, diet, home energy, travel habits, and shopping patterns. Takes under 5 minutes.',
    tags: ['Transport', 'Food', 'Energy', 'Shopping'],
  },
  {
    num: '02', Icon: Dna, color: '#6366f1',
    title: 'Generate Your Carbon Twin',
    desc: 'Our AI builds your unique digital carbon twin — a behavioral model that mirrors your exact lifestyle and calculates your real-time carbon fingerprint.',
    tags: ['AI Modeling', 'Behavior Mapping', 'Baseline'],
  },
  {
    num: '03', Icon: Gauge, color: '#f59e0b',
    title: 'Simulate Future Scenarios',
    desc: 'Run unlimited simulations. Test lifestyle changes and see their projected impact on your carbon footprint over 1, 5, and 10-year time horizons.',
    tags: ['Scenario Testing', 'Timeline Projection'],
  },
  {
    num: '04', Icon: Leaf, color: '#a855f7',
    title: 'Reduce & Track Progress',
    desc: 'Act on AI-generated recommendations and weekly missions. Track your real progress as your carbon twin updates with verified behavioral data.',
    tags: ['Personalized Actions', 'Progress Tracking'],
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  return (
    <section id="how-it-works" style={{ background: '#050f0a', paddingTop: 100, paddingBottom: 100 }}>
      <div ref={ref} style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 24, height: 1, background: '#059669', borderRadius: 99 }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
              The Process
            </p>
            <div style={{ width: 24, height: 1, background: '#059669', borderRadius: 99 }} />
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.025em' }}>
            From Habits to{' '}
            <span style={{ color: '#34d399' }}>Climate Action</span>
          </h2>
          <p style={{ fontSize: 15.5, color: '#52525b', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
            Four simple steps to transform your awareness into measurable environmental impact.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
          {steps.map((s, i) => {
            const Icon = s.Icon
            const isHovered = hoveredStep === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                onHoverStart={() => setHoveredStep(i)}
                onHoverEnd={() => setHoveredStep(null)}
                style={{
                  background: isHovered ? `${s.color}08` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isHovered ? s.color + '30' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 22, padding: '30px 28px',
                  transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
                  boxShadow: isHovered ? `0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px ${s.color}12` : 'none',
                  position: 'relative', overflow: 'hidden',
                  cursor: 'default',
                }}
              >
                {/* Corner radial glow */}
                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0.3 }}
                  style={{
                    position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                    background: `radial-gradient(circle, ${s.color}18 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Connector arrow for non-last items */}
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ opacity: isHovered ? 0.8 : 0 }}
                    style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 28, height: 28, borderRadius: '50%',
                      background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 12px ${s.color}60`,
                    }}
                  >
                    <ArrowRight size={12} color="#000" />
                  </motion.div>
                )}

                {/* Step number + icon row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <span style={{
                    fontSize: 42, fontWeight: 900, lineHeight: 1,
                    fontFamily: 'monospace', userSelect: 'none', minWidth: 56,
                    color: isHovered ? s.color + '60' : 'rgba(255,255,255,0.08)',
                    transition: 'color 0.3s',
                  }}>
                    {s.num}
                  </span>
                  <motion.div
                    animate={{ boxShadow: isHovered ? `0 0 20px ${s.color}50` : '0 0 0px transparent' }}
                    style={{
                      width: 44, height: 44, borderRadius: 13,
                      background: isHovered ? `${s.color}20` : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isHovered ? s.color + '40' : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      transition: 'background 0.3s, border-color 0.3s',
                    }}
                  >
                    <Icon size={19} color={isHovered ? s.color : '#52525b'} />
                  </motion.div>
                  <div style={{
                    flex: 1, height: 1,
                    background: `linear-gradient(to right, ${isHovered ? s.color + '40' : 'rgba(255,255,255,0.05)'}, transparent)`,
                    transition: 'background 0.3s',
                  }} />
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.015em' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 13.5, color: '#71717a', lineHeight: 1.7, margin: '0 0 20px' }}>
                  {s.desc}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 600,
                      color: isHovered ? s.color : '#3f3f46',
                      background: isHovered ? `${s.color}12` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isHovered ? s.color + '25' : 'rgba(255,255,255,0.06)'}`,
                      padding: '2px 9px', borderRadius: 99,
                      transition: 'all 0.3s',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #how-it-works > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
