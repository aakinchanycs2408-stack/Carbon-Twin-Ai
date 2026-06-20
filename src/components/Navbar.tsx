'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf, Menu, X, BarChart2, Zap, MessageSquare,
  Trophy, Award
} from 'lucide-react'

const APP_LINKS = [
  { label: 'Dashboard',  href: '/dashboard',   icon: BarChart2,     color: '#10b981' },
  { label: 'Simulator',  href: '/simulator',   icon: Zap,           color: '#6366f1' },
  { label: 'Eco Coach',  href: '/coach',       icon: MessageSquare, color: '#f59e0b' },
  { label: 'Rewards',    href: '/rewards',     icon: Award,         color: '#a855f7' },
  { label: 'Leaderboard',href: '/leaderboard', icon: Trophy,        color: '#f97316' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])



  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        background: scrolled ? 'rgba(5,15,10,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(16,185,129,0.12)' : '1px solid transparent',
      }}
    >
      <div className="container-main" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 0 }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={16} color="#34d399" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '-0.02em' }}>
            Carbon<span style={{ color: '#34d399' }}>Twin</span>{' '}
            <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>AI</span>
          </span>
        </a>

        {/* Nav links — centered */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }} className="desktop-nav">
          {APP_LINKS.map(item => {
            const Icon = item.icon
            return (
              <a key={item.href} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 9, textDecoration: 'none', color: '#a1a1aa', fontSize: 13, fontWeight: 500, transition: 'all 0.18s', border: '1px solid transparent' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#fff'
                  el.style.background = `${item.color}12`
                  el.style.borderColor = `${item.color}30`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#a1a1aa'
                  el.style.background = 'transparent'
                  el.style.borderColor = 'transparent'
                }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={11} color={item.color} />
                </div>
                {item.label}
              </a>
            )
          })}
        </nav>


        {/* CTA */}
        <a href="/assessment" id="nav-cta" className="btn-primary desktop-nav"
          style={{ padding: '9px 20px', fontSize: 13, borderRadius: 10, flexShrink: 0 }}>
          Start Free Assessment
        </a>

        {/* Mobile toggle */}
        <button id="mobile-menu-toggle" className="mobile-toggle"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', padding: 4 }}
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: 'rgba(5,15,10,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div className="container-main" style={{ paddingTop: 16, paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[{ label: 'Features', href: '#features' }, { label: 'How It Works', href: '#how-it-works' }, { label: 'Impact', href: '#stats' }].map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  style={{ fontSize: 14, color: '#a1a1aa', textDecoration: 'none', fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {link.label}
                </a>
              ))}
              <p style={{ fontSize: 11, color: '#3f3f46', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '12px 0 6px' }}>App</p>
              {APP_LINKS.map(item => {
                const Icon = item.icon
                return (
                  <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', color: '#a1a1aa', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Icon size={15} color={item.color} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                  </a>
                )
              })}
              <a href="/assessment" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center', marginTop: 14 }}>
                Start Free Assessment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
