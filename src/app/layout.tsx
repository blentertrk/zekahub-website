import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zeka Hub — Yapay Zeka Ses Asistanları & Otomasyon',
  description: 'Tek bir yapay zeka asistanla, aynı anda 1000+ müşteriyle konuşun. Randevu, pazarlama, satış, takip, WhatsApp ve Instagram otomasyonları.',
  keywords: ['yapay zeka', 'sesli asistan', 'AI otomasyon', 'WhatsApp botu', 'CRM', 'dijital marketing'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.zekahub.com',
    siteName: 'Zeka Hub',
    title: 'Zeka Hub — Yapay Zeka Ses Asistanları & Otomasyon',
    description: 'Tek bir yapay zeka asistanla, aynı anda 1000+ müşteriyle konuşun.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[#07070f] text-white">
        {children}
      </body>
    </html>
  )
}
