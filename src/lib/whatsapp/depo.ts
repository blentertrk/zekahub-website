/**
 * WhatsApp ayar ve kural deposu (Supabase).
 *
 * Onceden bu veriler `src/data/*.json` dosyalarina fs.writeFile ile yaziliyordu.
 * Vercel'de dosya sistemi kalici DEGIL: panelden kaydedilen kurallar ve oraya
 * girilen AI API anahtari ilk deploy'da ucuyordu. Bu yuzden Supabase'e tasindi.
 *
 * Tablolar (bkz. supabase/migrations):
 *   zekahub_whatsapp_ayarlar(anahtar text primary key, deger text)
 *   zekahub_whatsapp_kurallar(instance_id text primary key, sistem_prompt text)
 *
 * Servis anahtari kullanilir; bu modul YALNIZCA sunucu tarafindan cagrilmali.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const AYAR_TABLO = 'zekahub_whatsapp_ayarlar'
const KURAL_TABLO = 'zekahub_whatsapp_kurallar'
const AI_ANAHTAR_ADI = 'ai_api_key'

let istemci: SupabaseClient | null = null

function baglan(): SupabaseClient {
  if (istemci) return istemci
  const url = process.env.SUPABASE_URL
  const anahtar = process.env.SUPABASE_SERVICE_KEY
  if (!url || !anahtar) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_KEY tanimli degil')
  }
  istemci = createClient(url, anahtar, { auth: { persistSession: false } })
  return istemci
}

/** AI saglayici anahtarini okur (yoksa bos metin). */
export async function aiAnahtariniOku(): Promise<string> {
  const { data, error } = await baglan()
    .from(AYAR_TABLO)
    .select('deger')
    .eq('anahtar', AI_ANAHTAR_ADI)
    .maybeSingle()
  if (error) throw new Error(`Ayar okunamadi: ${error.message}`)
  return data?.deger ?? ''
}

/** AI saglayici anahtarini yazar. */
export async function aiAnahtariniYaz(deger: string): Promise<void> {
  const { error } = await baglan()
    .from(AYAR_TABLO)
    .upsert({ anahtar: AI_ANAHTAR_ADI, deger }, { onConflict: 'anahtar' })
  if (error) throw new Error(`Ayar yazilamadi: ${error.message}`)
}

/** Tum instance kurallarini {instanceId: prompt} olarak doner. */
export async function kurallariOku(): Promise<Record<string, string>> {
  const { data, error } = await baglan()
    .from(KURAL_TABLO)
    .select('instance_id, sistem_prompt')
  if (error) throw new Error(`Kurallar okunamadi: ${error.message}`)
  const sonuc: Record<string, string> = {}
  for (const satir of data ?? []) sonuc[satir.instance_id] = satir.sistem_prompt ?? ''
  return sonuc
}

/** Tek bir instance'in kuralini okur (yoksa bos metin). */
export async function kuralOku(instanceId: string): Promise<string> {
  const { data, error } = await baglan()
    .from(KURAL_TABLO)
    .select('sistem_prompt')
    .eq('instance_id', instanceId)
    .maybeSingle()
  if (error) throw new Error(`Kural okunamadi: ${error.message}`)
  return data?.sistem_prompt ?? ''
}

/** Tek bir instance'in kuralini yazar. */
export async function kuralYaz(instanceId: string, sistemPrompt: string): Promise<void> {
  const { error } = await baglan()
    .from(KURAL_TABLO)
    .upsert(
      { instance_id: instanceId, sistem_prompt: sistemPrompt },
      { onConflict: 'instance_id' },
    )
  if (error) throw new Error(`Kural yazilamadi: ${error.message}`)
}
