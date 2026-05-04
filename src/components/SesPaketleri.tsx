'use client'

import { Mic } from 'lucide-react'

const paketler = [
  { dk: '1.000', fiyat: 19 },
  { dk: '2.500', fiyat: 39 },
  { dk: '5.000', fiyat: 69 },
  { dk: '10.000', fiyat: 119 },
  { dk: '20.000', fiyat: 199 },
  { dk: '30.000', fiyat: 279 },
  { dk: '50.000', fiyat: 399 },
  { dk: '100.000', fiyat: 699 },
]

export default function SesPaketleri() {
  return (
    <section className="py-24 px-4 bg-[#07070f]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title text-white mb-3">
            Esnek Ses Paketleri ve{' '}
            <span className="text-gradient-gold">Kontör Yükleme</span>
          </h2>
          <p className="text-white/50 text-sm">İhtiyacınıza göre paket seç, dakika bazında kullan</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {paketler.map((p, i) => (
            <div
              key={p.dk}
              className={`card-dark p-5 text-center group cursor-pointer ${
                i === 3 ? 'border-[#f5c842]/25 bg-gradient-to-b from-[#1a1505] to-[#0d0d1a]' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#f5c842]/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Mic size={18} className="text-[#f5c842]" />
              </div>
              <div className="text-2xl font-black text-white mb-0.5">
                {p.dk}
              </div>
              <div className="text-[#f5c842] text-sm font-semibold mb-3">dk</div>
              <div className="text-white/50 text-xs mb-4">${p.fiyat} / paket</div>
              <a
                href="#demo"
                className="block text-center py-2 px-4 rounded-lg text-xs font-bold transition-all hover:opacity-90 bg-[#f5c842]/15 border border-[#f5c842]/25 text-[#f5c842] hover:bg-[#f5c842]/25"
              >
                Yükle
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-xs mt-8">
          Paketler bir yıl süreyle geçerlidir. KDV dahil değildir.
        </p>
      </div>
    </section>
  )
}
