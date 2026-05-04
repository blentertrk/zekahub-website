'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Ana Sayfa', href: '#hero' },
  { label: 'Hizmetlerimiz', href: '#hizmetler' },
  { label: 'Paketler & Fiyatlar', href: '#fiyatlar' },
  { label: 'Özellikler', href: '#ozellikler' },
  { label: 'Güvenlik', href: '#guvenlik' },
  { label: 'Neden Biz', href: '#neden-biz' },
  { label: 'İletişim', href: '#iletisim' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070f]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5c842] to-[#ff6b2b] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-lg">🧠</span>
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-[#f5c842]">Zeka</span>
            <span className="text-white"> Hub</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#giris"
            className="text-sm text-white/80 hover:text-white font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5 border border-white/10"
          >
            Giriş Yap
          </a>
          <a
            href="#demo"
            className="btn-orange text-sm"
          >
            Şimdi Deneyin
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Menüyü aç/kapat"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0d0d1a]/95 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-white/70 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10">
              <a href="#giris" className="btn-outline text-sm text-center">Giriş Yap</a>
              <a href="#demo" className="btn-orange text-sm text-center">Şimdi Deneyin</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
