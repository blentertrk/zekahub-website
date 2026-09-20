/**
 * WhatsApp ayar ve kural deposu (Upstash Redis).
 *
 * Onceden bu veriler `src/data/*.json` dosyalarina fs.writeFile ile yaziliyordu.
 * Vercel'de dosya sistemi kalici DEGIL: panelden kaydedilen kurallar ve oraya
 * girilen AI API anahtari ilk deploy'da ucuyordu.
 *
 * Neden Supabase degil: mevcut Supabase hesabi free planda ve aktif proje
 * kotasi dolu. ZekaHub'i var olan bir projeye koymak, o projenin service
 * key'ini (RLS'i bypass eden anahtar) ZekaHub'in ortamina tasimak demekti -
 * ZekaHub sizsa Paris CRM verisi de acilirdi. Upstash bu urune izole.
 *
 * Gerekli ortam degiskenleri (Vercel > Storage > Upstash baglaninca otomatik gelir):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Anahtar duzeni:
 *   zekahub:whatsapp:ai_api_key      -> string
 *   zekahub:whatsapp:kurallar        -> hash { instanceId: sistemPrompt }
 */
import { Redis } from '@upstash/redis'

const AI_ANAHTARI = 'zekahub:whatsapp:ai_api_key'
const KURALLAR = 'zekahub:whatsapp:kurallar'

let istemci: Redis | null = null

function baglan(): Redis {
  if (istemci) return istemci
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error('UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN tanimli degil')
  }
  istemci = new Redis({ url, token })
  return istemci
}

/** AI saglayici anahtarini okur (yoksa bos metin). */
export async function aiAnahtariniOku(): Promise<string> {
  const deger = await baglan().get<string>(AI_ANAHTARI)
  return deger ?? ''
}

/** AI saglayici anahtarini yazar. */
export async function aiAnahtariniYaz(deger: string): Promise<void> {
  await baglan().set(AI_ANAHTARI, deger)
}

/** Tum instance kurallarini {instanceId: prompt} olarak doner. */
export async function kurallariOku(): Promise<Record<string, string>> {
  const hepsi = await baglan().hgetall<Record<string, string>>(KURALLAR)
  return hepsi ?? {}
}

/** Tek bir instance'in kuralini okur (yoksa bos metin). */
export async function kuralOku(instanceId: string): Promise<string> {
  const deger = await baglan().hget<string>(KURALLAR, instanceId)
  return deger ?? ''
}

/** Tek bir instance'in kuralini yazar. */
export async function kuralYaz(instanceId: string, sistemPrompt: string): Promise<void> {
  await baglan().hset(KURALLAR, { [instanceId]: sistemPrompt })
}
