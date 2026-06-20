'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Car, Train, Bike, Home, Zap, Leaf, ShoppingBag,
  Plane, Recycle, ChevronRight, ChevronLeft, Check, AlertCircle
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Option { id: string; label: string; sublabel?: string; icon?: React.ReactNode; value: number }
interface Step {
  id: number
  title: string
  subtitle: string
  emoji: string
  field: string
  type: 'single' | 'slider' | 'multi'
  options?: Option[]
  sliderMin?: number; sliderMax?: number; sliderUnit?: string; sliderStep?: number
}

// ─── Steps data ───────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    id: 1, title: 'Transportation Habits', emoji: '🚗',
    subtitle: 'How do you get around day-to-day?',
    field: 'transport', type: 'single',
    options: [
      { id: 'car', label: 'Personal Car', sublabel: 'I drive most places', icon: <Car size={22} />, value: 80 },
      { id: 'transit', label: 'Public Transit', sublabel: 'Bus, metro, or train', icon: <Train size={22} />, value: 25 },
      { id: 'bike', label: 'Bike / Walk', sublabel: 'Mostly human-powered', icon: <Bike size={22} />, value: 5 },
      { id: 'wfh', label: 'Work from Home', sublabel: 'Rarely need to commute', icon: <Home size={22} />, value: 10 },
    ],
  },
  {
    id: 2, title: 'Vehicle Type', emoji: '⛽',
    subtitle: 'What powers your vehicle?',
    field: 'vehicle', type: 'single',
    options: [
      { id: 'petrol', label: 'Petrol / Gas', sublabel: 'Standard combustion engine', icon: <span style={{ fontSize: 20 }}>⛽</span>, value: 100 },
      { id: 'diesel', label: 'Diesel', sublabel: 'Diesel engine', icon: <span style={{ fontSize: 20 }}>🛢️</span>, value: 110 },
      { id: 'hybrid', label: 'Hybrid', sublabel: 'Petrol + electric', icon: <span style={{ fontSize: 20 }}>🔋</span>, value: 55 },
      { id: 'electric', label: 'Electric (EV)', sublabel: 'Fully electric', icon: <Zap size={22} />, value: 20 },
      { id: 'none', label: 'No Vehicle', sublabel: `I don't own a car`, icon: <span style={{ fontSize: 20 }}>🚶</span>, value: 0 },
    ],
  },
  {
    id: 3, title: 'Monthly Electricity', emoji: '⚡',
    subtitle: 'How much electricity does your household use?',
    field: 'electricity', type: 'slider',
    sliderMin: 50, sliderMax: 1000, sliderUnit: 'kWh / month', sliderStep: 10,
  },
  {
    id: 4, title: 'Food Preferences', emoji: '🥗',
    subtitle: 'What best describes your diet?',
    field: 'diet', type: 'single',
    options: [
      { id: 'vegan', label: 'Vegan', sublabel: 'No animal products', icon: <span style={{ fontSize: 20 }}>🌱</span>, value: 10 },
      { id: 'vegetarian', label: 'Vegetarian', sublabel: 'No meat, some dairy/eggs', icon: <span style={{ fontSize: 20 }}>🥦</span>, value: 20 },
      { id: 'flexitarian', label: 'Flexitarian', sublabel: 'Mostly plant-based', icon: <span style={{ fontSize: 20 }}>🥗</span>, value: 35 },
      { id: 'omnivore', label: 'Omnivore', sublabel: 'Balanced meat & veg', icon: <span style={{ fontSize: 20 }}>🍗</span>, value: 55 },
      { id: 'meat_heavy', label: 'Heavy Meat Eater', sublabel: 'Meat at most meals', icon: <span style={{ fontSize: 20 }}>🥩</span>, value: 80 },
    ],
  },
  {
    id: 5, title: 'Shopping Habits', emoji: '🛍️',
    subtitle: 'How often do you buy new clothing or goods?',
    field: 'shopping', type: 'single',
    options: [
      { id: 'rarely', label: 'Rarely', sublabel: 'A few times a year', icon: <span style={{ fontSize: 20 }}>♻️</span>, value: 10 },
      { id: 'sometimes', label: 'Sometimes', sublabel: 'Every 2–3 months', icon: <ShoppingBag size={22} />, value: 30 },
      { id: 'monthly', label: 'Monthly', sublabel: 'Shop once a month', icon: <span style={{ fontSize: 20 }}>📦</span>, value: 55 },
      { id: 'frequent', label: 'Very Frequently', sublabel: 'Weekly or more', icon: <span style={{ fontSize: 20 }}>🛒</span>, value: 80 },
    ],
  },
  {
    id: 6, title: 'Air Travel', emoji: '✈️',
    subtitle: 'How many flights do you take per year?',
    field: 'flights', type: 'single',
    options: [
      { id: 'none', label: 'None', sublabel: `I don't fly`, icon: <span style={{ fontSize: 20 }}>🚫</span>, value: 0 },
      { id: 'short', label: '1–2 Short Haul', sublabel: 'Under 3 hours', icon: <Plane size={22} />, value: 30 },
      { id: 'medium', label: '3–5 Flights', sublabel: 'Mix of short & long haul', icon: <Plane size={22} />, value: 70 },
      { id: 'frequent', label: '6+ Flights', sublabel: 'Frequent flyer', icon: <span style={{ fontSize: 20 }}>🌍</span>, value: 120 },
    ],
  },
  {
    id: 7, title: 'Lifestyle Habits', emoji: '🌿',
    subtitle: 'Which of these apply to you?',
    field: 'lifestyle', type: 'multi',
    options: [
      { id: 'recycle', label: 'I recycle regularly', icon: <Recycle size={20} />, value: -10 },
      { id: 'renewable', label: 'I use renewable energy', icon: <Zap size={20} />, value: -15 },
      { id: 'local_food', label: 'I buy local / seasonal food', icon: <Leaf size={20} />, value: -8 },
      { id: 'smart_home', label: 'I use smart energy devices', icon: <Home size={20} />, value: -12 },
      { id: 'public_transport', label: 'I use public transport when possible', icon: <Train size={20} />, value: -10 },
      { id: 'secondhand', label: 'I buy secondhand clothing', icon: <ShoppingBag size={20} />, value: -7 },
    ],
  },
]

