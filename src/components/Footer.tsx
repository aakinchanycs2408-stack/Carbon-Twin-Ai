'use client'

import { Leaf, GitFork, Link2, Mail, X, BarChart2, Zap, MessageSquare, Trophy, Award, ClipboardList } from 'lucide-react'

const APP_PAGES = [
  { label: 'Carbon Assessment', href: '/assessment', icon: ClipboardList, color: '#10b981' },
  { label: 'Analytics Dashboard', href: '/dashboard',  icon: BarChart2,    color: '#6366f1' },
  { label: 'Impact Simulator',   href: '/simulator',  icon: Zap,          color: '#f59e0b' },
  { label: 'AI Eco Coach',       href: '/coach',      icon: MessageSquare,color: '#a855f7' },
  { label: 'Rewards & XP',       href: '/rewards',    icon: Award,        color: '#ec4899' },
  { label: 'Leaderboard',        href: '/leaderboard',icon: Trophy,       color: '#f97316' },
]

const COMPANY_LINKS = ['About', 'Blog', 'Careers', 'Press Kit']
const LEGAL_LINKS   = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security']

const socials = [
  { Icon: X,        label: 'X / Twitter' },
  { Icon: GitFork,  label: 'GitHub'      },
  { Icon: Link2,    label: 'LinkedIn'    },
  { Icon: Mail,     label: 'Email'       },
]

export default function Footer() {
  return (
    <footer style={{ background: '#050f0a', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 72, paddingBottom: 32 }}>
      <div className="container-main">

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.4fr 1fr 1fr', gap: 48, marginBottom: 64 }}>

          {/* Brand column */}
          <div>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={15} color="#34d399" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>
                Carbon<span style={{ color: '#34d399' }}>Twin</span>{' '}
                <span style={{ color: '#10b981', fontSize: 11, fontWeight: 600 }}>AI</span>
              </span>
            </a>
            <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7, marginBottom: 20, maxWidth: 220 }}>
              Building the intelligence layer for personal climate action. See your carbon future before you create it.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {socials.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', textDecoration: 'none', transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                  <Icon size={13} />
                </a>
              ))}
            </div>
            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>All systems operational</span>
            </div>
          </div>

          {/* App pages */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#71717a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APP_PAGES.map(page => {
                const Icon = page.icon
                return (
                  <li key={page.href}>
                    <a href={page.href}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#3f3f46', textDecoration: 'none', padding: '5px 0', transition: 'color 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = page.color }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#3f3f46' }}>
                      <Icon size={13} color={page.color} style={{ flexShrink: 0, opacity: 0.7 }} />
                      {page.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#71717a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COMPANY_LINKS.map(link => (
                <li key={link}>
                  <a href="#" style={{ fontSize: 13, color: '#3f3f46', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#a1a1aa')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3f3f46')}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#71717a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LEGAL_LINKS.map(link => (
                <li key={link}>
                  <a href="#" style={{ fontSize: 13, color: '#3f3f46', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#a1a1aa')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3f3f46')}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)', marginBottom: 24 }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#27272a', margin: 0 }}>
            © 2025 CarbonTwin AI · Built for the planet 🌍
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#27272a', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#71717a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#27272a')}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
    </footer>
  )
}
