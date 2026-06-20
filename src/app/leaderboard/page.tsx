'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Leaf, Search, TrendingUp, TrendingDown, Minus,
  Flame, Zap, Award, Globe, Filter, Crown, Star,
  Users, BarChart2, Activity, Sparkles, ChevronUp,
  ChevronDown, Trophy, Shield, Car, Wind, Plane, ArrowRight
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface User {
  id: number
  name: string
  initials: string
  color: string
  flag: string
  region: 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania'
  carbonScore: number
  improvement: number
  weeklyXP: number
  monthlyXP: number
  totalXP: number
  greenPoints: number
  level: string
  levelIcon: string
  levelColor: string
  badges: number
  streak: number
  weeklyRankChange: number
  monthlyRankChange: number
  isYou?: boolean
  categoryBest?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ALL_USERS: User[] = [
  { id:1,  name:'Emma Chen',       initials:'EC', color:'#10b981', flag:'🇸🇬', region:'Asia',     carbonScore:1.2, improvement:48, weeklyXP:2840, monthlyXP:11200, totalXP:45000, greenPoints:12400, level:'Climate Hero',    levelIcon:'🌍', levelColor:'#f59e0b', badges:28, streak:94, weeklyRankChange:0, monthlyRankChange:0 },
  { id:2,  name:'Marco Rossi',     initials:'MR', color:'#6366f1', flag:'🇮🇹', region:'Europe',   carbonScore:1.5, improvement:42, weeklyXP:2650, monthlyXP:10800, totalXP:38000, greenPoints:10900, level:'Climate Hero',    levelIcon:'🌍', levelColor:'#f59e0b', badges:24, streak:67, weeklyRankChange:1, monthlyRankChange:0 },
  { id:3,  name:'Yuki Tanaka',     initials:'YT', color:'#f59e0b', flag:'🇯🇵', region:'Asia',     carbonScore:1.8, improvement:39, weeklyXP:2420, monthlyXP:9800,  totalXP:31000, greenPoints:9200,  level:'Climate Hero',    levelIcon:'🌍', levelColor:'#f59e0b', badges:20, streak:45, weeklyRankChange:-1, monthlyRankChange:1 },
  { id:4,  name:'Priya Sharma',    initials:'PS', color:'#ec4899', flag:'🇮🇳', region:'Asia',     carbonScore:2.0, improvement:35, weeklyXP:2180, monthlyXP:9200,  totalXP:27000, greenPoints:8100,  level:'Carbon Crusher',  levelIcon:'⚡', levelColor:'#6366f1', badges:17, streak:38, weeklyRankChange:2, monthlyRankChange:-1, categoryBest:'Food' },
  { id:5,  name:'Lars Andersen',   initials:'LA', color:'#3b82f6', flag:'🇸🇪', region:'Europe',   carbonScore:2.1, improvement:33, weeklyXP:2050, monthlyXP:8600,  totalXP:24000, greenPoints:7400,  level:'Carbon Crusher',  levelIcon:'⚡', levelColor:'#6366f1', badges:15, streak:29, weeklyRankChange:0, monthlyRankChange:2 },
  { id:6,  name:'Amara Osei',      initials:'AO', color:'#f97316', flag:'🇬🇭', region:'Africa',   carbonScore:2.2, improvement:31, weeklyXP:1920, monthlyXP:7900,  totalXP:21000, greenPoints:6800,  level:'Carbon Crusher',  levelIcon:'⚡', levelColor:'#6366f1', badges:14, streak:22, weeklyRankChange:-2, monthlyRankChange:0, categoryBest:'Transport' },
  { id:7,  name:'Sofia Müller',    initials:'SM', color:'#a855f7', flag:'🇩🇪', region:'Europe',   carbonScore:2.3, improvement:29, weeklyXP:1780, monthlyXP:7200,  totalXP:19000, greenPoints:6200,  level:'Carbon Crusher',  levelIcon:'⚡', levelColor:'#6366f1', badges:13, streak:18, weeklyRankChange:1, monthlyRankChange:-2, categoryBest:'Energy' },
  { id:8,  name:"James O'Brien",   initials:'JO', color:'#14b8a6', flag:'🇮🇪', region:'Europe',   carbonScore:2.4, improvement:27, weeklyXP:1640, monthlyXP:6700,  totalXP:17000, greenPoints:5700,  level:'Carbon Crusher',  levelIcon:'⚡', levelColor:'#6366f1', badges:12, streak:15, weeklyRankChange:0, monthlyRankChange:1 },
  { id:9,  name:'You',             initials:'YO', color:'#10b981', flag:'🌐', region:'Asia',      carbonScore:4.7, improvement:24, weeklyXP:1520, monthlyXP:6100,  totalXP:15400, greenPoints:4200,  level:'Green Explorer',  levelIcon:'🌿', levelColor:'#10b981', badges:5,  streak:12, weeklyRankChange:3, monthlyRankChange:2, isYou:true },
  { id:10, name:'Ana Ferreira',    initials:'AF', color:'#22d3ee', flag:'🇧🇷', region:'Americas', carbonScore:2.7, improvement:24, weeklyXP:1490, monthlyXP:5800,  totalXP:14000, greenPoints:5100,  level:'Green Explorer',  levelIcon:'🌿', levelColor:'#10b981', badges:10, streak:11, weeklyRankChange:-1, monthlyRankChange:0 },
  { id:11, name:'Tom Clarke',      initials:'TC', color:'#84cc16', flag:'🇬🇧', region:'Europe',   carbonScore:2.8, improvement:22, weeklyXP:1350, monthlyXP:5400,  totalXP:13000, greenPoints:4800,  level:'Green Explorer',  levelIcon:'🌿', levelColor:'#10b981', badges:9,  streak:9,  weeklyRankChange:2, monthlyRankChange:-1 },
  { id:12, name:'Fatima Al-Said',  initials:'FA', color:'#fb923c', flag:'🇸🇦', region:'Asia',     carbonScore:2.9, improvement:20, weeklyXP:1220, monthlyXP:4900,  totalXP:11500, greenPoints:4400,  level:'Green Explorer',  levelIcon:'🌿', levelColor:'#10b981', badges:8,  streak:7,  weeklyRankChange:0, monthlyRankChange:3 },
  { id:13, name:'Noah Williams',   initials:'NW', color:'#60a5fa', flag:'🇺🇸', region:'Americas', carbonScore:3.0, improvement:18, weeklyXP:1100, monthlyXP:4400,  totalXP:10000, greenPoints:4000,  level:'Green Explorer',  levelIcon:'🌿', levelColor:'#10b981', badges:7,  streak:6,  weeklyRankChange:-3, monthlyRankChange:0 },
  { id:14, name:'Elena Popova',    initials:'EP', color:'#e879f9', flag:'🇷🇺', region:'Europe',   carbonScore:3.2, improvement:16, weeklyXP:980,  monthlyXP:3900,  totalXP:9000,  greenPoints:3600,  level:'Green Explorer',  levelIcon:'🌿', levelColor:'#10b981', badges:6,  streak:5,  weeklyRankChange:1, monthlyRankChange:-2 },
  { id:15, name:'Kai Patel',       initials:'KP', color:'#34d399', flag:'🇳🇿', region:'Oceania',  carbonScore:3.3, improvement:15, weeklyXP:860,  monthlyXP:3500,  totalXP:8200,  greenPoints:3200,  level:'Eco Rookie',      levelIcon:'🌱', levelColor:'#71717a', badges:5,  streak:4,  weeklyRankChange:0, monthlyRankChange:1 },
  { id:16, name:'Maya Johansson',  initials:'MJ', color:'#818cf8', flag:'🇸🇪', region:'Europe',   carbonScore:3.5, improvement:13, weeklyXP:740,  monthlyXP:2900,  totalXP:7200,  greenPoints:2800,  level:'Eco Rookie',      levelIcon:'🌱', levelColor:'#71717a', badges:4,  streak:3,  weeklyRankChange:2, monthlyRankChange:0 },
  { id:17, name:'Carlos Vega',     initials:'CV', color:'#f472b6', flag:'🇲🇽', region:'Americas', carbonScore:3.6, improvement:11, weeklyXP:620,  monthlyXP:2400,  totalXP:6200,  greenPoints:2400,  level:'Eco Rookie',      levelIcon:'🌱', levelColor:'#71717a', badges:3,  streak:2,  weeklyRankChange:-1, monthlyRankChange:-3 },
  { id:18, name:'Aisha Adeyemi',   initials:'AA', color:'#4ade80', flag:'🇳🇬', region:'Africa',   carbonScore:3.7, improvement:9,  weeklyXP:500,  monthlyXP:2000,  totalXP:5400,  greenPoints:2000,  level:'Eco Rookie',      levelIcon:'🌱', levelColor:'#71717a', badges:2,  streak:2,  weeklyRankChange:0, monthlyRankChange:1 },
  { id:19, name:'Raj Patel',       initials:'RP', color:'#fbbf24', flag:'🇮🇳', region:'Asia',     carbonScore:3.9, improvement:7,  weeklyXP:380,  monthlyXP:1500,  totalXP:4600,  greenPoints:1700,  level:'Eco Rookie',      levelIcon:'🌱', levelColor:'#71717a', badges:2,  streak:1,  weeklyRankChange:1, monthlyRankChange:0 },
  { id:20, name:'Sarah Kim',       initials:'SK', color:'#f87171', flag:'🇰🇷', region:'Asia',     carbonScore:4.1, improvement:5,  weeklyXP:260,  monthlyXP:1100,  totalXP:3800,  greenPoints:1400,  level:'Eco Rookie',      levelIcon:'🌱', levelColor:'#71717a', badges:1,  streak:1,  weeklyRankChange:0, monthlyRankChange:-1 },
]

const MOST_IMPROVED: User[] = [
  { ...ALL_USERS[3],  improvement: 62, weeklyRankChange: 8 },
  { ...ALL_USERS[11], improvement: 54, weeklyRankChange: 6 },
  { ...ALL_USERS[8],  improvement: 48, weeklyRankChange: 5, isYou: true },
  { ...ALL_USERS[16], improvement: 44, weeklyRankChange: 4 },
  { ...ALL_USERS[17], improvement: 38, weeklyRankChange: 3 },
]

type Period = 'weekly' | 'monthly' | 'alltime'
type Region = 'All' | 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania'

const PERIOD_SORT: Record<Period, keyof User> = {
  weekly: 'weeklyXP',
  monthly: 'monthlyXP',
  alltime: 'totalXP',
}

// ─── Medal ────────────────────────────────────────────────────────────────────
function Medal({ rank }: { rank: number }) {
  if (rank === 1) return <div style={{ fontSize: 20 }}>🥇</div>
  if (rank === 2) return <div style={{ fontSize: 18 }}>🥈</div>
  if (rank === 3) return <div style={{ fontSize: 18 }}>🥉</div>
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#52525b' }}>
      {rank}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = 40 }: { user: User; size?: number }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.3, background: `${user.color}20`,
        border: `2px solid ${user.isYou ? '#10b981' : user.color + '50'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.34, fontWeight: 800, color: user.color,
        boxShadow: user.isYou ? '0 0 12px rgba(16,185,129,0.4)' : 'none' }}>
        {user.initials}
      </div>
      {user.isYou && (
        <div style={{ position: 'absolute', bottom: -4, right: -4, background: '#10b981', borderRadius: 6, padding: '1px 5px', fontSize: 8, fontWeight: 800, color: '#000' }}>
          YOU
        </div>
      )}
    </div>
  )
}

// ─── Rank Change ──────────────────────────────────────────────────────────────
function RankChange({ change }: { change: number }) {
  if (change === 0) return <span style={{ fontSize: 11, color: '#3f3f46', display: 'flex', alignItems: 'center', gap: 2 }}><Minus size={11} /></span>
  if (change > 0) return <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 700 }}><ChevronUp size={13} />{change}</span>
  return <span style={{ fontSize: 11, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 700 }}><ChevronDown size={13} />{Math.abs(change)}</span>
}

// ─── Podium ───────────────────────────────────────────────────────────────────
function Podium({ users }: { users: User[] }) {
  const GOLDS = ['#f59e0b', '#a1a1aa', '#cd7c2f']
  const ORDER = [1, 0, 2] // display order: 2nd, 1st, 3rd
  const HEIGHTS = [110, 140, 85]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0, marginBottom: 32 }}>
      {ORDER.map((idx, pos) => {
        const user = users[idx]
        if (!user) return null
        const rank = idx + 1
        const gold = GOLDS[idx]
        const height = HEIGHTS[pos]

        return (
          <motion.div key={user.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: pos * 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 180 }}>

            {/* User card above */}
            <div style={{ textAlign: 'center', marginBottom: 16, padding: '0 8px' }}>
              {rank === 1 && (
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: 24, marginBottom: 6 }}>👑</motion.div>
              )}
              <motion.div animate={rank === 1 ? { boxShadow: [`0 0 0px ${gold}00`, `0 0 24px ${gold}70`, `0 0 0px ${gold}00`] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: rank === 1 ? 70 : 58, height: rank === 1 ? 70 : 58, borderRadius: rank === 1 ? 22 : 18,
                  background: `${gold}22`, border: `2px solid ${gold}70`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
                  fontSize: rank === 1 ? 26 : 21, fontWeight: 800, color: gold }}>
                {user.initials}
              </motion.div>
              <p style={{ fontSize: rank === 1 ? 15 : 13, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{user.name}</p>
              <p style={{ fontSize: 11, color: '#71717a', margin: '0 0 6px' }}>{user.flag} {user.level}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${gold}18`, border: `1px solid ${gold}30`,
                borderRadius: 99, padding: '3px 10px', fontSize: 12, fontWeight: 700, color: gold }}>
                ⚡ {user.weeklyXP.toLocaleString()} XP
              </div>
            </div>

            {/* Pedestal */}
            <div style={{ width: '80%', height, background: `linear-gradient(180deg, ${gold}18 0%, ${gold}08 100%)`,
              border: `1px solid ${gold}30`, borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'flex-start',
              justifyContent: 'center', paddingTop: 14 }}>
              <span style={{ fontSize: rank === 1 ? 32 : 26 }}>{['🥇','🥈','🥉'][idx]}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── User Row ─────────────────────────────────────────────────────────────────
