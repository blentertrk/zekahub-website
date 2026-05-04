'use client'

import { Building, Landmark, Headphones, Heart, ShoppingCart, Truck } from 'lucide-react'

const sektorler = [
  {
    icon: Building,
    isim: 'Belediyeler',
    aciklama: 'Vatandaş hizmetleri, şikayet yönetimi ve bilgilendirme hatları için AI asistan.',
  },
  {
    icon: Landmark,
    isim: 'Bankacılık & Finans',
    aciklama: 'Hesap sorgulama, kredi başvurusu ve müşteri destek süreçlerini otomatikleştirin.',
  },
  {
    icon: Headphones,
    isim: 'Çağrı Merkezleri',
    aciklama: 'Çağrı hacmini AI ile karşılayın, insan ekibinizi yüksek değerli görevlere ayırın.',
  },
  {
    icon: Heart,
    isim: 'Sağlık & Klinikler',
    aciklama: 'Randevu alma, hatırlatma ve hasta bilgilendirme sistemlerini otomatik hale getirin.',
  },
  {
    icon: ShoppingCart,
    isim: 'E-Ticaret',
    aciklama: 'Sipariş takibi, iade süreçleri ve müşteri memnuniyeti için 7/24 AI destek.',
  },
  {
    icon: Truck,
    isim: 'Lojistik',
    aciklama: 'Teslimat takibi, sürücü koordinasyonu ve müşteri bildirimleri tamamen otomatik.',
  },
]

export default function Sektorler() {
  return (
    <section className="py-24 px-4 bg-[#0a0a14]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title text-white mb-3">
            Tüm Sektörlere Uygun{' '}
            <span className="text-gradient-gold">Sesli Asistan Çözümleri</span>
          </h2>
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#f5c842]/10 border border-[#f5c842]/20 mt-2">
            <span className="text-[#f5c842] text-xs font-semibold tracking-wider">SEKTÖRLER</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sektorler.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.isim} className="card-dark p-6 flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#f5c842]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-[#f5c842]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1.5">{s.isim}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.aciklama}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
