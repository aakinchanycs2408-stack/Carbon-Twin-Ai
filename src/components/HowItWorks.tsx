'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Dna, Gauge, Leaf } from 'lucide-react'

const steps = [
  { num: '01', Icon: ClipboardList, title: 'Assess Lifestyle', desc: 'Answer our intelligent questionnaire about your daily commute, diet, home energy, travel habits, and consumption patterns. Takes under 5 minutes.', tags: 'Transport · Food · Energy · Shopping' },
  { num: '02', Icon: Dna, title: 'Generate Carbon Twin', desc: 'Our AI builds your unique digital carbon twin — a behavioral model that mirrors your exact lifestyle and calculates your real-time carbon fingerprint.', tags: 'AI Modeling · Behavior Mapping · Baseline' },
  { num: '03', Icon: Gauge, title: 'Simulate Future', desc: 'Run unlimited simulations. Test lifestyle changes and see their projected impact on your carbon footprint over 1, 5, and 10-year horizons.', tags: 'Scenario Testing · Timeline Projection' },
  { num: '04', Icon: Leaf, title: 'Reduce Emissions', desc: 'Act on AI-generated recommendations and weekly missions. Track your real progress as your twin updates with verified behavioral data.', tags: 'Personalized Actions · Progress Tracking' },
]

const iconBox: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 11,
  background: 'rgba(16,185,129,0.1)',
  border: '1px solid rgba(16,185,129,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#34d399', flexShrink: 0,
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: '#050f0a', paddingTop: 96, paddingBottom: 96 }}>
      <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)', marginBottom: 80 }} />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>The Process</p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,38px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 16px' }}>
            From Habits to <span style={{ color: '#34d399' }}>Climate Action</span>
          </h2>
          <p style={{ fontSize: 15, color: '#71717a', lineHeight: 1.65, maxWidth: 460, margin: '0 auto' }}>
            Four simple steps to transform your awareness into measurable environmental impact.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {steps.map((s, i) => {
            const Icon = s.Icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28, transition: 'border-color 0.25s, transform 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                {/* Step number + icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: 'rgba(16,185,129,0.15)', lineHeight: 1, fontFamily: 'monospace', userSelect: 'none', minWidth: 48 }}>
                    {s.num}
                  </span>
                  <div style={iconBox}><Icon size={18} /></div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.65, margin: '0 0 18px' }}>{s.desc}</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                  <p style={{ fontSize: 11, color: '#166534', fontFamily: 'monospace', letterSpacing: '0.04em', margin: 0 }}>{s.tags}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
