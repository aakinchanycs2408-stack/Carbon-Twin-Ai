'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue, animate } from 'framer-motion'
import Link from 'next/link'
import {
  Leaf, Zap, Train, UtensilsCrossed, Recycle, ShoppingBag,
  Star, Trophy, Flame, Target, Lock, CheckCircle2, Award,
  TrendingUp, Activity, BarChart2, Bike, ChevronRight,
  Gift, Sparkles, Crown, Shield, ArrowRight, Plus, User
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const LEVELS = [
  { name: 'Eco Rookie',    minXP: 0,    maxXP: 500,  color: '#71717a', glow: 'rgba(113,113,122,0.3)',  icon: '🌱', num: 1 },
  { name: 'Green Explorer',minXP: 500,  maxXP: 1500, color: '#10b981', glow: 'rgba(16,185,129,0.35)',  icon: '🌿', num: 2 },
  { name: 'Carbon Crusher',minXP: 1500, maxXP: 3000, color: '#6366f1', glow: 'rgba(99,102,241,0.35)', icon: '⚡', num: 3 },
  { name: 'Climate Hero',  minXP: 3000, maxXP: 5000, color: '#f59e0b', glow: 'rgba(245,158,11,0.35)', icon: '🌍', num: 4 },
]

const INITIAL_XP = 1240
const INITIAL_POINTS = 2850

interface Challenge {
  id: string; title: string; desc: string; icon: React.ElementType
  color: string; progress: number; target: number; xpReward: number; pointsReward: number
  done: boolean; unit: string; tag: string
}

const BASE_CHALLENGES: Challenge[] = [
  { id: 'transit',     title: 'Public Transport Pro', desc: 'Take bus or metro 5 times this week',      icon: Train,          color: '#6366f1', progress: 3, target: 5,  xpReward: 150, pointsReward: 75,  done: false, unit: 'trips',   tag: 'Transport' },
  { id: 'electricity', title: 'Power Saver',          desc: 'Keep electricity under 50 kWh this week',  icon: Zap,            color: '#f59e0b', progress: 3, target: 5,  xpReward: 100, pointsReward: 50,  done: false, unit: 'days',    tag: 'Energy'    },
  { id: 'food',        title: 'Home Cook Hero',        desc: 'Cook at home — skip delivery for 7 days',  icon: UtensilsCrossed,color: '#10b981', progress: 7, target: 7,  xpReward: 120, pointsReward: 60,  done: true,  unit: 'days',    tag: 'Food'      },
  { id: 'cycle',       title: 'Cycle Commuter',        desc: 'Bike to work or errands 3 times',          icon: Bike,           color: '#3b82f6', progress: 1, target: 3,  xpReward: 200, pointsReward: 100, done: false, unit: 'rides',   tag: 'Transport' },
  { id: 'plastic',     title: 'Zero Plastic Days',     desc: 'Avoid all single-use plastic for 3 days',  icon: Recycle,        color: '#ec4899', progress: 3, target: 3,  xpReward: 180, pointsReward: 90,  done: true,  unit: 'days',    tag: 'Lifestyle' },
  { id: 'shopping',    title: 'Mindful Buyer',         desc: 'Buy nothing new for 7 days',               icon: ShoppingBag,    color: '#a855f7', progress: 4, target: 7,  xpReward: 130, pointsReward: 65,  done: false, unit: 'days',    tag: 'Shopping'  },
]

interface Badge {
  id: string; title: string; desc: string; emoji: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
  color: string; unlocked: boolean; xpNeeded?: number; progress?: number; total?: number
}

const BADGES: Badge[] = [
  { id: 'first',    title: 'First Step',       desc: 'Completed your first assessment',      emoji: '🌱', rarity: 'Common',    color: '#10b981', unlocked: true  },
  { id: 'streak7',  title: 'Week Warrior',     desc: '7-day login streak',                   emoji: '🔥', rarity: 'Common',    color: '#f97316', unlocked: true  },
  { id: 'transit',  title: 'Transit Master',   desc: 'Used public transport 20 times',       emoji: '🚌', rarity: 'Uncommon',  color: '#6366f1', unlocked: true  },
  { id: 'plant',    title: 'Plant Power',       desc: '7 consecutive plant-based days',       emoji: '🥗', rarity: 'Rare',      color: '#10b981', unlocked: true  },
  { id: 'streak30', title: '30-Day Legend',    desc: '30-day login streak',                  emoji: '⚡', rarity: 'Epic',      color: '#f59e0b', unlocked: true  },
  { id: 'carbon',   title: 'Carbon Crusher',   desc: 'Reach Carbon Crusher level',           emoji: '💥', rarity: 'Epic',      color: '#a855f7', unlocked: false, xpNeeded: 1500, progress: 1240, total: 1500 },
  { id: 'flightfr', title: 'Flight Free',      desc: '90 days without flying',               emoji: '✈️', rarity: 'Epic',      color: '#3b82f6', unlocked: false, progress: 14, total: 90 },
  { id: 'solar',    title: 'Solar Citizen',    desc: 'Switch to renewable energy',           emoji: '☀️', rarity: 'Rare',      color: '#f59e0b', unlocked: false },
  { id: 'vegan30',  title: 'Vegan Month',      desc: '30 days of plant-based eating',        emoji: '🌿', rarity: 'Rare',      color: '#10b981', unlocked: false, progress: 7, total: 30 },
  { id: 'ev',       title: 'EV Driver',        desc: 'Switch to electric vehicle',           emoji: '🔋', rarity: 'Legendary', color: '#3b82f6', unlocked: false },
  { id: 'hero',     title: 'Climate Hero',     desc: 'Reach the highest level',              emoji: '🌍', rarity: 'Legendary', color: '#f59e0b', unlocked: false, xpNeeded: 3000, progress: 1240, total: 3000 },
  { id: 'perfect',  title: 'Perfect Week',     desc: 'Complete all weekly challenges',       emoji: '👑', rarity: 'Legendary', color: '#ec4899', unlocked: false },
]

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Common:    { bg: 'rgba(113,113,122,0.12)', border: 'rgba(113,113,122,0.3)',   text: '#a1a1aa' },
  Uncommon:  { bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.3)',    text: '#34d399' },
  Rare:      { bg: 'rgba(99,102,241,0.1)',   border: 'rgba(99,102,241,0.3)',    text: '#818cf8' },
  Epic:      { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)',   text: '#c084fc' },
  Legendary: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)',   text: '#fbbf24' },
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#10b981','#6366f1','#f59e0b','#ec4899','#3b82f6','#a855f7','#34d399']

