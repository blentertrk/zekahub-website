'use client'

import { useEffect, useRef, useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Iletisim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [form, setForm] = useState({ isim: '', eposta: '', telefon: '', mesaj: '' })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', onResize)

    const DOT_COUNT = 60
    type Dot = { x: number; y: number; vx: number; vy: number }
    const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0 || d.x > w) d.vx *= -1
        if (d.y < 0 || d.y > h) d.vy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99,179,237,0.6)'
        ctx.fill()
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(99,179,237,${0.15 * (1 - dist / 130)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.isim || !form.eposta) return
    const msg = `Merhaba, ZekaHub hakkında bilgi almak istiyorum.%0A%0Aİsim: ${encodeURIComponent(form.isim)}%0AE-posta: ${encodeURIComponent(form.eposta)}%0ATelefon: ${encodeURIComponent(form.telefon)}%0AMesaj: ${encodeURIComponent(form.mesaj)}`
    window.open(`https://wa.me/905322780000?text=${msg}`, '_blank')
  }

  const iletisimBilgileri = [
    { icon: Phone, baslik: 'Telefon', deger: '0222 606 01 01', renk: '#3b82f6' },
    { icon: Mail, baslik: 'E-posta', deger: 'info@zekahub.com', renk: '#3b82f6' },
    { icon: MapPin, baslik: 'Adresler', deger: 'Yenibağlar Mh. Aşçı Sk. No:5\nTepebaşı / Eskişehir', renk: '#3b82f6', alt: 'Türkiye' },
  ]

  return (
    <section id="iletisim" className="relative py-24 px-4 overflow-hidden bg-[#07080f]">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.06)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight">İletişim</h2>
          <p className="text-white/50 text-base">Sorularınız için bize ulaşın</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Sol — iletişim bilgileri */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Bizimle İletişime Geçin</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              Yapay zeka ses asistanları hakkında detaylı bilgi almak ve size özel çözümler için bizimle iletişime geçin.
            </p>

            <div className="flex flex-col gap-4">
              {iletisimBilgileri.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.baslik} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-0.5">{item.baslik}</p>
                      {item.alt && <p className="text-blue-400 text-xs mb-0.5">{item.alt}</p>}
                      <p className="text-white/50 text-sm whitespace-pre-line">{item.deger}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sağ — form */}
          <form onSubmit={handleWhatsApp} className="bg-[#0d0f1c]/80 backdrop-blur-sm border border-white/8 rounded-2xl p-8 flex flex-col gap-5">
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">İsim</label>
              <input
                type="text"
                required
                value={form.isim}
                onChange={e => setForm(f => ({ ...f, isim: e.target.value }))}
                className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">E-posta</label>
              <input
                type="email"
                required
                value={form.eposta}
                onChange={e => setForm(f => ({ ...f, eposta: e.target.value }))}
                className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Telefon</label>
              <input
                type="tel"
                value={form.telefon}
                onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))}
                className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                placeholder="05xx xxx xx xx"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Mesaj</label>
              <textarea
                rows={4}
                value={form.mesaj}
                onChange={e => setForm(f => ({ ...f, mesaj: e.target.value }))}
                className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                placeholder="Mesajınızı yazın..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' }}
            >
              ✈ WhatsApp ile Gönder
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
