'use client'

import { Globe2 } from 'lucide-react'

const diller = ['Türkçe', 'İngilizce', 'Almanca', 'Fransızca', 'Arapça', 'İspanyolca', 'Rusça', 'Çince']

export default function CokDilli() {
  return (
    <section className="py-24 px-4 bg-[#07070f]">
      <div className="max-w-5xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#f5c842]/10 flex items-center justify-center mx-auto mb-6">
          <Globe2 size={32} className="text-[#f5c842]" />
        </div>

        <h2 className="section-title text-white mb-4">
          Çok Dilli Yapay Zeka Ses{' '}
          <span className="text-gradient-gold">Asistanları</span>
        </h2>

        <p className="text-white/50 text-base leading-relaxed mb-4 max-w-2xl mx-auto">
          Zeka Hub, yüksek kaliteli, doğal konuşma sesiyle birden fazla dili destekler. Dünyanın her yerindeki müşterilerinizle, onların dilinde iletişim kurun.
        </p>
        <p className="text-white/40 text-sm leading-relaxed mb-3 max-w-xl mx-auto">
          Desteklenen platformlar: Telefon, WhatsApp, Instagram, Web Ajan ve daha fazlası.
        </p>
        <p className="text-white/30 text-sm mb-10">
          Her dil, ilgili kültür ve aksan tercihlerine göre özelleştirilebilir.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {diller.map((dil) => (
            <div
              key={dil}
              className="px-5 py-2.5 rounded-full bg-[#f5c842]/8 border border-[#f5c842]/20 text-[#f5c842] text-sm font-semibold hover:bg-[#f5c842]/15 transition-colors cursor-default"
            >
              {dil}
            </div>
          ))}
          <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-sm font-semibold">
            +30 dil daha
          </div>
        </div>
      </div>
    </section>
  )
}
