/**
 * Admin oturum jetonu — HMAC-SHA256 ile imzalanir.
 *
 * Eskiden cerez sabit bir metindi ("zekahub_admin_ok"); o degeri elle koyan
 * herkes panele giriyordu. Artik cerez, sunucudaki gizli anahtarla imzalanmis
 * ve son kullanma tarihi olan bir jeton tasiyor - taklit edilemez.
 *
 * Web Crypto kullanir: hem Edge (middleware) hem Node (route handler) tarafinda
 * calisir, ek bagimlilik gerektirmez.
 */

const KODLAYICI = new TextEncoder()

/** Cerez adi (eski adla ayni kaliyor, degeri artik imzali). */
export const CEREZ_ADI = 'zh_admin'

/** Oturum suresi: 8 saat. */
export const OTURUM_SURESI_SN = 60 * 60 * 8

type Yuk = { kullanici: string; exp: number }

function base64UrlKodla(veri: Uint8Array | string): string {
  const bayt = typeof veri === 'string' ? KODLAYICI.encode(veri) : veri
  let ikili = ''
  for (const b of bayt) ikili += String.fromCharCode(b)
  return btoa(ikili).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlCoz(metin: string): string {
  const dolgulu = metin.replace(/-/g, '+').replace(/_/g, '/')
  return atob(dolgulu + '='.repeat((4 - (dolgulu.length % 4)) % 4))
}

async function anahtar(sir: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    KODLAYICI.encode(sir),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

async function imzala(govde: string, sir: string): Promise<string> {
  const imza = await crypto.subtle.sign('HMAC', await anahtar(sir), KODLAYICI.encode(govde))
  return base64UrlKodla(new Uint8Array(imza))
}

/** Iki metni sabit surede karsilastirir (zamanlama sizintisina karsi). */
function esitMi(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let fark = 0
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return fark === 0
}

/** Yeni bir oturum jetonu uretir. */
export async function jetonUret(kullanici: string, sir: string): Promise<string> {
  const yuk: Yuk = { kullanici, exp: Math.floor(Date.now() / 1000) + OTURUM_SURESI_SN }
  const govde = base64UrlKodla(JSON.stringify(yuk))
  return `${govde}.${await imzala(govde, sir)}`
}

/**
 * Jetonu dogrular. Gecerliyse yuku, degilse null doner.
 * Imza tutmazsa ya da suresi dolmussa null.
 */
export async function jetonDogrula(jeton: string | undefined, sir: string): Promise<Yuk | null> {
  if (!jeton || !sir) return null
  const [govde, imza] = jeton.split('.')
  if (!govde || !imza) return null

  if (!esitMi(imza, await imzala(govde, sir))) return null

  try {
    const yuk = JSON.parse(base64UrlCoz(govde)) as Yuk
    if (typeof yuk.exp !== 'number' || yuk.exp < Math.floor(Date.now() / 1000)) return null
    return yuk
  } catch {
    return null
  }
}
