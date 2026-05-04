'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const DOT_COUNT = 80
    type Dot = { x: number; y: number; vx: number; vy: number }
    const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > w) d.vx *= -1
        if (d.y < 0 || d.y > h) d.vy *= -1

        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(245,200,66,0.5)'
        ctx.fill()
      }

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(245,200,66,${0.12 * (1 - dist / 120)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Arka plan canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Radyal gradient örtü */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,200,66,0.06)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(139,92,246,0.08)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-20">
        {/* Logo ikonu */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#f5c842] via-[#ff8c42] to-[#ff6b2b] flex items-center justify-center shadow-2xl glow-gold animate-float">
            <span className="text-5xl">🧠</span>
          </div>
          {/* Parlama halkası */}
          <div className="absolute inset-0 rounded-2xl border-2 border-[#f5c842]/30 animate-spin-slow" />
        </div>

        {/* Başlık */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-5 leading-none">
          <span className="text-gradient-gold">Zeka Hub</span>
        </h1>

        {/* Alt başlık */}
        <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-3 max-w-2xl">
          Tek bir yapay zeka asistanla, aynı anda{' '}
          <span className="text-[#f5c842] font-semibold">1000+ müşteriyle</span> konuşun.
        </p>
        <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
          Randevu, pazarlama, satış ve takip süreçlerinizi otomatikleştirin. Dijital marketing, satış otomasyonu, WhatsApp ve Instagram bağlantılarıyla beraber büyüyün.
        </p>

        {/* CTA butonları */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="#demo"
            className="btn-orange text-base px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-2xl"
          >
            🚀 Hemen Başla
          </a>
          <a
            href="#hizmetler"
            className="btn-outline text-base px-8 py-3.5 rounded-xl font-semibold"
          >
            Hizmetleri Keşfet
          </a>
        </div>

        {/* İstatistik rozetleri */}
        <div className="flex flex-wrap gap-4 justify-center mt-14">
          {[
            { value: '1000+', label: 'Eş zamanlı görüşme' },
            { value: '7/24', label: 'Kesintisiz hizmet' },
            { value: '%99.9', label: 'Uptime garantisi' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-[#f5c842] font-black text-xl">{stat.value}</div>
              <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alt geçiş */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none" />
    </section>
  )
}