function Confetti({ active, onDone }: { active: boolean; onDone: () => void }) {
  const particles = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.4,
      duration: 1.2 + Math.random() * 1.2,
      size: 5 + Math.random() * 9,
      isCircle: Math.random() > 0.4,
      rotate: Math.random() * 720,
    }))
  )

  useEffect(() => {
    if (active) {
      const t = setTimeout(onDone, 3000)
      return () => clearTimeout(t)
    }
  }, [active, onDone])

  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.current.map(p => (
        <motion.div key={p.id}
          initial={{ y: -30, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate, scale: [1, 1, 0.3] }}
          transition={{ duration: p.duration + 0.8, delay: p.delay, ease: [0.2, 0.6, 0.9, 1] }}
          style={{ position: 'absolute', top: 0, width: p.size, height: p.size * (p.isCircle ? 1 : 0.5),
            borderRadius: p.isCircle ? '50%' : 2, background: p.color }}
        />
      ))}
    </div>
  )
}

// ─── Animated number ──────────────────────────────────────────────────────────
function AnimatedNum({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const from = prev.current; const to = value
    if (from === to) return
    let start: number
    const dur = 700
    const frame = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (to - from) * ease)
      if (t < 1) requestAnimationFrame(frame)
      else { setDisplay(to); prev.current = to }
    }
    requestAnimationFrame(frame)
  }, [value])
  return <>{display.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</>
}

