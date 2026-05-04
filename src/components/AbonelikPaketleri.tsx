'use client'

import { Check } from 'lucide-react'

const planlar = [
  {
    isim: 'Starter Paket',
    fiyat: 100,
    renk: '#f5c842',
    vurgu: false,
    ozellikler: [
      '1 AI asistan',
      'Aylık 500 dk kontör',
      'WhatsApp entegrasyonu',
      'Temel CRM paneli',
      'E-posta desteği',
      'Facebook & Instagram modülü',
    ],
  },
  {
    isim: 'Business Paket',
    fiyat: 150,
    renk: '#8b5cf6',
    vurgu: true,
    ozellikler: [
      '5 AI asistan',
      'Aylık 2.500 dk kontör',
      'Tüm kanal entegrasyonları',
      'WhatsApp Otomasyonu',
      'Yapay Zeka Satış Aracısı',
      'WhatsApp Chatbot',
      'Öncelikli destek',
    ],
  },
  {
    isim: 'Enterprise Paket',
    fiyat: 250,
    renk: '#ff6b2b',
    vurgu: false,
    enterprise: true,
    ozellikler: [
      'Sınırsız AI asistan',
      'Şirket içi CRM entegrasyonu',
      'Özel AI model eğitimi',
      'Dedicated hesap yöneticisi',
      '7/24 öncelikli destek',
      'SLA garantisi',
      'Tüm Business özellikleri',
    ],
  },
]

export default function AbonelikPaketleri() {
  return (
    <section className="py-24 px-4 bg-[#0a0a14]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title text-white mb-3">
            Aylık <span className="text-gradient-gold">Abonelik Paketleri</span>
          </h2>
          <p className="text-white/50 text-sm">İhtiyacınıza uygun paket seçin, büyüdükçe geçiş yapın</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {planlar.map((p) => (
            <div
              key={p.isim}
              className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 ${
                p.vurgu
                  ? 'bg-gradient-to-b from-[#1a1035] to-[#0f0f1a] border-[#8b5cf6]/40 shadow-2xl shadow-purple-500/10'
                  : 'bg-[#111124] border-white/8'
              }`}
            >
              {p.vurgu && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6d3fd4] text-white text-xs font-bold shadow-lg">
                  ⭐ Önerilen
                </div>
              )}

              <h3 className="text-white font-black text-lg mb-4">{p.isim}</h3>

              <div className="mb-6">
                <span className="text-4xl font-black" style={{ color: p.renk }}>${p.fiyat}</span>
                {p.enterprise ? (
                  <span className="text-white/40 text-sm ml-1">'dan başlayan /ay</span>
                ) : (
                  <span className="text-white/40 text-sm ml-1">/ay</span>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {p.ozellikler.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: p.renk }} />
                    {o}
                  </li>
                ))}
              </ul>

              <a
                href="#demo"
                className={`block text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 ${
                  p.vurgu ? 'btn-purple' : p.renk === '#ff6b2b' ? 'btn-orange' : 'btn-outline'
                }`}
              >
                {p.enterprise ? 'Teklif Al' : 'Satın Al'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
