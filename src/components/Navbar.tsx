'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, Menu, X, BarChart2, Zap, MessageSquare,
  Trophy, Award, ArrowRight
} from 'lucide-react'

const APP_LINKS = [
  { label: 'Dashboard',   href: '/dashboard',   icon: BarChart2,     color: '#10b981' },
  { label: 'Simulator',   href: '/simulator',   icon: Zap,           color: '#6366f1' },
  { label: 'Eco Coach',   href: '/coach',       icon: MessageSquare, color: '#f59e0b' },
  { label: 'Rewards',     href: '/rewards',     icon: Award,         color: '#a855f7' },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy,        color: '#f97316' },
]

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activePath, setActivePath]   = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    setActivePath(window.location.pathname)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
        background: scrolled ? 'rgba(5,12,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.6)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.6)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(16,185,129,0.12)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="container-main" style={{ display: 'flex', alignItems: 'center', height: 68, gap: 0 }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              width: 36, height: 36, borderRadius: 11,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
              border: '1px solid rgba(16,185,129,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16,185,129,0.2)',
            }}
          >
            <Leaf size={17} color="#34d399" />
          </motion.div>
          <span style={{ fontWeight: 800, fontSize: 15.5, color: '#fff', letterSpacing: '-0.025em' }}>
            Carbon<span style={{ color: '#34d399' }}>Twin</span>{' '}
            <span style={{
              color: '#10b981', fontSize: 11, fontWeight: 700,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 6, padding: '1px 6px', letterSpacing: '0.02em',
            }}>AI</span>
          </span>
        </a>

        {/* Nav links — centered */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }} className="desktop-nav">
          {APP_LINKS.map(item => {
            const Icon = item.icon
            const isActive = activePath === item.href
            return (
              <a key={item.href} href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
                  borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  transition: 'all 0.2s',
                  color: isActive ? '#fff' : '#71717a',
                  background: isActive ? `${item.color}15` : 'transparent',
                  border: `1px solid ${isActive ? item.color + '30' : 'transparent'}`,
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#e4e4e7'
                    el.style.background = 'rgba(255,255,255,0.05)'
                    el.style.borderColor = 'rgba(255,255,255,0.1)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#71717a'
                    el.style.background = 'transparent'
                    el.style.borderColor = 'transparent'
                  }
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 6,
                  background: isActive ? `${item.color}25` : 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'background 0.2s',
                }}>
                  <Icon size={11} color={isActive ? item.color : '#71717a'} />
                </div>
                {item.label}
                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 16, height: 2, borderRadius: 99, background: item.color,
                  }} />
                )}
              </a>
            )
          })}
        </nav>

        {/* CTA */}
        <a href="/assessment" id="nav-cta" className="btn-primary desktop-nav"
          style={{ padding: '9px 20px', fontSize: 13, borderRadius: 10, flexShrink: 0 }}>
          Start Assessment <ArrowRight size={13} />
        </a>

        {/* Mobile toggle */}
        <button id="mobile-menu-toggle" className="mobile-toggle"
          style={{ display: 'none', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, cursor: 'pointer', color: '#a1a1aa', padding: '6px 8px' }}
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; align-items: center; }
        }
      `}</style>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: 'rgba(5,12,8,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', backdropFilter: 'blur(24px)' }}
          >
            <div className="container-main" style={{ paddingTop: 16, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontSize: 10, color: '#3f3f46', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 0 6px' }}>Navigation</p>
              {APP_LINKS.map(item => {
                const Icon = item.icon
                return (
                  <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', color: '#a1a1aa', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: `${item.color}15`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={item.color} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e4e4e7' }}>{item.label}</span>
                  </a>
                )
              })}
              <a href="/assessment" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center', marginTop: 16 }}>
                Start Free Assessment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