function UserRow({ user, rank, period, animate: anim }: { user: User; rank: number; period: Period; animate: boolean }) {
  const xpKey = PERIOD_SORT[period]
  const xp = user[xpKey] as number
  const maxXP = period === 'weekly' ? 2840 : period === 'monthly' ? 11200 : 45000
  const pct = (xp / maxXP) * 100
  const change = period === 'weekly' ? user.weeklyRankChange : user.monthlyRankChange

  return (
    <motion.div
      layout
      initial={anim ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.04 }}
      style={{
        display: 'grid', gridTemplateColumns: '48px 1fr 90px 110px 100px 70px 60px',
        alignItems: 'center', gap: 12, padding: '13px 20px',
        borderRadius: 14, cursor: 'pointer', transition: 'background 0.18s',
        background: user.isYou ? 'rgba(16,185,129,0.06)' : 'transparent',
        border: `1px solid ${user.isYou ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
        marginBottom: 3,
      }}
      onMouseEnter={e => { if (!user.isYou) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
      onMouseLeave={e => { if (!user.isYou) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {/* Rank */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Medal rank={rank} />
      </div>

      {/* Name + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
        <Avatar user={user} size={38} />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: user.isYou ? '#10b981' : '#e4e4e7', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
            {user.categoryBest && (
              <span style={{ fontSize: 10, color: '#6366f1', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', padding: '1px 6px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                Best {user.categoryBest}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11, color: '#52525b' }}>{user.flag}</span>
            <span style={{ fontSize: 11, color: user.levelColor, fontWeight: 600 }}>{user.levelIcon} {user.level}</span>
          </div>
        </div>
      </div>

      {/* Carbon score */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: user.carbonScore < 2 ? '#10b981' : user.carbonScore < 3 ? '#f59e0b' : '#f97316', margin: 0, lineHeight: 1 }}>{user.carbonScore}t</p>
        <p style={{ fontSize: 10, color: '#3f3f46', margin: '2px 0 0' }}>CO₂/yr</p>
      </div>

      {/* XP bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#52525b' }}>XP</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>{xp.toLocaleString()}</span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #f59e0b90, #f59e0b)' }} />
        </div>
      </div>

      {/* Green points */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981', margin: 0 }}>🟢 {user.greenPoints.toLocaleString()}</p>
        <p style={{ fontSize: 10, color: '#3f3f46', margin: '2px 0 0' }}>Points</p>
      </div>

      {/* Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
        <Flame size={13} color="#f97316" />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>{user.streak}</span>
      </div>

      {/* Rank change */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <RankChange change={change} />
      </div>
    </motion.div>
  )
}

// ─── Most Improved Card ───────────────────────────────────────────────────────
function ImprovedCard({ user, rank }: { user: User; rank: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rank * 0.08 }}
      whileHover={{ y: -2 }}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14,
        background: user.isYou ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${user.isYou ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
        marginBottom: 8, cursor: 'pointer' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#52525b', flexShrink: 0 }}>
        {rank}
      </div>
      <Avatar user={user} size={34} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: user.isYou ? '#10b981' : '#e4e4e7', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
        <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>{user.flag} {user.region}</p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: 16, fontWeight: 900, color: '#10b981', margin: 0, lineHeight: 1 }}>↓{user.improvement}%</p>
        <p style={{ fontSize: 10, color: '#52525b', margin: '2px 0 0' }}>footprint</p>
      </div>
    </motion.div>
  )
}

// ─── Category Leader ──────────────────────────────────────────────────────────
const CATEGORY_LEADERS = [
  { cat: 'Transport', icon: Car,   color: '#6366f1', user: ALL_USERS[5], score: '0.12t' },
  { cat: 'Energy',    icon: Zap,   color: '#f59e0b', user: ALL_USERS[6], score: '0.08t' },
  { cat: 'Travel',    icon: Plane, color: '#3b82f6', user: ALL_USERS[2], score: '0.05t' },
  { cat: 'Food',      icon: Wind,  color: '#10b981', user: ALL_USERS[3], score: '0.18t' },
]

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('weekly')
  const [region, setRegion] = useState<Region>('All')
  const [search, setSearch] = useState('')
  const [animateKey, setAnimateKey] = useState(0)
  const [activeSection, setActiveSection] = useState<'champions' | 'improved' | 'category'>('champions')

  // Sort and filter
  const sorted = useMemo(() => {
    const key = PERIOD_SORT[period]
    let list = [...ALL_USERS].sort((a, b) => (b[key] as number) - (a[key] as number))
    if (region !== 'All') list = list.filter(u => u.region === region)
    if (search.trim()) list = list.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [period, region, search])

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  function changePeriod(p: Period) {
    setPeriod(p)
    setAnimateKey(k => k + 1)
  }

  function changeRegion(r: Region) {
    setRegion(r)
    setAnimateKey(k => k + 1)
  }

  const REGIONS: Region[] = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania']
  const PERIODS: { key: Period; label: string }[] = [
    { key: 'weekly', label: '🗓 This Week' },
    { key: 'monthly', label: '📅 This Month' },
    { key: 'alltime', label: '🏆 All Time' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050f0a', fontFamily: 'Inter, system-ui, sans-serif', color: '#f0fdf4' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.018) 1px,transparent 1px)', backgroundSize: '72px 72px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,15,10,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="#34d399" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Carbon<span style={{ color: '#34d399' }}>Twin</span> <span style={{ color: '#10b981', fontSize: 11 }}>AI</span></span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Trophy size={15} color="#f59e0b" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>Community Leaderboard</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
              { href: '/rewards',   icon: Award,    label: 'Rewards' },
              { href: '/coach',     icon: Sparkles, label: 'Coach' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Link key={i} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', fontSize: 12, textDecoration: 'none' }}>
                  <Icon size={12} />{item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 99, padding: '5px 16px', marginBottom: 14 }}>
            <Globe size={13} color="#f59e0b" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Live Rankings · 20,847 active members</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.03em' }}>
            Eco Champions Leaderboard
          </h1>
          <p style={{ fontSize: 15, color: '#52525b', margin: 0 }}>
            Compete, inspire, and track your community's collective impact
          </p>
        </motion.div>

        {/* ── Global stats ────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { icon: Users,     value: '20,847', label: 'Total Members',      color: '#6366f1', sub: '+284 this week' },
            { icon: TrendingDown,value: '3.2t', label: 'Community Avg CO₂',  color: '#10b981', sub: '↓ from 4.1t last yr' },
            { icon: Flame,     value: '1,204',  label: 'Active Streaks',      color: '#f97316', sub: 'across the community' },
            { icon: Sparkles,  value: '142t',   label: 'CO₂ Saved This Week', color: '#f59e0b', sub: 'by top 100 users' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2 }}
                style={{ padding: '18px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.color}18`, border: `1px solid ${s.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={s.color} />
                  </div>
                </div>
                <p style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 3px', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: '#a1a1aa', margin: '0 0 4px', fontWeight: 600 }}>{s.label}</p>
                <p style={{ fontSize: 11, color: '#3f3f46', margin: 0 }}>{s.sub}</p>
              </motion.div>
            )
          })}
        </div>

        {/* ── Main layout: left (leaderboard) + right (side panels) ──────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: Main leaderboard ───────────────────────────────────── */}
          <div>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Period tabs */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, gap: 4 }}>
                {PERIODS.map(p => (
                  <button key={p.key} onClick={() => changePeriod(p.key)}
                    style={{ padding: '7px 16px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
                      background: period === p.key ? '#f59e0b' : 'transparent',
                      color: period === p.key ? '#000' : '#71717a' }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ flex: 1, maxWidth: 280, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
                borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Search size={14} color="#52525b" style={{ flexShrink: 0 }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search players…"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#e4e4e7', fontFamily: 'inherit' }} />
              </div>
            </div>

            {/* Region filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#52525b', marginRight: 4 }}>
                <Filter size={12} /> Region:
              </span>
              {REGIONS.map(r => (
                <button key={r} onClick={() => changeRegion(r)}
                  style={{ padding: '5px 13px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                    background: region === r ? '#10b981' : 'rgba(255,255,255,0.04)',
                    color: region === r ? '#000' : '#71717a' }}>
                  {r}
                </button>
              ))}
            </div>

            {/* Main leaderboard card */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, overflow: 'hidden' }}>

              {/* Podium — only show for top 3+ users */}
              {top3.length === 3 && (
                <div style={{ padding: '32px 24px 0', background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)' }}>
                  <Podium users={top3} />
                </div>
              )}

              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 90px 110px 100px 70px 60px',
                gap: 12, padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#', 'Player', 'CO₂/yr', `${period === 'weekly' ? 'Weekly' : period === 'monthly' ? 'Monthly' : 'Total'} XP`, 'Points', 'Streak', 'Δ'].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#3f3f46', letterSpacing: '0.08em', textTransform: 'uppercase',
                    textAlign: i >= 2 ? 'center' : 'left' }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              <AnimatePresence mode="wait">
                <motion.div key={animateKey} style={{ padding: '8px 0' }}>
                  {sorted.map((user, i) => (
                    <UserRow key={user.id} user={user} rank={i + 1} period={period} animate={true} />
                  ))}
                  {sorted.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#52525b' }}>
                      <Search size={24} style={{ margin: '0 auto 10px', display: 'block' }} />
                      <p style={{ fontSize: 14, margin: 0 }}>No players found for "{search}"</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── RIGHT: Side panels ───────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Your position CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 18, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌿</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981', margin: '0 0 1px' }}>Your Ranking</p>
                  <p style={{ fontSize: 11, color: '#52525b', margin: 0 }}>Green Explorer · LVL 2</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Global Rank', value: '#9' },
                  { label: 'Weekly XP', value: '1,520' },
                  { label: 'Green Points', value: '4,200' },
                  { label: 'Streak', value: '🔥 12' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#10b981', margin: '0 0 2px' }}>{s.value}</p>
                    <p style={{ fontSize: 10, color: '#52525b', margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#71717a', margin: '0 0 10px', textAlign: 'center' }}>
                Score <strong style={{ color: '#10b981' }}>528 more XP</strong> to reach Top 5 🎯
              </p>
              <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 10 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.2, delay: 0.5 }}
                  style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
              </div>
              <Link href="/rewards" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, background: '#10b981', color: '#000', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                <Award size={14} /> View My Rewards <ChevronUp size={14} />
              </Link>
            </motion.div>

            {/* Most Improved */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <TrendingUp size={16} color="#10b981" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Most Improved</h3>
                <span style={{ fontSize: 10, color: '#71717a', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '1px 7px', borderRadius: 99, marginLeft: 'auto' }}>This Month</span>
              </div>
              {MOST_IMPROVED.map((u, i) => (
                <ImprovedCard key={u.id} user={u} rank={i + 1} />
              ))}
            </motion.div>

            {/* Category leaders */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Star size={15} color="#f59e0b" fill="#f59e0b" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Category Leaders</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CATEGORY_LEADERS.map((cl, i) => {
                  const Icon = cl.icon
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12,
                      background: `${cl.color}08`, border: `1px solid ${cl.color}20` }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: `${cl.color}18`, border: `1px solid ${cl.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={14} color={cl.color} />
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#e4e4e7', margin: '0 0 1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cl.user.name}</p>
                        <p style={{ fontSize: 10, color: '#52525b', margin: 0 }}>{cl.cat} Champion</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: cl.color, margin: 0 }}>{cl.score}</p>
                        <p style={{ fontSize: 10, color: '#3f3f46', margin: '1px 0 0' }}>CO₂</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Weekly challenge leaderboard mini */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 18, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Zap size={15} color="#6366f1" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>This Week's Challenges</h3>
              </div>
              <div style={{ marginBottom: 14 }}>
                {[
                  { label: 'Public Transport',   done: 847, total: 1200, color: '#6366f1' },
                  { label: 'Zero Food Delivery', done: 623, total: 1200, color: '#10b981' },
                  { label: 'Reduce Electricity', done: 1104, total: 1200, color: '#f59e0b' },
                ].map((c, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#71717a' }}>{c.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.done.toLocaleString()} /{c.total.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(c.done/c.total)*100}%` }}
                        transition={{ duration: 1.1, delay: 0.6 + i * 0.1 }}
                        style={{ height: '100%', borderRadius: 99, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#52525b', margin: '0 0 10px', textAlign: 'center' }}>
                Community completing challenges together 💪
              </p>
              <Link href="/rewards" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                Join Challenges <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <style>{`
        input::placeholder { color: #3f3f46; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      `}</style>
    </div>
  )
}
