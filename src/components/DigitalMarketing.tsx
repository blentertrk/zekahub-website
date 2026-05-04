'use client'

import { Check, Star } from 'lucide-react'

const paketler = [
  {
    isim: 'AI Satış Motoru',
    alt: 'Başlangıç',
    fiyat: 149,
    renk: '#f5c842',
    vurgu: false,
    ozellikler: [
      '1 yapay zeka satış asistanı',
      'Aylık 500 arama dakikası',
      'WhatsApp entegrasyonu',
      'Temel CRM paneli',
      'E-posta desteği',
      'Haftalık raporlama',
    ],
  },
  {
    isim: 'AI Satış Motoru',
    alt: 'Gelişme',
    fiyat: 179,
    renk: '#8b5cf6',
    vurgu: true,
    ozellikler: [
      '3 yapay zeka satış asistanı',
      'Aylık 2.000 arama dakikası',
      'WhatsApp + Instagram DM',
      'Gelişmiş CRM + raporlama',
      'Öncelikli e-posta ve chat desteği',
      'Günlük raporlama',
      'A/B test özelliği',
    ],
  },
  {
    isim: 'AI Satış Motoru',
    alt: 'Profesyonel',
    fiyat: 219,
    renk: '#ff6b2b',
    vurgu: false,
    ozellikler: [
      'Sınırsız yapay zeka asistanı',
      'Aylık 10.000 arama dakikası',
      'Tüm kanal entegrasyonları',
      'Özel CRM entegrasyonu',
      '7/24 öncelikli destek',
      'Gerçek zamanlı raporlama',
      'Özel AI eğitimi',
      'Dedicated hesap yöneticisi',
    ],
  },
]

const dijitalPaket = {
  isim: 'Dijital Marketing & Prodüksiyon',
  fiyat: 99,
  renk: '#25d366',
  ozellikler: [
    '30 adet sosyal medya içeriği',
    'Reel ve video prodüksiyon',
    'Grafik tasarım paketi',
    'Aylık strateji toplantısı',
    'Sosyal Medya Marketing Günleri',
  ],
}

export default function DigitalMarketing() {
  return (
    <section id="fiyatlar" className="py-24 px-4 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5c842]/10 border border-[#f5c842]/20 mb-5">
            <Star size={13} className="text-[#f5c842]" />
            <span className="text-[#f5c842] text-xs font-semibold tracking-wider uppercase">Özel Kampanya</span>
          </div>
          <h2 className="section-title text-white mb-3">
            DİJİTAL MARKETING &{' '}
            <span className="text-gradient-gold">PRODÜKSİYON PAKETLERİ</span>
          </h2>
          <p className="text-white/50 text-sm">
            ✦ Reklam, Içerik Üretimi ve Satış Otomasyonu Tek Pakette ✦
          </p>
        </div>

        {/* Ana paketler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {paketler.map((p) => (
            <div
              key={p.alt}
              className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 ${
                p.vurgu
                  ? 'bg-gradient-to-b from-[#1a1035] to-[#0f0f1a] border-[#8b5cf6]/40 shadow-2xl shadow-purple-500/10'
                  : 'bg-[#111124] border-white/8'
              }`}
            >
              {p.vurgu && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6d3fd4] text-white text-xs font-bold shadow-lg">
                  ⭐ En Popüler
                </div>
              )}

              <div className="mb-4">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{p.isim}</p>
                <h3 className="text-white font-black text-xl">{p.alt}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black" style={{ color: p.renk }}>
                  ${p.fiyat}
                </span>
                <span className="text-white/40 text-sm ml-1">/ay</span>
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
                  p.vurgu ? 'btn-purple' : 'btn-outline'
                }`}
              >
                Satın Al
              </a>
            </div>
          ))}
        </div>

        {/* Dijital Marketing paketi */}
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl p-6 border border-[#25d366]/25 bg-gradient-to-b from-[#0a1a0f] to-[#0d0d1a] hover:-translate-y-1 transition-all duration-300">
            <div className="text-center mb-4">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Paket</p>
              <h3 className="text-white font-black text-xl">{dijitalPaket.isim}</h3>
            </div>

            <div className="text-center mb-5">
              <span className="text-4xl font-black" style={{ color: dijitalPaket.renk }}>
                ${dijitalPaket.fiyat}
              </span>
              <span className="text-white/40 text-sm ml-1">/ay</span>
            </div>

            <ul className="space-y-2.5 mb-5">
              {dijitalPaket.ozellikler.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-white/70">
                  <Check size={14} className="mt-0.5 shrink-0 text-[#25d366]" />
                  {o}
                </li>
              ))}
            </ul>

            <p className="text-center text-[#25d366] text-xs font-semibold mb-4">
              ✦ Sosyal Medya Marketing Günleri ✦
            </p>

            <a href="#demo" className="block text-center btn-orange py-3 rounded-xl font-bold text-sm">
              Satın Al
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
