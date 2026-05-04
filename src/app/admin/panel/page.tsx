'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus, X, Check, LogOut, MessageSquare, Settings } from 'lucide-react'

type FaqItem = { id: string; soru: string; cevap: string }
type Config = { provider: string; apiKey: string; model: string; baseUrl: string; sistemPrompt: string }

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI (GPT)', placeholder: 'gpt-4o-mini' },
  { value: 'anthropic', label: 'Anthropic (Claude)', placeholder: 'claude-haiku-4-5-20251001' },
  { value: 'google', label: 'Google Gemini', placeholder: 'gemini-1.5-flash' },
  { value: 'openai-compatible', label: 'OpenAI Uyumlu (özel)', placeholder: 'model-adı' },
]

export default function AdminPanel() {
  const [sekme, setSekme] = useState<'faq' | 'ayarlar'>('faq')
  const [liste, setListe] = useState<FaqItem[]>([])
  const [duzenle, setDuzenle] = useState<FaqItem | null>(null)
  const [yeni, setYeni] = useState({ soru: '', cevap: '' })
  const [formAcik, setFormAcik] = useState(false)
  const [config, setConfig] = useState<Config>({ provider: 'openai', apiKey: '', model: '', baseUrl: '', sistemPrompt: '' })
  const [configKaydediliyor, setConfigKaydediliyor] = useState(false)
  const [configMesaj, setConfigMesaj] = useState('')
  const router = useRouter()

  const fetchListe = async () => {
    const res = await fetch('/api/faq')
    setListe(await res.json())
  }

  const fetchConfig = async () => {
    const res = await fetch('/api/config')
    if (res.ok) setConfig(await res.json())
  }

  useEffect(() => { fetchListe(); fetchConfig() }, [])

  const cikisYap = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  const ekle = async () => {
    if (!yeni.soru || !yeni.cevap) return
    await fetch('/api/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(yeni),
    })
    setYeni({ soru: '', cevap: '' })
    setFormAcik(false)
    fetchListe()
  }

  const kaydet = async () => {
    if (!duzenle) return
    await fetch(`/api/faq/${duzenle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soru: duzenle.soru, cevap: duzenle.cevap }),
    })
    setDuzenle(null)
    fetchListe()
  }

  const sil = async (id: string) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return
    await fetch(`/api/faq/${id}`, { method: 'DELETE' })
    fetchListe()
  }

  const configKaydet = async () => {
    setConfigKaydediliyor(true)
    setConfigMesaj('')
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    setConfigKaydediliyor(false)
    if (res.ok) {
      setConfigMesaj('Kaydedildi ✓')
      fetchConfig()
      setTimeout(() => setConfigMesaj(''), 3000)
    } else {
      setConfigMesaj('Kayıt başarısız')
    }
  }

  const aktifProvider = PROVIDERS.find(p => p.value === config.provider)

  return (
    <div className="min-h-screen bg-[#07080f] text-white">
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">ZekaHub Admin</h1>
          <p className="text-white/40 text-xs mt-0.5">Chatbot Yönetimi</p>
        </div>
        <button onClick={cikisYap} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
          <LogOut size={15} /> Çıkış
        </button>
      </div>

      {/* Sekmeler */}
      <div className="border-b border-white/8 px-6 flex gap-1">
        <button
          onClick={() => setSekme('faq')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${sekme === 'faq' ? 'border-blue-500 text-blue-400' : 'border-transparent text-white/40 hover:text-white'}`}
        >
          <MessageSquare size={15} /> Soru-Cevap
        </button>
        <button
          onClick={() => setSekme('ayarlar')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${sekme === 'ayarlar' ? 'border-blue-500 text-blue-400' : 'border-transparent text-white/40 hover:text-white'}`}
        >
          <Settings size={15} /> AI Ayarları
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* FAQ Sekmesi */}
        {sekme === 'faq' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-white/40 text-sm">{liste.length} soru-cevap</p>
              <button
                onClick={() => setFormAcik(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                <Plus size={15} /> Yeni Ekle
              </button>
            </div>

            {formAcik && (
              <div className="bg-[#0d0f1c] border border-blue-500/30 rounded-2xl p-6 mb-4 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-blue-400">Yeni Soru-Cevap</h3>
                <input
                  type="text"
                  placeholder="Soru"
                  value={yeni.soru}
                  onChange={e => setYeni(f => ({ ...f, soru: e.target.value }))}
                  className="bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50"
                />
                <textarea
                  placeholder="Cevap"
                  rows={3}
                  value={yeni.cevap}
                  onChange={e => setYeni(f => ({ ...f, cevap: e.target.value }))}
                  className="bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={ekle} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors">
                    <Check size={14} /> Kaydet
                  </button>
                  <button onClick={() => { setFormAcik(false); setYeni({ soru: '', cevap: '' }) }} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
                    <X size={14} /> İptal
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {liste.map(item => (
                <div key={item.id} className="bg-[#0d0f1c] border border-white/8 rounded-2xl p-5">
                  {duzenle?.id === item.id ? (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={duzenle.soru}
                        onChange={e => setDuzenle(d => d ? { ...d, soru: e.target.value } : d)}
                        className="bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      />
                      <textarea
                        rows={3}
                        value={duzenle.cevap}
                        onChange={e => setDuzenle(d => d ? { ...d, cevap: e.target.value } : d)}
                        className="bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={kaydet} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold transition-colors">
                          <Check size={13} /> Kaydet
                        </button>
                        <button onClick={() => setDuzenle(null)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">
                          <X size={13} /> İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm mb-1">{item.soru}</p>
                        <p className="text-white/45 text-sm leading-relaxed">{item.cevap}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setDuzenle(item)} className="p-2 rounded-lg hover:bg-white/8 text-white/40 hover:text-blue-400 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => sil(item.id)} className="p-2 rounded-lg hover:bg-white/8 text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* AI Ayarları Sekmesi */}
        {sekme === 'ayarlar' && (
          <div className="flex flex-col gap-5">
            <div className="bg-[#0d0f1c] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-white">Yapay Zeka Sağlayıcısı</h2>

              {/* Provider seçimi */}
              <div>
                <label className="text-white/60 text-sm font-medium mb-2 block">Sağlayıcı</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setConfig(c => ({ ...c, provider: p.value }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                        config.provider === p.value
                          ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                          : 'border-white/8 bg-[#131525] text-white/50 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="text-white/60 text-sm font-medium mb-2 block">API Anahtarı</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={e => setConfig(c => ({ ...c, apiKey: e.target.value }))}
                  placeholder="API anahtarınızı girin"
                  className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Model */}
              <div>
                <label className="text-white/60 text-sm font-medium mb-2 block">
                  Model Adı <span className="text-white/30">(boş bırakırsanız varsayılan kullanılır)</span>
                </label>
                <input
                  type="text"
                  value={config.model}
                  onChange={e => setConfig(c => ({ ...c, model: e.target.value }))}
                  placeholder={aktifProvider?.placeholder || 'model adı'}
                  className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Base URL — sadece openai-compatible için */}
              {config.provider === 'openai-compatible' && (
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Base URL</label>
                  <input
                    type="text"
                    value={config.baseUrl}
                    onChange={e => setConfig(c => ({ ...c, baseUrl: e.target.value }))}
                    placeholder="https://api.ornek.com/v1"
                    className="w-full bg-[#131525] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              )}
            </div>

            {/* Sistem Prompt */}
            <div className="bg-[#0d0f1c] border border-white/8 rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-base font-bold text-white">Sistem Promptu</h2>
                <p className="text-white/40 text-xs mt-1">Botun nasıl davranacağını tanımlayan talimat. FAQ verileri otomatik olarak eklenir.</p>
              </div>
              <textarea
                rows={5}
                value={config.sistemPrompt}
                onChange={e => setConfig(c => ({ ...c, sistemPrompt: e.target.value }))}
                className="bg-[#131525] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={configKaydet}
                disabled={configKaydediliyor}
                className="px-6 py-3 rounded-xl font-bold text-white text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                {configKaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              {configMesaj && <p className="text-green-400 text-sm">{configMesaj}</p>}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
