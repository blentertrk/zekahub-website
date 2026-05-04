'use client'

import { Instagram, Youtube, Twitter, Linkedin } from 'lucide-react'

const linkler = {
  Hizmetler: ['Sesli Asistanlar', 'WhatsApp Otomasyonu', 'Instagram DM', 'Web Otomasyonu', 'CRM Paneli'],
  Paketler: ['AI Satış Motoru', 'Dijital Marketing', 'Ses Paketleri', 'Abonelikler', 'Enterprise'],
  Şirket: ['Hakkımızda', 'Blog', 'İletişim', 'Gizlilik Politikası', 'Kullanım Şartları'],
}

const sosyalMedya = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-[#05050c] border-t border-white/5 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Marka */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5c842] to-[#ff6b2b] flex items-center justify-center">
                <span className="text-lg">🧠</span>
              </div>
              <span className="font-bold text-lg">
                <span className="text-[#f5c842]">Zeka</span>
                <span className="text-white"> Hub</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Tek bir yapay zeka asistanla, aynı anda 1000+ müşteriyle konuşun. İşletmenizin büyümesini hızlandırın.
            </p>
            <div className="flex gap-3">
              {sosyalMedya.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link grupları */}
          {Object.entries(linkler).map(([baslik, items]) => (
            <div key={baslik}>
              <h4 className="text-white font-bold text-sm mb-4">{baslik}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/40 text-sm hover:text-white/70 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt çizgi */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2024 Zeka Hub. Tüm hakları saklıdır.
          </p>
          <p className="text-white/20 text-xs">
            Yapay Zeka ile Güçlendirilmiştir 🧠
          </p>
        </div>
      </div>
    </footer>
  )
}
