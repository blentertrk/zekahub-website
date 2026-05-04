'use client'

import { PhoneIncoming, PhoneOutgoing, Zap } from 'lucide-react'

const ozellikler = [
  {
    icon: PhoneIncoming,
    baslik: 'Gelen Aramalar',
    aciklama: 'Müşterilerinizi 7/24 karşılayan AI asistanlar. Yönlendirme, bilgilendirme ve randevu alma tamamen otomatik.',
  },
  {
    icon: PhoneOutgoing,
    baslik: 'Giden Aramalar',
    aciklama: 'Toplu arama kampanyaları, hatırlatıcılar ve satış aramaları. Yüzlerce müşteriyle aynı anda iletişim kurun.',
  },
  {
    icon: Zap,
    baslik: 'Anlık Entegrasyon',
    aciklama: 'CRM, takvim ve iş akışı araçlarıyla entegrasyon. Her arama otomatik kayıt altına alınır.',
  },
]

export default function CallAutomation() {
  return (
    <section id="ozellikler" className="py-24 px-4 bg-[#07070f]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title text-white mb-3">
            Gelen ve Giden Aramalarda{' '}
            <span className="text-gradient-gold">Tam Otomasyon</span>
          </h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto">
            Müşteri çağrı merkezinizi yapay zeka ile güçlendirin. Maliyet düşer, verimlilik artar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ozellikler.map((o) => {
            const Icon = o.icon
            return (
              <div key={o.baslik} className="card-dark p-7 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-[#f5c842]/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={26} className="text-[#f5c842]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{o.baslik}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{o.aciklama}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
