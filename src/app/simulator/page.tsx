'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine, Cell
} from 'recharts'
import {
  Train, Wind, Plane, UtensilsCrossed, Zap, Leaf,
  TrendingDown, DollarSign, Award, ArrowRight, RotateCcw,
  TreePine, Car, Sparkles, ChevronRight, Info
} from 'lucide-react'
import Link from 'next/link'

// ─── Data definitions ────────────────────────────────────────────────────────

const BASELINE = {
  totalCO2: 4.7,
  monthlyCost: 420,
  breakdown: {
    transport: 1.80,
    energy:    0.90,
    food:      1.20,
    shopping:  0.40,
    travel:    0.40,
  }
}

interface Sim {
  id: string
  label: string
  sublabel: string
  icon: React.ElementType
  color: string
  co2SaveMax: number       // tonnes/yr at 100% intensity
  moneyMax: number         // £/month at 100%
  category: keyof typeof BASELINE.breakdown
  tagline: string
  fact: string
}

const SIMS: Sim[] = [
  {
    id: 'transport',
    label: 'Switch to Public Transport',
    sublabel: 'Replace car commutes with bus/metro',
    icon: Train,
    color: '#6366f1',
    co2SaveMax: 1.40,
    moneyMax: 130,
    category: 'transport',
    tagline: 'Your biggest single change',
    fact: 'The average car emits 4.6 tonnes of CO₂/year. Public transit cuts this by ~75%.',
  },
  {
    id: 'ac',
    label: 'Reduce AC & Heating',
    sublabel: 'Smart scheduling + 2°C adjustment',
    icon: Wind,
    color: '#f59e0b',
    co2SaveMax: 0.45,
    moneyMax: 55,
    category: 'energy',
    tagline: 'Low effort, real savings',
    fact: 'Reducing home temperature by 1°C can cut your heating bill by up to 10%.',
  },
  {
    id: 'flights',
    label: 'Reduce Flights',
    sublabel: 'Replace flights with train/video calls',
    icon: Plane,
    color: '#3b82f6',
    co2SaveMax: 0.90,
    moneyMax: 220,
    category: 'travel',
    tagline: 'High impact per change',
    fact: 'One transatlantic flight emits ~1t CO₂ — equivalent to 2 months of driving.',
  },
  {
    id: 'food',
    label: 'Cut Food Delivery',
    sublabel: 'Cook at home, buy local produce',
    icon: UtensilsCrossed,
    color: '#10b981',
    co2SaveMax: 0.25,
    moneyMax: 90,
    category: 'food',
    tagline: 'Wallet & planet friendly',
    fact: 'Food delivery packaging generates 3× the waste of home-cooked meals.',
  },
  {
    id: 'renewable',
    label: 'Switch to Renewable Energy',
    sublabel: 'Green energy tariff or solar panels',
    icon: Zap,
    color: '#a855f7',
    co2SaveMax: 0.85,
    moneyMax: 35,
    category: 'energy',
    tagline: 'One switch, lasting impact',
    fact: 'Switching to a 100% renewable tariff can cut your energy footprint by 80%+.',
  },
]

const YEAR_OPTIONS = [1, 5, 10] as const
type Year = typeof YEAR_OPTIONS[number]

// ─── Animated counter ────────────────────────────────────────────────────────
function useAnimatedNumber(target: number, decimals = 1, duration = 800) {
  const [display, setDisplay] = useState(target)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const fromRef = useRef<number>(target)

  useEffect(() => {
    const from = fromRef.current
    const to = target
    if (from === to) return
    startRef.current = performance.now()
    cancelAnimationFrame(frameRef.current)
    const animate = (now: number) => {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const cur = from + (to - from) * eased
      setDisplay(cur)
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
      else { fromRef.current = to; setDisplay(to) }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return display.toFixed(decimals)
}

// ─── Mini stat row ───────────────────────────────────────────────────────────
function StatRow({ label, value, color, prev }: { label: string; value: number; color: string; prev: number }) {
  const pct = Math.min((value / 2.5) * 100, 100)
  const changed = value < prev
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#71717a', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {changed && (
            <motion.span initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>
              ↓ {((prev - value) * 1000).toFixed(0)}kg
            </motion.span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color: changed ? '#10b981' : '#e4e4e7' }}>{value.toFixed(2)}t</span>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', borderRadius: 99, background: changed ? '#10b981' : color, opacity: changed ? 1 : 0.7 }}
        />
      </div>
    </div>
  )
}

