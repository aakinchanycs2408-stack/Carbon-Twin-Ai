'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Leaf, Award, Activity, Globe, TrendingDown,
  RotateCcw, Share2, Download, Bell, Settings, Menu, X
} from 'lucide-react'

import MetricCard from '@/components/dashboard/MetricCard'
import MonthlyTrendChart from '@/components/dashboard/MonthlyTrendChart'
import BreakdownPieChart from '@/components/dashboard/BreakdownPieChart'
import CarbonHeatmap from '@/components/dashboard/CarbonHeatmap'
import InsightsPanel from '@/components/dashboard/InsightsPanel'
import RecommendedImprovements from '@/components/dashboard/RecommendedImprovements'

// ── Score helpers ────────────────────────────────────────────────────────────
function getRating(s: number) {
  if (s < 2) return { label: 'Excellent', color: '#10b981', rank: 'Top 5%' }
  if (s < 4) return { label: 'Good',      color: '#34d399', rank: 'Top 25%' }
  if (s < 6) return { label: 'Average',   color: '#f59e0b', rank: 'Top 50%' }
  if (s < 9) return { label: 'High',      color: '#f97316', rank: 'Top 70%' }
  return              { label: 'Very High',color: '#ef4444', rank: 'Bottom 20%' }
}

function getHealthScore(s: number) {
  return Math.max(10, Math.round(100 - (s / 12) * 90))
}

// ── Animated Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 54; const circ = 2 * Math.PI * r
  const pct = Math.min(score / 12, 1)
  const rating = getRating(score)
  return (
    <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle cx="65" cy="65" r={r} fill="none"
          stroke={rating.color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - pct * circ }}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${rating.color}80)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ fontSize: 26, fontWeight: 900, color: rating.color, lineHeight: 1 }}>
          {score.toFixed(1)}
        </motion.span>
        <span style={{ fontSize: 10, color: '#52525b', marginTop: 2 }}>t CO₂/yr</span>
      </div>
    </div>
  )
}

// ── NavBar ───────────────────────────────────────────────────────────────────
function DashNav({ onRetake }: { onRetake: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(5,15,10,0.9)', backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={14} color="#34d399" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>
            Carbon<span style={{ color: '#34d399' }}>Twin</span>{' '}
            <span style={{ color: '#10b981', fontSize: 11 }}>AI</span>
          </span>
        </a>

        {/* Center title */}
        <span style={{ fontSize: 14, fontWeight: 600, color: '#71717a', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={14} color="#10b981" /> Dashboard
        </span>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', cursor: 'pointer' }}>
            <Bell size={15} />
          </button>
          <button style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', cursor: 'pointer' }}>
            <Settings size={15} />
          </button>
          <button onClick={onRetake} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <RotateCcw size={13} /> Retake
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: '#10b981', border: 'none', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>
    </nav>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
interface ScoreData {
  total: string
  breakdown: { transport: number; energy: number; food: number; shopping: number; travel: number }
  answers: Record<string, unknown>
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<ScoreData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('carbonScore')
    const parsed: ScoreData = raw ? JSON.parse(raw) : {
      total: '4.7',
      breakdown: { transport: 1.8, energy: 0.9, food: 1.2, shopping: 0.4, travel: 0.4 },
      answers: {},
    }
    setData(parsed)
    setTimeout(() => setLoaded(true), 80)
  }, [])

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#050f0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, border: '3px solid rgba(16,185,129,0.15)', borderTopColor: '#10b981', borderRadius: '50%' }} />
    </div>
  )

  const score = parseFloat(data.total)
  const rating = getRating(score)
  const health = getHealthScore(score)
  const savings = Math.max(0, 6.9 - score).toFixed(1)

  return (
    <div style={{ minHeight: '100vh', background: '#050f0a', fontFamily: 'Inter, system-ui, sans-serif', color: '#f0fdf4' }}>

      {/* Fixed background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.018) 1px,transparent 1px)', backgroundSize: '72px 72px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(16,185,129,0.045) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <DashNav onRetake={() => router.push('/assessment')} />

      {/* Content */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1440, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 16 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                Carbon Twin Report · 2025
              </p>
              <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Your Digital Twin Dashboard
              </h1>
              <p style={{ fontSize: 14, color: '#71717a', margin: 0 }}>
                Real-time carbon intelligence based on your lifestyle profile
              </p>
            </div>
            {/* Score ring inline hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '20px 28px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${rating.color}30`,
                borderRadius: 20,
              }}
            >
              <ScoreRing score={score} />
              <div>
                <p style={{ fontSize: 12, color: '#52525b', margin: '0 0 4px' }}>Overall Carbon Score</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: rating.color }}>{rating.label}</span>
                </div>
                <span style={{ fontSize: 12, color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 9px', borderRadius: 99, fontWeight: 600 }}>
                  {rating.rank} globally
                </span>
                {parseFloat(savings) > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
                    <TrendingDown size={12} color="#10b981" />
                    <span style={{ fontSize: 12, color: '#10b981' }}>{savings}t below global avg</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── 4 Metric cards ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          <MetricCard
            title="Carbon Score"
            value={data.total}
            unit="t CO₂/yr"
            sub={`${rating.label} — ${rating.rank} globally`}
            icon={<Globe size={20} />}
            iconBg={`${rating.color}18`}
            iconColor={rating.color}
            trend={{ value: '12% vs last yr', positive: true }}
            delay={0.05}
            accentColor={rating.color}
          />
          <MetricCard
            title="Annual CO₂ Estimate"
            value={(score * 1000).toFixed(0)}
            unit="kg"
            sub="Based on your lifestyle profile"
            icon={<Activity size={20} />}
            iconBg="rgba(99,102,241,0.15)"
            iconColor="#6366f1"
            trend={{ value: '8% this quarter', positive: true }}
            delay={0.1}
            accentColor="#6366f1"
          />
          <MetricCard
            title="Environmental Health"
            value={health}
            unit="/ 100"
            sub={health >= 70 ? 'Great eco-health score' : health >= 50 ? 'Room to improve' : 'Needs attention'}
            icon={<Leaf size={20} />}
            iconBg="rgba(16,185,129,0.12)"
            iconColor="#10b981"
            trend={{ value: '5 pts this month', positive: true }}
            delay={0.15}
            accentColor="#10b981"
          />
          <MetricCard
            title="Carbon Rank"
            value={rating.rank}
            sub="Among all CarbonTwin users"
            icon={<Award size={20} />}
            iconBg="rgba(168,85,247,0.12)"
            iconColor="#a855f7"
            delay={0.2}
            accentColor="#a855f7"
          />
        </div>

        {/* ── Heatmap (full width) ────────────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <CarbonHeatmap />
        </div>

        {/* ── Trend chart + Pie chart (60/40 split) ──────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
          <MonthlyTrendChart />
          <BreakdownPieChart />
        </div>

        {/* ── Insights + Improvements (50/50) ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <InsightsPanel />
          <RecommendedImprovements />
        </div>

      </main>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 1100px) {
          .dash-metrics { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .dash-metrics { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