// ─── Motion variants ──────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25 } }),
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({
    electricity: 250,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const current = STEPS[step]
  const total = STEPS.length
  const progress = ((step) / total) * 100

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const field = current.field
    if (current.type === 'single' && !answers[field]) {
      setErrors({ [field]: 'Please select an option to continue.' })
      return false
    }
    if (current.type === 'multi' && (!answers[field] || (answers[field] as string[]).length === 0)) {
      setErrors({ [field]: 'Please select at least one option.' })
      return false
    }
    setErrors({})
    return true
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  function next() {
    if (!validate()) return
    if (step < total - 1) { setDir(1); setStep(s => s + 1) }
    else handleSubmit()
  }
  function prev() {
    if (step > 0) { setDir(-1); setStep(s => s - 1) }
  }

  // ── Answer setters ──────────────────────────────────────────────────────────
  function selectSingle(field: string, id: string) {
    setAnswers(a => ({ ...a, [field]: id }))
    setErrors({})
  }
  function toggleMulti(field: string, id: string) {
    const current = (answers[field] as string[]) || []
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    setAnswers(a => ({ ...a, [field]: next }))
    setErrors({})
  }
  function setSlider(field: string, val: number) {
    setAnswers(a => ({ ...a, [field]: val }))
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true)
    // Calculate mock score
    const scores: number[] = []
    STEPS.forEach(s => {
      if (s.type === 'single') {
        const sel = s.options?.find(o => o.id === answers[s.field])
        if (sel) scores.push(sel.value)
      } else if (s.type === 'slider') {
        scores.push((answers[s.field] as number) * 0.08)
      } else if (s.type === 'multi') {
        const sel = answers[s.field] as string[]
        s.options?.forEach(o => { if (sel?.includes(o.id)) scores.push(o.value) })
      }
    })
    const total = Math.max(1.2, Math.min(12, scores.reduce((a, b) => a + b, 0) / 40))
    localStorage.setItem('carbonScore', JSON.stringify({
      total: total.toFixed(1),
      breakdown: {
        transport: ((answers.transport === 'car' ? 2.8 : answers.transport === 'transit' ? 0.8 : 0.2)),
        energy: ((answers.electricity as number) * 0.0005 * 12),
        food: answers.diet === 'vegan' ? 0.4 : answers.diet === 'vegetarian' ? 0.8 : answers.diet === 'flexitarian' ? 1.2 : answers.diet === 'omnivore' ? 1.8 : 2.5,
        shopping: answers.shopping === 'rarely' ? 0.2 : answers.shopping === 'sometimes' ? 0.5 : answers.shopping === 'monthly' ? 1.0 : 1.5,
        travel: answers.flights === 'none' ? 0 : answers.flights === 'short' ? 0.8 : answers.flights === 'medium' ? 1.8 : 3.2,
      },
      answers,
    }))
    await new Promise(r => setTimeout(r, 1800))
    router.push('/dashboard')
  }

  // ── Render helpers ──────────────────────────────────────────────────────────
  const sliderVal = (answers[current.field] as number) ?? current.sliderMin ?? 100
  const multiSel = (answers[current.field] as string[]) ?? []

  return (
    <div style={{
      minHeight: '100vh', background: '#050f0a', display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif', color: '#f0fdf4', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.025) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={14} color="#34d399" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Carbon<span style={{ color: '#34d399' }}>Twin</span> <span style={{ color: '#10b981', fontSize: 11 }}>AI</span></span>
        </a>
        <span style={{ fontSize: 13, color: '#52525b', fontWeight: 500 }}>Step {step + 1} of {total}</span>
      </header>

      {/* Progress bar */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progress + (100 / total)}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #059669, #34d399)', borderRadius: 99 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i <= step ? '#10b981' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>

      {/* Main card */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 680 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Step card */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24,
                padding: 40,
                backdropFilter: 'blur(20px)',
              }}>
                {/* Step header */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>{current.emoji}</span>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                        Step {current.id} of {total}
                      </p>
                      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{current.title}</h1>
                    </div>
                  </div>
                  <p style={{ fontSize: 15, color: '#71717a', margin: 0, lineHeight: 1.6 }}>{current.subtitle}</p>
                </div>

                {/* ── Single select ── */}
                {current.type === 'single' && (
                  <div style={{ display: 'grid', gridTemplateColumns: current.options!.length > 3 ? 'repeat(2,1fr)' : '1fr', gap: 12 }}>
                    {current.options!.map(opt => {
                      const sel = answers[current.field] === opt.id
                      return (
                        <motion.button
                          key={opt.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectSingle(current.field, opt.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
                            background: sel ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                            border: sel ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
                            textAlign: 'left', width: '100%', transition: 'all 0.2s',
                            color: sel ? '#34d399' : '#a1a1aa',
                          }}
                        >
                          <div style={{
                            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                            background: sel ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                            border: sel ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {opt.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: sel ? '#fff' : '#d4d4d8', margin: '0 0 2px' }}>{opt.label}</p>
                            {opt.sublabel && <p style={{ fontSize: 12, color: sel ? '#6ee7b7' : '#52525b', margin: 0 }}>{opt.sublabel}</p>}
                          </div>
                          {sel && (
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Check size={13} color="#000" strokeWidth={3} />
                            </div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* ── Slider ── */}
                {current.type === 'slider' && (
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <motion.span
                        key={sliderVal}
                        initial={{ scale: 0.9, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ fontSize: 56, fontWeight: 900, color: '#34d399', display: 'block', lineHeight: 1 }}
                      >
                        {sliderVal}
                      </motion.span>
                      <span style={{ fontSize: 14, color: '#52525b', marginTop: 6, display: 'block' }}>{current.sliderUnit}</span>
                    </div>

                    {/* Slider track */}
                    <div style={{ position: 'relative', marginBottom: 16 }}>
                      <input
                        type="range"
                        min={current.sliderMin}
                        max={current.sliderMax}
                        step={current.sliderStep}
                        value={sliderVal}
                        onChange={e => setSlider(current.field, Number(e.target.value))}
                        style={{ width: '100%', appearance: 'none', height: 6, borderRadius: 99, outline: 'none', cursor: 'pointer', background: `linear-gradient(to right, #10b981 0%, #10b981 ${((sliderVal - (current.sliderMin ?? 0)) / ((current.sliderMax ?? 100) - (current.sliderMin ?? 0))) * 100}%, rgba(255,255,255,0.1) ${((sliderVal - (current.sliderMin ?? 0)) / ((current.sliderMax ?? 100) - (current.sliderMin ?? 0))) * 100}%, rgba(255,255,255,0.1) 100%)` }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#52525b' }}>
                      <span>{current.sliderMin} {current.sliderUnit?.split('/')[0]}</span>
                      <span>{current.sliderMax} {current.sliderUnit?.split('/')[0]}</span>
                    </div>

                    {/* Quick picks */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                      {[100, 250, 400, 600, 800].map(v => (
                        <button key={v} onClick={() => setSlider(current.field, v)} style={{
                          padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          background: sliderVal === v ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                          border: sliderVal === v ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
                          color: sliderVal === v ? '#34d399' : '#71717a', transition: 'all 0.2s',
                        }}>
                          {v} kWh
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Multi select ── */}
                {current.type === 'multi' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    {current.options!.map(opt => {
                      const sel = multiSel.includes(opt.id)
                      return (
                        <motion.button
                          key={opt.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleMulti(current.field, opt.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '13px 14px', borderRadius: 12, cursor: 'pointer',
                            background: sel ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.025)',
                            border: sel ? '1.5px solid rgba(16,185,129,0.4)' : '1.5px solid rgba(255,255,255,0.07)',
                            textAlign: 'left', width: '100%', transition: 'all 0.2s',
                          }}
                        >
                          <div style={{
                            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                            background: sel ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                            border: sel ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: sel ? '#34d399' : '#52525b',
                          }}>
                            {opt.icon}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: sel ? 600 : 400, color: sel ? '#e4fdf3' : '#71717a', flex: 1 }}>{opt.label}</span>
                          {sel && <Check size={14} color="#10b981" strokeWidth={2.5} />}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* Error message */}
                {errors[current.field] && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle size={15} color="#f87171" />
                    <span style={{ fontSize: 13, color: '#f87171' }}>{errors[current.field]}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
            <button
              onClick={prev}
              disabled={step === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 24px', borderRadius: 12, cursor: step === 0 ? 'not-allowed' : 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: step === 0 ? '#3f3f46' : '#a1a1aa', fontSize: 14, fontWeight: 600,
                opacity: step === 0 ? 0.4 : 1, transition: 'all 0.2s',
              }}
            >
              <ChevronLeft size={17} /> Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 99, background: i === step ? '#10b981' : i < step ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)', transition: 'all 0.3s' }} />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={next}
              disabled={submitting}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 12, cursor: submitting ? 'not-allowed' : 'pointer',
                background: submitting ? 'rgba(16,185,129,0.4)' : '#10b981',
                border: 'none', color: '#000', fontSize: 14, fontWeight: 700,
                boxShadow: '0 0 24px rgba(16,185,129,0.3)', transition: 'all 0.2s',
                minWidth: 140, justifyContent: 'center',
              }}
            >
              {submitting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%' }} />
                  Analyzing...
                </>
              ) : step === total - 1 ? (
                <>Generate Twin <Check size={16} /></>
              ) : (
                <>Continue <ChevronRight size={17} /></>
              )}
            </motion.button>
          </div>
        </div>
      </main>

      {/* Slider thumb styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 22px; height: 22px; border-radius: 50%;
          background: #10b981; border: 3px solid #050f0a;
          box-shadow: 0 0 12px rgba(16,185,129,0.5); cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 50%;
          background: #10b981; border: 3px solid #050f0a; cursor: pointer;
        }
        @media(max-width:600px){
          div[style*="repeat(2,1fr)"]{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