// ─── Simulation toggle card ──────────────────────────────────────────────────
function SimCard({ sim, intensity, onChange, active, onToggle }:
  { sim: Sim; intensity: number; onChange: (v: number) => void; active: boolean; onToggle: () => void }) {
  const Icon = sim.icon
  const saving = ((sim.co2SaveMax * intensity) / 100).toFixed(2)
  const money = Math.round((sim.moneyMax * intensity) / 100)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 16,
        border: `1.5px solid ${active ? sim.color + '45' : 'rgba(255,255,255,0.08)'}`,
        background: active ? `${sim.color}08` : 'rgba(255,255,255,0.02)',
        padding: '16px 18px',
        transition: 'border-color 0.25s, background 0.25s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Glow behind when active */}
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100,
            background: `radial-gradient(circle, ${sim.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: active ? 14 : 0 }}>
        {/* Icon */}
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: active ? `${sim.color}20` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${active ? sim.color + '35' : 'rgba(255,255,255,0.08)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={active ? sim.color : '#71717a'} />
        </div>

        {/* Labels */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: active ? '#fff' : '#a1a1aa', margin: 0 }}>{sim.label}</p>
          <p style={{ fontSize: 11, color: active ? '#71717a' : '#3f3f46', margin: '2px 0 0' }}>{sim.sublabel}</p>
        </div>

        {/* Toggle */}
        <button onClick={onToggle} style={{
          width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: active ? sim.color : 'rgba(255,255,255,0.1)',
          transition: 'background 0.25s', position: 'relative',
        }}>
          <motion.div animate={{ x: active ? 21 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ width: 19, height: 19, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 2.5, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
        </button>
      </div>

      {/* Slider — only when active */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: `1px solid ${sim.color}20`, paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#52525b' }}>Intensity</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 11, color: sim.color, fontWeight: 700 }}>−{saving}t CO₂/yr</span>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>+£{money}/mo</span>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <input type="range" min={10} max={100} step={5} value={intensity}
                  onChange={e => onChange(Number(e.target.value))}
                  style={{ width: '100%', appearance: 'none', height: 5, borderRadius: 99, outline: 'none', cursor: 'pointer',
                    background: `linear-gradient(to right, ${sim.color} 0%, ${sim.color} ${intensity}%, rgba(255,255,255,0.1) ${intensity}%, rgba(255,255,255,0.1) 100%)` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: '#3f3f46' }}>Partial</span>
                <span style={{ fontSize: 10, color: '#3f3f46' }}>100% switch</span>
              </div>
              {/* Fact */}
              <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 8, background: `${sim.color}0d`, border: `1px solid ${sim.color}20` }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Info size={12} color={sim.color} style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: '#71717a', margin: 0, lineHeight: 1.5 }}>{sim.fact}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Custom tooltip ──────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(5,15,10,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px' }}>
      <p style={{ fontSize: 12, color: '#71717a', margin: '0 0 8px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill || p.color }} />
          <span style={{ fontSize: 13, color: '#a1a1aa' }}>{p.name}:</span>
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}t</span>
        </div>
      ))}
    </div>
  )
}

// ─── Particle burst on activate ──────────────────────────────────────────────
function ParticleBurst({ color, trigger }: { color: string; trigger: boolean }) {
  if (!trigger) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 1, scale: 0, x: '50%', y: '50%' }}
          animate={{ opacity: 0, scale: 1, x: `${50 + Math.cos((i / 8) * Math.PI * 2) * 80}%`, y: `${50 + Math.sin((i / 8) * Math.PI * 2) * 80}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: color, top: 0, left: 0 }}
        />
      ))}
    </div>
  )
}

