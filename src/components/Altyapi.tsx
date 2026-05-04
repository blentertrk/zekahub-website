'use client'

import { Phone, Shield, Cpu, Zap } from 'lucide-react'

export default function Altyapi() {
  return (
    <section id="guvenlik" className="py-24 px-4 bg-[#0a0a14]">
      <div className="max-w-5xl mx-auto">
        {/* SIP Trunk */}
        <div className="text-center mb-16">
          <div className="w-14 h-14 rounded-2xl bg-[#f5c842]/10 flex items-center justify-center mx-auto mb-5">
            <Phone size={26} className="text-[#f5c842]" />
          </div>
          <h2 className="section-title text-white mb-4">
            Telefon Numarası ve{' '}
            <span className="text-gradient-gold">SIP Trunk Altyapısı</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-2xl mx-auto mb-3">
            İşletmeniz için özel telefon numaraları ve SIP trunk bağlantıları sağlıyoruz. Tek bir numara üzerinden yüzlerce eş zamanlı görüşme yapabilirsiniz.
          </p>
          <p className="text-white/40 text-sm leading-relaxed max-w-xl mx-auto">
            Operatörlerden bağımsız altyapımız; yönlendirme, yönetim ve ölçekleme için gereken tüm araçlarla birlikte gelir.
          </p>
        </div>

        {/* Hızlı, Güvenli, Ölçeklenebilir */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-5">
            <Shield size={26} className="text-[#8b5cf6]" />
          </div>
          <h2 className="section-title text-white mb-4">
            Hızlı, Güvenli ve{' '}
            <span className="text-gradient-gold">Ölçeklenebilir Altyapı</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-2xl mx-auto">
            Kurumsal düzeyde güvenlik, %99.9 uptime garantisi ve küresel ölçekte çalışan altyapımızla işletmenizin büyümesine ayak uydurun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: Zap,
              baslik: 'Düşük Gecikme',
              aciklama: '< 200ms yanıt süresi ile gerçek zamanlı konuşma deneyimi.',
              renk: '#f5c842',
            },
            {
              icon: Shield,
              baslik: 'Uçtan Uca Şifreleme',
              aciklama: 'Tüm konuşmalar ve veriler AES-256 ile şifrelenerek saklanır.',
              renk: '#8b5cf6',
            },
            {
              icon: Cpu,
              baslik: 'Otomatik Ölçekleme',
              aciklama: 'Ani trafik artışlarında altyapı otomatik olarak genişler.',
              renk: '#ff6b2b',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.baslik} className="card-dark p-6 text-center group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: `${item.renk}15` }}
                >
                  <Icon size={22} style={{ color: item.renk }} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{item.baslik}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.aciklama}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
