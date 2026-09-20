'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

/**
 * WhatsApp yonetim paneli.
 *
 * Yetki: /admin uzerinden alinan imzali oturum cerezi. Eskiden burada
 * ADMIN_SECRET sabiti vardi ve istemci paketiyle tarayiciya gidiyordu -
 * yani koruma yoktu. Artik cerez tarayici tarafindan otomatik gonderiliyor,
 * dogrulama middleware'de sunucu tarafinda yapiliyor.
 */

type Instance = {
  instance: { instanceName: string; status: string }
}

type Tab = 'instances' | 'rules' | 'send' | 'settings'

const JSON_BASLIK = { 'Content-Type': 'application/json' }

export default function WhatsAppAdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('instances')
  const [instances, setInstances] = useState<Instance[]>([])
  const [selectedInstance, setSelectedInstance] = useState('')
  const [newInstanceName, setNewInstanceName] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [rules, setRules] = useState('')
  const [sendPhone, setSendPhone] = useState('')
  const [sendMsg, setSendMsg] = useState('')
  const [aiKey, setAiKey] = useState('')
  const [aiKeyMasked, setAiKeyMasked] = useState('')
  const [hasKey, setHasKey] = useState(false)
  const [status, setStatus] = useState('')

  // Oturum dustuyse giris ekranina don.
  const kontrol = useCallback((res: Response) => {
    if (res.status === 401) {
      router.push('/admin')
      return false
    }
    return true
  }, [router])

  const fetchInstances = useCallback(async () => {
    const res = await fetch('/api/whatsapp/instances')
    if (!kontrol(res)) return
    const data = await res.json()
    setInstances(Array.isArray(data) ? data : [])
  }, [kontrol])

  useEffect(() => { fetchInstances() }, [fetchInstances])

  const ayarlariYukle = useCallback(async () => {
    const res = await fetch('/api/whatsapp/settings')
    if (!kontrol(res)) return
    const d = await res.json()
    setAiKeyMasked(d.aiApiKeyMasked ?? '')
    setHasKey(Boolean(d.hasKey))
  }, [kontrol])

  useEffect(() => { ayarlariYukle() }, [ayarlariYukle])

  async function createInstance() {
    if (!newInstanceName) return
    setStatus('Oluşturuluyor...')
    const res = await fetch('/api/whatsapp/instances', {
      method: 'POST', headers: JSON_BASLIK,
      body: JSON.stringify({ name: newInstanceName }),
    })
    if (!kontrol(res)) return
    setNewInstanceName('')
    await fetchInstances()
    setStatus(res.ok ? 'Instance oluşturuldu.' : 'Instance oluşturulamadı.')
  }

  async function loadQr(instanceId: string) {
    setStatus('QR yükleniyor...')
    setQrCode('')
    const res = await fetch(`/api/whatsapp/instances/${instanceId}/qr`)
    if (!kontrol(res)) return
    const data = await res.json()
    const kod = data?.qrcode?.base64 ?? data?.base64 ?? ''
    setQrCode(kod)
    setStatus(kod ? 'QR hazır — WhatsApp ile tarayın.' : 'Zaten bağlı veya QR alınamadı.')
  }

  async function loadRules(instanceId: string) {
    if (!instanceId) { setRules(''); return }
    const res = await fetch(`/api/whatsapp/instances/${instanceId}/rules`)
    if (!kontrol(res)) return
    const data = await res.json()
    setRules(data.rule ?? '')
  }

  async function saveRules() {
    if (!selectedInstance) { setStatus('Önce bir instance seçin.'); return }
    const res = await fetch(`/api/whatsapp/instances/${selectedInstance}/rules`, {
      method: 'POST', headers: JSON_BASLIK,
      body: JSON.stringify({ rule: rules }),
    })
    if (!kontrol(res)) return
    setStatus(res.ok ? 'Kurallar kaydedildi.' : 'Kurallar kaydedilemedi.')
  }

  async function sendMessage() {
    if (!selectedInstance || !sendPhone || !sendMsg) return
    setStatus('Gönderiliyor...')
    const res = await fetch('/api/whatsapp/send', {
      method: 'POST', headers: JSON_BASLIK,
      body: JSON.stringify({ instanceId: selectedInstance, phone: sendPhone, text: sendMsg }),
    })
    if (!kontrol(res)) return
    if (res.ok) setSendMsg('')
    setStatus(res.ok ? 'Mesaj gönderildi.' : 'Mesaj gönderilemedi.')
  }

  async function saveAiKey() {
    if (!aiKey.trim()) return
    const res = await fetch('/api/whatsapp/settings', {
      method: 'POST', headers: JSON_BASLIK,
      body: JSON.stringify({ aiApiKey: aiKey }),
    })
    if (!kontrol(res)) return
    setAiKey('')
    await ayarlariYukle()
    setStatus(res.ok ? 'API key kaydedildi.' : 'API key kaydedilemedi.')
  }

  async function cikisYap() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'instances', label: 'Bağlantılar' },
    { id: 'rules', label: 'Kurallar' },
    { id: 'send', label: 'Mesaj Gönder' },
    { id: 'settings', label: 'Ayarlar' },
  ]

  return (
    <div className="min-h-screen bg-[#07070f] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black mb-1">
              WhatsApp AI <span style={{ color: '#25D366' }}>Yönetim Paneli</span>
            </h1>
            <p className="text-white/40 text-sm mb-8">ZekaHub — Evolution API</p>
          </div>
          <button
            onClick={cikisYap}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30"
          >
            Çıkış
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-[#8b5cf6] text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status */}
        {status && (
          <div className="mb-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70">
            {status}
          </div>
        )}

        {/* BAĞLANTILAR */}
        {tab === 'instances' && (
          <div className="space-y-4">
            <div className="bg-[#111124] border border-white/8 rounded-2xl p-5">
              <h2 className="font-bold mb-3 text-white/80">Yeni Numara Bağla</h2>
              <div className="flex gap-2">
                <input
                  value={newInstanceName}
                  onChange={e => setNewInstanceName(e.target.value)}
                  placeholder="İşletme adı (ör: paris-gayrimenkul)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8b5cf6]"
                />
                <button onClick={createInstance} className="btn-purple px-4 py-2 rounded-lg text-sm font-bold">
                  Oluştur
                </button>
              </div>
            </div>

            <div className="bg-[#111124] border border-white/8 rounded-2xl p-5">
              <h2 className="font-bold mb-3 text-white/80">Bağlı Numaralar</h2>
              {instances.length === 0 ? (
                <p className="text-white/30 text-sm">Henüz bağlantı yok.</p>
              ) : (
                <div className="space-y-2">
                  {instances.map((inst) => {
                    const name = inst.instance.instanceName
                    const connected = inst.instance.status === 'open'
                    return (
                      <div key={name} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                        <div>
                          <span className="font-semibold text-sm">{name}</span>
                          <span
                            className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                              connected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {connected ? 'Bağlı' : 'Bekleniyor'}
                          </span>
                        </div>
                        {!connected && (
                          <button
                            onClick={() => loadQr(name)}
                            className="text-xs px-3 py-1 bg-[#25D366]/20 text-[#25D366] rounded-lg hover:bg-[#25D366]/30"
                          >
                            QR Göster
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {qrCode && (
              <div className="bg-[#111124] border border-[#25D366]/30 rounded-2xl p-5 text-center">
                <p className="text-sm text-white/60 mb-3">WhatsApp → Bağlantılı Cihazlar → QR Tara</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                  alt="QR Kod"
                  className="mx-auto w-48 h-48 rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* KURALLAR */}
        {tab === 'rules' && (
          <div className="bg-[#111124] border border-white/8 rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-white/80">Otomatik Cevap Kuralları</h2>
            <div className="flex gap-2">
              <select
                value={selectedInstance}
                onChange={e => { setSelectedInstance(e.target.value); loadRules(e.target.value) }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8b5cf6]"
              >
                <option value="">— Instance seç —</option>
                {instances.map(i => (
                  <option key={i.instance.instanceName} value={i.instance.instanceName}>
                    {i.instance.instanceName}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={rules}
              onChange={e => setRules(e.target.value)}
              rows={10}
              placeholder={`Sistem promptu / kurallar:\n\nÖrnek:\nSen Paris Gayrimenkul'un WhatsApp asistanısın. Müşterilere kibar ve profesyonel cevap ver. Fiyat bilgisi isteyenleri +90 555 000 0000 numarasına yönlendir. Türkçe cevap ver.`}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8b5cf6] resize-none font-mono"
            />
            <button onClick={saveRules} className="btn-purple px-5 py-2 rounded-lg text-sm font-bold">
              Kaydet
            </button>
          </div>
        )}

        {/* MESAJ GÖNDER */}
        {tab === 'send' && (
          <div className="bg-[#111124] border border-white/8 rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-white/80">Manuel Mesaj Gönder</h2>
            <select
              value={selectedInstance}
              onChange={e => setSelectedInstance(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8b5cf6]"
            >
              <option value="">— Instance seç —</option>
              {instances.map(i => (
                <option key={i.instance.instanceName} value={i.instance.instanceName}>
                  {i.instance.instanceName}
                </option>
              ))}
            </select>
            <input
              value={sendPhone}
              onChange={e => setSendPhone(e.target.value)}
              placeholder="Telefon (905xxxxxxxxx)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8b5cf6]"
            />
            <textarea
              value={sendMsg}
              onChange={e => setSendMsg(e.target.value)}
              rows={4}
              placeholder="Mesaj..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8b5cf6] resize-none"
            />
            <button onClick={sendMessage} className="btn-purple px-5 py-2 rounded-lg text-sm font-bold">
              Gönder
            </button>
          </div>
        )}

        {/* AYARLAR */}
        {tab === 'settings' && (
          <div className="bg-[#111124] border border-white/8 rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-white/80">AI Ayarları</h2>
            <div className="bg-white/5 rounded-lg px-4 py-3 text-sm">
              <span className="text-white/50">Mevcut key: </span>
              <span className="font-mono text-[#f5c842]">
                {hasKey ? aiKeyMasked : 'Ayarlanmamış'}
              </span>
            </div>
            <p className="text-white/40 text-xs">
              Claude için <span className="text-white/70">sk-ant-...</span> ile başlayan key, OpenAI için <span className="text-white/70">sk-proj-...</span> ile başlayan key girin.
            </p>
            <input
              value={aiKey}
              onChange={e => setAiKey(e.target.value)}
              type="password"
              placeholder="Yeni API Key"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8b5cf6] font-mono"
            />
            <button onClick={saveAiKey} className="btn-purple px-5 py-2 rounded-lg text-sm font-bold">
              Kaydet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