// ─── Main Simulator Page ─────────────────────────────────────────────────────
export default function SimulatorPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [actives, setActives] = useState<Record<string, boolean>>({})
  const [intensities, setIntensities] = useState<Record<string, number>>(
    Object.fromEntries(SIMS.map(s => [s.id, 70]))
  )
  const [years, setYears] = useState<Year>(1)
  const [bursting, setBursting] = useState<string | null>(null)

  // Compute totals
  const totalSavedCO2 = SIMS.reduce((acc, s) =>
    acc + (actives[s.id] ? (s.co2SaveMax * (intensities[s.id] ?? 70)) / 100 : 0), 0)
  const totalSavedMoney = SIMS.reduce((acc, s) =>
    acc + (actives[s.id] ? Math.round((s.moneyMax * (intensities[s.id] ?? 70)) / 100) : 0), 0)

  const futureCO2 = Math.max(0.3, BASELINE.totalCO2 - totalSavedCO2)
  const improvePct = ((totalSavedCO2 / BASELINE.totalCO2) * 100)
  const healthScore = Math.min(98, Math.round(52 + improvePct * 0.46))
  const treesPerYear = Math.round(totalSavedCO2 * 46)
  const carKm = Math.round(totalSavedCO2 * 4200)

  // Animated display values
  const dispSavedCO2 = useAnimatedNumber(totalSavedCO2 * years, 2)
  const dispMoney = useAnimatedNumber(totalSavedMoney * 12 * years, 0)
  const dispFuture = useAnimatedNumber(futureCO2, 2)
  const dispImprove = useAnimatedNumber(improvePct, 1)

  function toggle(id: string) {
    const next = !actives[id]
    setActives(a => ({ ...a, [id]: next }))
    if (next) { setBursting(id); setTimeout(() => setBursting(null), 700) }
  }

  // Future breakdown
  const futureBreakdown = { ...BASELINE.breakdown }
  SIMS.forEach(s => {
    if (actives[s.id]) {
      const save = (s.co2SaveMax * (intensities[s.id] ?? 70)) / 100
      futureBreakdown[s.category] = Math.max(0.02, futureBreakdown[s.category] - save)
    }
  })

  // Bar chart data
  const barData = Object.entries(BASELINE.breakdown).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    Current: val,
    Future: Math.max(0.02, futureBreakdown[key as keyof typeof futureBreakdown]),
  }))

  // Timeline data (10 yr)
  const timelineData = Array.from({ length: 11 }, (_, i) => ({
    year: `${new Date().getFullYear() + i}`,
    'Current Path': parseFloat((BASELINE.totalCO2 * (1 + i * 0.01)).toFixed(2)),
    'Your Future': parseFloat((Math.max(0.3, futureCO2 * (1 - i * 0.02))).toFixed(2)),
  }))

  const anyActive = Object.values(actives).some(Boolean)

  return (
    <div style={{ minHeight: '100vh', background: '#050f0a', fontFamily: 'Inter, system-ui, sans-serif', color: '#f0fdf4' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.018) 1px,transparent 1px)', backgroundSize: '72px 72px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 1000, height: 600, background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,15,10,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="#34d399" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Carbon<span style={{ color: '#34d399' }}>Twin</span> <span style={{ color: '#10b981', fontSize: 11 }}>AI</span></span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', padding: '4px 12px', borderRadius: 99 }}>
              ✦ Future Impact Simulator
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              ← Dashboard
            </Link>
            <button onClick={() => { setActives({}); setIntensities(Object.fromEntries(SIMS.map(s => [s.id, 70]))) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1440, margin: '0 auto', padding: '36px 24px 64px' }}>

        {/* ── Hero header ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
            <Sparkles size={18} color="#10b981" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              What If Simulator
            </span>
            <Sparkles size={18} color="#10b981" />
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 900, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            What if you changed{' '}
            <span style={{ color: '#34d399' }}>just one thing?</span>
          </h1>
          <p style={{ fontSize: 16, color: '#71717a', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Toggle lifestyle changes and watch your carbon future transform in real time. Your AI twin models every scenario instantly.
          </p>

          {/* Year selector */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, gap: 4 }}>
            {YEAR_OPTIONS.map(y => (
              <button key={y} onClick={() => setYears(y)} style={{
                padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none',
                background: years === y ? '#10b981' : 'transparent',
                color: years === y ? '#000' : '#71717a',
                transition: 'all 0.2s',
              }}>
                {y} {y === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── 3-column main area ───────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px 1fr', gap: 20, marginBottom: 20, alignItems: 'start' }}>

          {/* ── LEFT: Current Lifestyle ───────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316' }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: '#71717a', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Current Lifestyle</p>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Your Baseline</h2>
            <p style={{ fontSize: 13, color: '#52525b', margin: '0 0 24px' }}>Before any changes</p>

            {/* Big score */}
            <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 16, padding: '20px 24px', textAlign: 'center', marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: '#71717a', margin: '0 0 4px' }}>Annual Carbon Footprint</p>
              <p style={{ fontSize: 48, fontWeight: 900, color: '#f97316', margin: '0 0 2px', lineHeight: 1 }}>{BASELINE.totalCO2}t</p>
              <p style={{ fontSize: 12, color: '#52525b', margin: 0 }}>CO₂ per year</p>
            </div>

            {/* Breakdown */}
            <div style={{ marginBottom: 20 }}>
              {Object.entries(BASELINE.breakdown).map(([key, val]) => (
                <StatRow key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={val} color="#f97316" prev={val} />
              ))}
            </div>

            {/* Baseline stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Monthly spend', value: `£${BASELINE.monthlyCost}`, color: '#f59e0b' },
                { label: 'vs Global Avg', value: '−32%', color: '#10b981' },
                { label: 'Health Score', value: '52/100', color: '#f97316' },
                { label: 'Rank', value: 'Top 45%', color: '#6366f1' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: s.color, margin: '0 0 3px' }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── CENTER: Controls ──────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>Toggle Changes</p>
              <p style={{ fontSize: 12, color: '#52525b', margin: 0 }}>Sliders control intensity</p>
            </div>

            {/* Vertical arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4, opacity: 0.3 }}>
              <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom, transparent, #10b981)' }} />
              <div style={{ fontSize: 10, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>activate</div>
              <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom, #10b981, transparent)' }} />
            </div>

            {SIMS.map((sim, i) => (
              <div key={sim.id} style={{ position: 'relative' }}>
                <SimCard
                  sim={sim}
                  intensity={intensities[sim.id] ?? 70}
                  active={!!actives[sim.id]}
                  onToggle={() => toggle(sim.id)}
                  onChange={v => setIntensities(prev => ({ ...prev, [sim.id]: v }))}
                />
                <ParticleBurst color={sim.color} trigger={bursting === sim.id} />
              </div>
            ))}

            {/* Activate all CTA */}
            {!anyActive && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setActives(Object.fromEntries(SIMS.map(s => [s.id, true])))}
                style={{ padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.08))', border: '1px dashed rgba(16,185,129,0.3)', color: '#34d399', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                ⚡ Activate All Changes
              </motion.button>
            )}
          </motion.div>

          {/* ── RIGHT: Future Lifestyle ───────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${anyActive ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden', transition: 'border-color 0.4s' }}>

            {anyActive && <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', animation: anyActive ? 'pulse 2s infinite' : 'none' }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: anyActive ? '#10b981' : '#71717a', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Simulated Future</p>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>After Changes</h2>
            <p style={{ fontSize: 13, color: '#52525b', margin: '0 0 24px' }}>{anyActive ? `${Object.values(actives).filter(Boolean).length} change${Object.values(actives).filter(Boolean).length > 1 ? 's' : ''} active` : 'Toggle changes to simulate'}</p>

            {/* Big score */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '20px 24px', textAlign: 'center', marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: '#71717a', margin: '0 0 4px' }}>Projected Carbon Footprint</p>
              <motion.p
                key={dispFuture}
                style={{ fontSize: 48, fontWeight: 900, color: anyActive ? '#10b981' : '#52525b', margin: '0 0 2px', lineHeight: 1 }}>
                {dispFuture}t
              </motion.p>
              <p style={{ fontSize: 12, color: '#52525b', margin: 0 }}>CO₂ per year</p>
              {anyActive && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <TrendingDown size={14} color="#10b981" />
                  <span style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>−{dispSavedCO2}t saved/yr</span>
                </motion.div>
              )}
            </div>

            {/* Future breakdown */}
            <div style={{ marginBottom: 20 }}>
              {Object.entries(futureBreakdown).map(([key, val]) => (
                <StatRow key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={val}
                  color="#10b981"
                  prev={BASELINE.breakdown[key as keyof typeof BASELINE.breakdown]}
                />
              ))}
            </div>

            {/* Future stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Monthly spend', value: `£${BASELINE.monthlyCost - totalSavedMoney}`, color: '#10b981' },
                { label: 'vs Global Avg', value: anyActive ? `−${(((6.9 - futureCO2) / 6.9) * 100).toFixed(0)}%` : '−32%', color: '#10b981' },
                { label: 'Health Score', value: `${healthScore}/100`, color: '#10b981' },
                { label: 'Rank', value: anyActive ? `Top ${Math.max(5, 45 - Math.round(improvePct * 0.4))}%` : 'Top 45%', color: anyActive ? '#10b981' : '#6366f1' },
              ].map((s, i) => (
                <motion.div key={i} animate={{ scale: anyActive ? [1, 1.04, 1] : 1 }} transition={{ duration: 0.4 }}
                  style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: s.color, margin: '0 0 3px' }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── 4 Outcome metric cards ───────────────────────────────────────── */}
        <AnimatePresence>
          {anyActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: 20 }}
            >
              {/* "What if" header */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                  Over <span style={{ color: '#10b981' }}>{years} {years === 1 ? 'year' : 'years'}</span>, your changes mean:
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {/* CO₂ Saved */}
                <motion.div whileHover={{ y: -3 }}
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <TrendingDown size={20} color="#10b981" />
                  </div>
                  <p style={{ fontSize: 36, fontWeight: 900, color: '#10b981', margin: '0 0 4px', lineHeight: 1 }}>{dispSavedCO2}</p>
                  <p style={{ fontSize: 12, color: '#10b981', fontWeight: 600, margin: '0 0 4px' }}>tonnes CO₂ saved</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>vs your baseline</p>
                </motion.div>

                {/* Money saved */}
                <motion.div whileHover={{ y: -3 }}
                  style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <DollarSign size={20} color="#f59e0b" />
                  </div>
                  <p style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b', margin: '0 0 4px', lineHeight: 1 }}>£{dispMoney}</p>
                  <p style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, margin: '0 0 4px' }}>money saved</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>over {years} {years === 1 ? 'year' : 'years'}</p>
                </motion.div>

                {/* Impact score */}
                <motion.div whileHover={{ y: -3 }}
                  style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Award size={20} color="#6366f1" />
                  </div>
                  <p style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', margin: '0 0 4px', lineHeight: 1 }}>{healthScore}</p>
                  <p style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, margin: '0 0 4px' }}>eco-health score</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>up from 52/100</p>
                </motion.div>

                {/* Improvement % */}
                <motion.div whileHover={{ y: -3 }}
                  style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 20, padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Sparkles size={20} color="#a855f7" />
                  </div>
                  <p style={{ fontSize: 36, fontWeight: 900, color: '#a855f7', margin: '0 0 4px', lineHeight: 1 }}>{dispImprove}%</p>
                  <p style={{ fontSize: 12, color: '#a855f7', fontWeight: 600, margin: '0 0 4px' }}>improvement</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>carbon reduction</p>
                </motion.div>
              </div>

              {/* Equivalents */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 16, padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TreePine size={16} color="#10b981" />
                  <span style={{ fontSize: 13, color: '#71717a' }}>Equivalent to planting <span style={{ color: '#10b981', fontWeight: 700 }}>{treesPerYear * years} trees</span></span>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Car size={16} color="#6366f1" />
                  <span style={{ fontSize: 13, color: '#71717a' }}>Removing <span style={{ color: '#6366f1', fontWeight: 700 }}>{carKm.toLocaleString()} km</span> of driving</span>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={16} color="#f59e0b" />
                  <span style={{ fontSize: 13, color: '#71717a' }}><span style={{ color: '#f59e0b', fontWeight: 700 }}>{Math.round(totalSavedCO2 * 1200 * years)} kWh</span> of clean energy offset</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Charts row ───────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Before vs After Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Before vs After</h3>
              <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>Emissions by category comparison</p>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(249,115,22,0.7)' }} />
                <span style={{ fontSize: 12, color: '#71717a' }}>Current</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981' }} />
                <span style={{ fontSize: 12, color: '#71717a' }}>Future</span>
              </div>
            </div>
            <div style={{ height: 240 }}>
              {mounted ? <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#52525b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#52525b' }} axisLine={false} tickLine={false} unit="t" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="Current" name="Current" fill="rgba(249,115,22,0.65)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Future" name="Future" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer> : <div style={{ height: 240 }} />}
            </div>
          </motion.div>

          {/* Timeline Projection */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>10-Year Projection</h3>
              <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>Current trajectory vs. your simulated future</p>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 18, height: 2, background: 'rgba(249,115,22,0.7)', borderRadius: 99 }} />
                <span style={{ fontSize: 12, color: '#71717a' }}>Current Path</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 18, height: 2, background: '#10b981', borderRadius: 99 }} />
                <span style={{ fontSize: 12, color: '#71717a' }}>Your Future</span>
              </div>
            </div>
            <div style={{ height: 240 }}>
              {mounted ? <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="futureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#52525b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#52525b' }} axisLine={false} tickLine={false} unit="t" />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                  <ReferenceLine y={2.0} stroke="rgba(16,185,129,0.25)" strokeDasharray="4 3"
                    label={{ value: '1.5°C target', position: 'right', fontSize: 10, fill: '#10b981' }} />
                  <Area type="monotone" dataKey="Current Path" stroke="#f97316" strokeWidth={2} fill="url(#currentGrad)" dot={false} />
                  <Area type="monotone" dataKey="Your Future" stroke="#10b981" strokeWidth={2.5} fill="url(#futureGrad)" dot={false}
                    activeDot={{ r: 5, fill: '#10b981', stroke: '#050f0a', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer> : <div style={{ height: 240 }} />}
            </div>
          </motion.div>
        </div>

        {/* ── CTA if nothing active ────────────────────────────────────────── */}
        {!anyActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ textAlign: 'center', marginTop: 32, padding: '28px', borderRadius: 16, background: 'rgba(16,185,129,0.04)', border: '1px dashed rgba(16,185,129,0.2)' }}>
            <p style={{ fontSize: 15, color: '#52525b', margin: '0 0 16px' }}>
              👆 Toggle changes above to see your simulated future in real time
            </p>
            <button
              onClick={() => setActives(Object.fromEntries(SIMS.map(s => [s.id, true])))}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: '#10b981', border: 'none', color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              <Sparkles size={15} /> Show me my best possible future
            </button>
          </motion.div>
        )}
      </main>

      <style>{`
        input[type=range]::-webkit-slider-thumb { appearance:none; width:18px; height:18px; border-radius:50%; background:#fff; border:3px solid #050f0a; box-shadow:0 0 8px rgba(0,0,0,0.4); cursor:pointer; }
        input[type=range]::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#fff; border:3px solid #050f0a; cursor:pointer; }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @media(max-width:1100px) {
          .sim-grid { grid-template-columns: 1fr !important; }
          .metric-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  )
}