// ─── XP Bar ───────────────────────────────────────────────────────────────────
function XPBar({ xp, level }: { xp: number; level: typeof LEVELS[0] }) {
  const pct = Math.min(((xp - level.minXP) / (level.maxXP - level.minXP)) * 100, 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#71717a' }}>Level Progress</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: level.color }}>
          {xp.toLocaleString()} / {level.maxXP.toLocaleString()} XP
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${level.color}aa, ${level.color})`,
            boxShadow: `0 0 10px ${level.color}60`, position: 'relative' }}
        >
          {/* Shimmer */}
          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', borderRadius: 99 }} />
        </motion.div>
      </div>
      <p style={{ fontSize: 11, color: '#52525b', margin: '4px 0 0' }}>
        {(level.maxXP - xp).toLocaleString()} XP to {LEVELS[(LEVELS.findIndex(l => l.name === level.name) + 1) % LEVELS.length]?.name ?? 'MAX'}
      </p>
    </div>
  )
}

// ─── Challenge Card ───────────────────────────────────────────────────────────
function ChallengeCard({ ch, onClaim }: { ch: Challenge; onClaim: (ch: Challenge) => void }) {
  const Icon = ch.icon
  const pct = Math.min((ch.progress / ch.target) * 100, 100)
  const complete = ch.progress >= ch.target
  const [claimed, setClaimed] = useState(ch.done)
  const [pulse, setPulse] = useState(false)

  function claim() {
    if (!complete || claimed) return
    setClaimed(true)
    setPulse(true)
    setTimeout(() => setPulse(false), 600)
    onClaim(ch)
  }

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      style={{
        padding: '18px 20px', borderRadius: 16,
        background: claimed ? `${ch.color}08` : 'rgba(255,255,255,0.025)',
        border: `1.5px solid ${claimed ? ch.color + '30' : 'rgba(255,255,255,0.08)'}`,
        position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s',
      }}
    >
      {pulse && (
        <motion.div initial={{ scale: 0.5, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'absolute', inset: 0, borderRadius: 16, background: `${ch.color}30`, pointerEvents: 'none' }} />
      )}
      {/* Corner glow if complete */}
      {complete && !claimed && (
        <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80,
          background: `radial-gradient(circle, ${ch.color}25 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${ch.color}18`,
          border: `1px solid ${ch.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={19} color={ch.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{ch.title}</h3>
            <span style={{ fontSize: 10, fontWeight: 700, color: ch.color, background: `${ch.color}18`,
              padding: '1px 7px', borderRadius: 99, flexShrink: 0 }}>{ch.tag}</span>
          </div>
          <p style={{ fontSize: 12, color: '#71717a', margin: '0 0 12px', lineHeight: 1.5 }}>{ch.desc}</p>

          {/* Progress bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#52525b' }}>{ch.progress} / {ch.target} {ch.unit}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: complete ? ch.color : '#52525b' }}>{pct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', borderRadius: 99, background: ch.color,
                  boxShadow: complete ? `0 0 8px ${ch.color}80` : 'none' }} />
            </div>
          </div>

          {/* Rewards row + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>+{ch.xpReward} XP</span>
              <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>+{ch.pointsReward} 🟢</span>
            </div>
            {claimed ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#10b981', fontWeight: 700 }}>
                <CheckCircle2 size={14} /> Claimed
              </span>
            ) : complete ? (
              <motion.button whileTap={{ scale: 0.95 }} onClick={claim}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 9,
                  background: ch.color, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 0 14px ${ch.color}50` }}>
                <Gift size={13} /> Claim Reward
              </motion.button>
            ) : (
              <span style={{ fontSize: 12, color: '#3f3f46' }}>{ch.target - ch.progress} left</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Badge Card ───────────────────────────────────────────────────────────────
function BadgeCard({ badge, onUnlockEffect }: { badge: Badge; onUnlockEffect: () => void }) {
  const r = RARITY_COLORS[badge.rarity]
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 12
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -12
    setTilt({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04 }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      onClick={() => { if (badge.unlocked) onUnlockEffect() }}
      style={{
        padding: '20px 16px', borderRadius: 18, textAlign: 'center', cursor: badge.unlocked ? 'pointer' : 'default',
        background: badge.unlocked ? r.bg : 'rgba(255,255,255,0.02)',
        border: `1.5px solid ${badge.unlocked ? r.border : 'rgba(255,255,255,0.06)'}`,
        position: 'relative', overflow: 'hidden',
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease, border-color 0.25s',
        boxShadow: hovered && badge.unlocked ? `0 8px 28px ${badge.color}25` : 'none',
      }}
    >
      {/* Legendary shimmer */}
      {badge.rarity === 'Legendary' && badge.unlocked && (
        <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', pointerEvents: 'none' }} />
      )}

      {/* Lock overlay */}
      {!badge.unlocked && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,15,10,0.7)', borderRadius: 18, backdropFilter: 'blur(2px)', zIndex: 2 }}>
          <Lock size={20} color="#3f3f46" />
        </div>
      )}

      {/* Glow ring */}
      {badge.unlocked && (
        <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 80, background: `radial-gradient(circle, ${badge.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} />
      )}

      {/* Emoji */}
      <motion.div animate={badge.unlocked && hovered ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}} transition={{ duration: 0.5 }}
        style={{ fontSize: 36, marginBottom: 10, filter: !badge.unlocked ? 'grayscale(1) opacity(0.3)' : 'none' }}>
        {badge.emoji}
      </motion.div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: badge.unlocked ? '#fff' : '#3f3f46', margin: '0 0 4px' }}>
        {badge.title}
      </h3>
      <p style={{ fontSize: 11, color: badge.unlocked ? '#71717a' : '#27272a', margin: '0 0 10px', lineHeight: 1.4 }}>
        {badge.desc}
      </p>

      {/* Rarity badge */}
      <span style={{ fontSize: 10, fontWeight: 700, color: badge.unlocked ? r.text : '#3f3f46',
        background: badge.unlocked ? r.bg : 'rgba(255,255,255,0.02)',
        border: `1px solid ${badge.unlocked ? r.border : 'rgba(255,255,255,0.04)'}`,
        padding: '2px 8px', borderRadius: 99 }}>
        {badge.rarity}
      </span>

      {/* Progress for locked with progress */}
      {!badge.unlocked && badge.progress !== undefined && (
        <div style={{ marginTop: 10, position: 'relative', zIndex: 3 }}>
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: badge.color,
              width: `${Math.min((badge.progress! / badge.total!) * 100, 100)}%` }} />
          </div>
          <p style={{ fontSize: 10, color: '#3f3f46', margin: '3px 0 0' }}>{badge.progress}/{badge.total}</p>
        </div>
      )}
    </motion.div>
  )
}

// ─── Level indicator ──────────────────────────────────────────────────────────
function LevelNode({ level, isCurrent, unlocked }: { level: typeof LEVELS[0]; isCurrent: boolean; unlocked: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
      <motion.div
        animate={isCurrent ? { boxShadow: [`0 0 0px ${level.color}00`, `0 0 20px ${level.color}60`, `0 0 0px ${level.color}00`] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: 56, height: 56, borderRadius: 17,
          background: unlocked ? `${level.color}20` : 'rgba(255,255,255,0.03)',
          border: `2px solid ${unlocked ? level.color + (isCurrent ? 'ff' : '60') : 'rgba(255,255,255,0.08)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          filter: unlocked ? 'none' : 'grayscale(1) opacity(0.35)',
          position: 'relative',
        }}
      >
        {level.icon}
        {isCurrent && (
          <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%',
            background: level.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={9} color="#000" fill="#000" />
          </div>
        )}
      </motion.div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: unlocked ? level.color : '#3f3f46', margin: '0 0 1px' }}>{level.name}</p>
        <p style={{ fontSize: 10, color: '#27272a', margin: 0 }}>{level.minXP.toLocaleString()} XP</p>
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, color, show }: { message: string; color: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: -60, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -40, scale: 0.95 }}
          style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 9998,
            background: `rgba(5,15,10,0.97)`, border: `1px solid ${color}40`,
            borderRadius: 14, padding: '14px 24px', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${color}20` }}>
          <Sparkles size={18} color={color} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RewardsPage() {
  const [xp, setXP] = useState(INITIAL_XP)
  const [points, setPoints] = useState(INITIAL_POINTS)
  const [challenges, setChallenges] = useState(BASE_CHALLENGES)
  const [confetti, setConfetti] = useState(false)
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'challenges' | 'badges'>('challenges')
  const [rarityFilter, setRarityFilter] = useState<string>('All')

  const currentLevel = LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) ?? LEVELS[LEVELS.length - 1]
  const currentLevelIdx = LEVELS.findIndex(l => l.name === currentLevel.name)

  function showToast(msg: string, color: string) {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3000)
  }

  function triggerConfetti() { setConfetti(true) }
  function stopConfetti() { setConfetti(false) }

  function claimChallenge(ch: Challenge) {
    setXP(prev => {
      const next = prev + ch.xpReward
      const prevLevel = LEVELS.find(l => prev >= l.minXP && prev < l.maxXP)
      const nextLevel = LEVELS.find(l => next >= l.minXP && next < l.maxXP)
      if (prevLevel?.name !== nextLevel?.name) {
        setTimeout(() => {
          triggerConfetti()
          showToast(`🎉 Level Up! You are now ${nextLevel?.name}!`, nextLevel?.color ?? '#10b981')
        }, 300)
      } else {
        showToast(`+${ch.xpReward} XP earned from "${ch.title}"!`, '#10b981')
      }
      return next
    })
    setPoints(prev => prev + ch.pointsReward)
    setChallenges(prev => prev.map(c => c.id === ch.id ? { ...c, done: true } : c))
  }

  const RARITIES = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
  const filteredBadges = rarityFilter === 'All' ? BADGES : BADGES.filter(b => b.rarity === rarityFilter)
  const unlockedCount = BADGES.filter(b => b.unlocked).length

  return (
    <div style={{ minHeight: '100vh', background: '#050f0a', fontFamily: 'Inter, system-ui, sans-serif', color: '#f0fdf4' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.018) 1px,transparent 1px)', backgroundSize: '72px 72px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1000, height: 500,
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <Confetti active={confetti} onDone={stopConfetti} />
      {toast && <Toast message={toast.msg} color={toast.color} show={!!toast} />}

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,15,10,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="#34d399" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Carbon<span style={{ color: '#34d399' }}>Twin</span> <span style={{ color: '#10b981', fontSize: 11 }}>AI</span></span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Crown size={14} color="#f59e0b" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Rewards &amp; Achievements</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {[{ href: '/dashboard', label: 'Dashboard', icon: BarChart2 }, { href: '/simulator', label: 'Simulator', icon: Activity }, { href: '/coach', label: 'Eco Coach', icon: Sparkles }].map((item, i) => {
              const Icon = item.icon
              return (
                <Link key={i} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', fontSize: 12, textDecoration: 'none' }}>
                  <Icon size={12} /> {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '36px 24px 64px' }}>

        {/* ── Profile Hero Card ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ background: `linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.04), rgba(5,15,10,0))`,
            border: `1px solid ${currentLevel.color}30`, borderRadius: 24, padding: '28px 32px', marginBottom: 24,
            position: 'relative', overflow: 'hidden' }}>

          {/* BG decoration */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200,
            background: `radial-gradient(circle, ${currentLevel.color}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150,
            background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 28, alignItems: 'center' }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <motion.div animate={{ boxShadow: [`0 0 0px ${currentLevel.color}00`, `0 0 28px ${currentLevel.color}50`, `0 0 0px ${currentLevel.color}00`] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ width: 80, height: 80, borderRadius: 24, background: `${currentLevel.color}18`,
                  border: `2px solid ${currentLevel.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                {currentLevel.icon}
              </motion.div>
              <div style={{ position: 'absolute', bottom: -6, right: -6, background: currentLevel.color, borderRadius: 8, padding: '2px 7px', fontSize: 10, fontWeight: 800, color: '#000' }}>
                LVL {currentLevelIdx + 1}
              </div>
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                  {currentLevel.name}
                </h1>
                <span style={{ fontSize: 11, fontWeight: 700, color: currentLevel.color,
                  background: `${currentLevel.color}18`, border: `1px solid ${currentLevel.color}30`,
                  padding: '2px 9px', borderRadius: 99 }}>Current Level</span>
              </div>
              <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 16px' }}>
                {unlockedCount} badges unlocked · {challenges.filter(c => c.done).length}/{challenges.length} challenges this week
              </p>
              <XPBar xp={xp} level={currentLevel} />
            </div>

            {/* Points + stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Green points */}
              <div style={{ padding: '14px 20px', borderRadius: 16, background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center', minWidth: 130 }}>
                <p style={{ fontSize: 11, color: '#71717a', margin: '0 0 3px', fontWeight: 500 }}>Green Points</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#10b981', margin: 0, lineHeight: 1 }}>
                  🟢 <AnimatedNum value={points} />
                </p>
              </div>
              <div style={{ padding: '10px 20px', borderRadius: 14, background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#71717a', margin: '0 0 2px' }}>Total XP</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b', margin: 0, lineHeight: 1 }}>
                  ⚡ <AnimatedNum value={xp} />
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Level Progress Track ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '24px 28px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
            Your Journey
          </h2>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 27, left: '7%', right: '7%', height: 2,
              background: 'rgba(255,255,255,0.06)', zIndex: 0 }}>
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${(currentLevelIdx / (LEVELS.length - 1)) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.4 }}
                style={{ height: '100%', background: currentLevel.color, borderRadius: 99 }} />
            </div>
            {LEVELS.map((lv, i) => (
              <LevelNode key={i} level={lv} isCurrent={lv.name === currentLevel.name} unlocked={i <= currentLevelIdx} />
            ))}
          </div>
        </motion.div>

        {/* ── Quick stats ────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { icon: Flame,    value: '12',  label: 'Day Streak',       color: '#f97316' },
            { icon: Trophy,   value: `${unlockedCount}/${BADGES.length}`, label: 'Badges Earned', color: '#f59e0b' },
            { icon: Target,   value: `${challenges.filter(c=>c.done).length}/${challenges.length}`, label: 'Weekly Challenges', color: '#10b981' },
            { icon: TrendingUp,value:'Top 35%',label: 'Global Rank',   color: '#6366f1' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                whileHover={{ y: -2 }}
                style={{ padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${s.color}18`, border: `1px solid ${s.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={s.color} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 2px', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>{s.label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 4, width: 'fit-content' }}>
          {(['challenges', 'badges'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '9px 22px', borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: activeTab === tab ? '#10b981' : 'transparent',
                color: activeTab === tab ? '#000' : '#71717a' }}>
              {tab === 'challenges' ? `⚡ Weekly Challenges` : `🏅 Badge Collection`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'challenges' ? (
            <motion.div key="challenges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 3px' }}>This Week's Challenges</h2>
                  <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>Resets every Sunday · {challenges.filter(c=>!c.done).length} challenges remaining</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Zap size={14} color="#10b981" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                    {challenges.filter(c=>c.done).reduce((a,c)=>a+c.xpReward,0)} / {challenges.reduce((a,c)=>a+c.xpReward,0)} XP this week
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                {challenges.map((ch, i) => (
                  <motion.div key={ch.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <ChallengeCard ch={ch} onClaim={claimChallenge} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              {/* Header + Filter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 3px' }}>Badge Collection</h2>
                  <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>{unlockedCount} of {BADGES.length} badges unlocked</p>
                </div>
                {/* Rarity filter */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {RARITIES.map(r => (
                    <button key={r} onClick={() => setRarityFilter(r)}
                      style={{ padding: '5px 13px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                        background: rarityFilter === r ? '#10b981' : 'rgba(255,255,255,0.04)',
                        color: rarityFilter === r ? '#000' : '#71717a' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress overview */}
              <div style={{ marginBottom: 20, padding: '14px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#71717a' }}>Collection Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{unlockedCount}/{BADGES.length}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(unlockedCount / BADGES.length) * 100}%` }}
                      transition={{ duration: 1 }} style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #10b981, #6366f1)' }} />
                  </div>
                </div>
                {RARITIES.slice(1).map((r, i) => {
                  const count = BADGES.filter(b => b.rarity === r && b.unlocked).length
                  const total = BADGES.filter(b => b.rarity === r).length
                  const rc = RARITY_COLORS[r]
                  return (
                    <div key={r} style={{ textAlign: 'center', padding: '6px 10px', borderRadius: 10, background: rc.bg, border: `1px solid ${rc.border}` }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: rc.text, margin: 0, lineHeight: 1 }}>{count}/{total}</p>
                      <p style={{ fontSize: 10, color: '#52525b', margin: '2px 0 0' }}>{r}</p>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                {filteredBadges.map((badge, i) => (
                  <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                    <BadgeCard badge={badge} onUnlockEffect={() => { triggerConfetti(); showToast(`🏅 "${badge.title}" badge inspected!`, badge.color) }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      `}</style>
    </div>
  )
}
