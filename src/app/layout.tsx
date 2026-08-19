import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Data Portfolio — Yassin Mary',
  description: 'Analyses de données interactives : cybersécurité, transport, GTFS. Portfolio de Yassin Mary, Data Analyst.',
  openGraph: {
    title: 'Data Portfolio — Yassin Mary',
    description: 'Analyses de données interactives',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            marginTop: '6rem',
            padding: '2rem 0',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-3)',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
          }}
        >
          Yassin Mary · Data Portfolio 2026
        </footer>
      </body>
    </html>
  )
}
