import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050f0a',
}

export const metadata: Metadata = {
  title: {
    default: 'CarbonTwin AI — See Your Carbon Future Before You Create It',
    template: '%s | CarbonTwin AI',
  },
  description:
    'CarbonTwin AI creates a digital twin of your daily habits and shows how your choices shape the future. Assess your lifestyle, simulate your carbon footprint, and reduce emissions with AI.',
  keywords: ['carbon footprint', 'AI', 'sustainability', 'climate', 'digital twin', 'emissions', 'eco', 'green tech'],
  authors: [{ name: 'CarbonTwin AI' }],
  openGraph: {
    title: 'CarbonTwin AI — See Your Carbon Future Before You Create It',
    description: 'CarbonTwin AI creates a digital twin of your daily habits and shows how your choices shape the future.',
    type: 'website',
    siteName: 'CarbonTwin AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarbonTwin AI',
    description: 'See Your Carbon Future Before You Create It.',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400&display=swap"
          rel="stylesheet"
        />
        {/* Favicon placeholder */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23050f0a'/><text y='22' x='4' font-size='20'>🌿</text></svg>" />
      </head>
      <body className="min-h-full flex flex-col antialiased"
        style={{ background: '#050f0a', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
