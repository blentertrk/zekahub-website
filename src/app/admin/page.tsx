'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGiris() {
  const [form, setForm] = useState({ kullanici: '', sifre: '' })
  const [hata, setHata] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHata('')
    setYukleniyor(true)
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setYukleniyor(false)
    if (res.ok) {
      router.push('/admin/panel')
    } else {
      const data = await res.json()
      setHata(data.mesaj || 'Giriş başarısız')
    }
  }

  return (
    <div className="min-h-screen bg-[#07080f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">ZekaHub</h1>
          <p className="text-white/40 text-sm mt-1">Admin Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0d0f1c] border border-white/8 rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="text-white/60 text-sm font-medium mb-2 block">Kullanıcı Adı</label>
            <input
              type="text"
              required
              value={form.kullanici}
              onChange={e => setForm(f => ({ ...f, kullanici: e.target.value }))}
              className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              placeholder="kullanıcı adı"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm font-medium mb-2 block">Şifre</label>
            <input
              type="password"
              required
              value={form.sifre}
              onChange={e => setForm(f => ({ ...f, sifre: e.target.value }))}
              className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          {hata && <p className="text-red-400 text-sm text-center">{hata}</p>}

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full py-3 rounded-xl font-bold text-white text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
          >
            {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
