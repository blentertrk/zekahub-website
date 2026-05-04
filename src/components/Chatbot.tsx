'use client'

import { useRef, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

type Mesaj = { kimden: 'bot' | 'kullanici'; metin: string }

const WA_NUMBER = '902226060101'
const WA_LINK_RE = /https?:\/\/wa\.me\/\S*/gi

function gecmisMetni(mesajlar: Mesaj[]): string {
  return mesajlar
    .filter(m => m.kimden === 'kullanici' || !WA_LINK_RE.test(m.metin))
    .map(m => (m.kimden === 'kullanici' ? `Siz: ${m.metin}` : `Asistan: ${m.metin.replace(WA_LINK_RE, '').trim()}`))
    .join('\n')
}

function waUrl(mesajlar: Mesaj[]): string {
  const gecmis = gecmisMetni(mesajlar)
  const metin = `Merhaba, chatbot üzerinden konuşmaya devam etmek istiyorum.\n\n--- Sohbet Geçmişi ---\n${gecmis}\n----------------------`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(metin)}`
}

function BotMesaj({ metin, mesajlar }: { metin: string; mesajlar: Mesaj[] }) {
  const waMatch = metin.match(WA_LINK_RE)
  if (!waMatch) {
    return <span>{metin}</span>
  }

  const temizMetin = metin.replace(WA_LINK_RE, '').replace(/:\s*$/, '').trim()

  return (
    <span>
      {temizMetin && <span>{temizMetin}</span>}
      <a
        href={waUrl(mesajlar)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        style={{ background: '#25d366' }}
      >
        <svg viewBox="0 0 32 32" width="14" height="14" fill="white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.651 4.826 1.788 6.854L2 30l7.347-1.766A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.34 19.33c-.347-.174-2.055-1.013-2.374-1.129-.319-.116-.551-.174-.783.174-.232.347-.9 1.129-1.103 1.361-.203.232-.406.26-.753.087-.347-.174-1.464-.54-2.788-1.72-1.03-.92-1.726-2.055-1.929-2.402-.203-.347-.022-.535.153-.708.157-.155.347-.406.52-.609.174-.203.232-.347.347-.579.116-.232.058-.435-.029-.609-.087-.174-.783-1.888-1.073-2.587-.283-.678-.57-.586-.783-.597l-.667-.012c-.232 0-.609.087-.928.435-.319.347-1.217 1.19-1.217 2.9s1.246 3.363 1.42 3.595c.174.232 2.452 3.74 5.942 5.245.831.358 1.48.572 1.985.733.834.265 1.594.228 2.194.138.669-.1 2.055-.84 2.346-1.652.29-.812.29-1.508.203-1.652-.086-.145-.318-.232-.666-.406z"/>
        </svg>
        WhatsApp&apos;ta Devam Et
      </a>
    </span>
  )
}

export default function Chatbot() {
  const [acik, setAcik] = useState(false)
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([
    { kimden: 'bot', metin: 'Merhaba! Size nasıl yardımcı olabilirim?' },
  ])
  const [input, setInput] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const altRef = useRef<HTMLDivElement>(null)

  const scrollAlt = () => setTimeout(() => altRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

  const gonder = async () => {
    const metin = input.trim()
    if (!metin || yukleniyor) return
    setInput('')

    const yeniMesajlar: Mesaj[] = [...mesajlar, { kimden: 'kullanici', metin }]
    setMesajlar(yeniMesajlar)
    setYukleniyor(true)
    scrollAlt()

    const gecmis = yeniMesajlar
      .slice(-10)
      .map(m => ({ rol: m.kimden === 'kullanici' ? 'user' as const : 'assistant' as const, metin: m.metin }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesaj: metin, gecmis: gecmis.slice(0, -1) }),
      })
      const data = await res.json()
      setMesajlar(m => [...m, { kimden: 'bot', metin: data.cevap }])
    } catch {
      setMesajlar(m => [...m, { kimden: 'bot', metin: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.' }])
    } finally {
      setYukleniyor(false)
      scrollAlt()
    }
  }

  return (
    <>
      <button
        onClick={() => setAcik(o => !o)}
        aria-label="Chatbot"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
      >
        {acik ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {acik && (
        <div
          className="fixed bottom-44 right-6 z-50 w-80 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: '#0d0f1c', maxHeight: '420px' }}
        >
          <div
            className="px-4 py-3 flex items-center gap-3 border-b border-white/8 shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">ZekaHub Asistan</p>
              <p className="text-white/70 text-xs mt-0.5">Yapay Zeka Destekli</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
            {mesajlar.map((m, i) => (
              <div key={i} className={`flex ${m.kimden === 'kullanici' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                    m.kimden === 'kullanici'
                      ? 'text-white rounded-tr-sm'
                      : 'bg-[#131525] text-white/80 rounded-tl-sm border border-white/8 flex flex-col'
                  }`}
                  style={m.kimden === 'kullanici' ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' } : {}}
                >
                  {m.kimden === 'bot'
                    ? <BotMesaj metin={m.metin} mesajlar={mesajlar.slice(0, i + 1)} />
                    : m.metin
                  }
                </div>
              </div>
            ))}

            {yukleniyor && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#131525] border border-white/8 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={altRef} />
          </div>

          <div className="px-3 py-3 border-t border-white/8 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && gonder()}
              placeholder="Mesajınızı yazın..."
              className="flex-1 bg-[#131525] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/50"
            />
            <button
              onClick={gonder}
              disabled={yukleniyor}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
