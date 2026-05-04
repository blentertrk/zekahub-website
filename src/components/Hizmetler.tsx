'use client'

import { Phone, MessageCircle, Instagram, Globe, Database, Building2 } from 'lucide-react'

const hizmetler = [
  {
    icon: Phone,
    title: 'Sesli Asistanlar',
    desc: 'Gelen ve giden aramalarda tam otomasyon sağlayan yapay zeka destekli sesli asistanlar. 7/24 kesintisiz hizmet.',
    color: '#f5c842',
    glow: 'rgba(245,200,66,0.15)',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Otomasyonu',
    desc: 'WhatsApp Business API üzerinden otomatik mesajlaşma, müşteri takibi ve sipariş yönetimi.',
    color: '#25d366',
    glow: 'rgba(37,211,102,0.12)',
  },
  {
    icon: Instagram,
    title: 'Instagram DM Otomasyonu',
    desc: 'Instagram DM\'lerinize anında yapay zeka destekli yanıtlar. Potansiyel müşterileri kaçırmayın.',
    color: '#e1306c',
    glow: 'rgba(225,48,108,0.12)',
  },
  {
    icon: Globe,
    title: 'Web Otomasyonu',
    desc: 'Web siteniz üzerinden gelen ziyaretçileri otomatik olarak karşılayın ve satışa dönüştürün.',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.12)',
  },
  {
    icon: Database,
    title: 'CRM / Yönetim Paneli',
    desc: 'Tüm müşteri verilerinizi tek panelden yönetin. Otomatik kayıt, takip ve raporlama.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.12)',
  },
  {
    icon: Building2,
    title: 'Şirket CRM Entegrasyonu',
    desc: 'Mevcut CRM sisteminizle sorunsuz entegrasyon. HubSpot, Salesforce ve özel sistemler desteklenir.',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.12)',
  },
]

export default function Hizmetler() {
  return (
    <section id="hizmetler" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title text-white mb-4">HİZMETLERİMİZ</h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            İşletmenizin her kanalını kapsayan eksiksiz otomasyon çözümleri
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hizmetler.map((h) => {
            const Icon = h.icon
            return (
              <div
                key={h.title}
                className="card-dark p-6 group cursor-default"
                style={{ ['--glow' as string]: h.glow }}
              >
                {/* İkon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: h.glow, boxShadow: `0 4px 20px ${h.glow}` }}
                >
                  <Icon size={22} style={{ color: h.color }} />
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{h.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{h.desc}</p>

                <a
                  href="#demo"
                  className="inline-block text-sm font-semibold px-5 py-2 rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${h.color}22, ${h.color}11)`,
                    border: `1px solid ${h.color}33`,
                    color: h.color,
                  }}
                >
                  Detaylar →
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
