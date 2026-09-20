/**
 * WhatsApp ayar ve kural deposu (Postgres).
 *
 * Onceden bu veriler `src/data/*.json` dosyalarina fs.writeFile ile yaziliyordu.
 * Vercel'de dosya sistemi kalici DEGIL: panelden kaydedilen kurallar ve oraya
 * girilen AI API anahtari ilk deploy'da ucuyordu.
 *
 * Neden kendi sunucumuzdaki Postgres:
 * WhatsApp beyni (bu uygulamanin webhook + panel tarafi) Hetzner'de, Evolution
 * API ile AYNI Docker agi icinde calisiyor. Boylece mesaj dongusu tek makinede
 * kaliyor; veritabani internete acilmiyor, disariya anahtar tasinmiyor.
 *
 * Gerekli ortam degiskeni:
 *   DATABASE_URL  ornek: postgres://zekahub:***@evolution-db:5432/zekahub
 *
 * Tablolar ilk calistirmada kendiliginden olusur (bkz. semaHazirla).
 */
import { Pool } from 'pg'

let havuz: Pool | null = null
let semaHazir = false

function baglan(): Pool {
  if (havuz) return havuz
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL tanimli degil')
  havuz = new Pool({ connectionString: url, max: 5 })
  return havuz
}

/** Tablolari yoksa olusturur; her istekte bir kez kontrol edilir. */
async function semaHazirla(): Promise<void> {
  if (semaHazir) return
  await baglan().query(`
    CREATE TABLE IF NOT EXISTS whatsapp_ayarlar (
      anahtar text PRIMARY KEY,
      deger   text NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS whatsapp_kurallar (
      instance_id   text PRIMARY KEY,
      sistem_prompt text NOT NULL DEFAULT '',
      guncellendi   timestamptz NOT NULL DEFAULT now()
    );
  `)
  semaHazir = true
}

const AI_ANAHTAR_ADI = 'ai_api_key'

/** AI saglayici anahtarini okur (yoksa bos metin). */
export async function aiAnahtariniOku(): Promise<string> {
  await semaHazirla()
  const { rows } = await baglan().query(
    'SELECT deger FROM whatsapp_ayarlar WHERE anahtar = $1',
    [AI_ANAHTAR_ADI],
  )
  return rows[0]?.deger ?? ''
}

/** AI saglayici anahtarini yazar. */
export async function aiAnahtariniYaz(deger: string): Promise<void> {
  await semaHazirla()
  await baglan().query(
    `INSERT INTO whatsapp_ayarlar (anahtar, deger) VALUES ($1, $2)
     ON CONFLICT (anahtar) DO UPDATE SET deger = EXCLUDED.deger`,
    [AI_ANAHTAR_ADI, deger],
  )
}

/** Tum instance kurallarini {instanceId: prompt} olarak doner. */
export async function kurallariOku(): Promise<Record<string, string>> {
  await semaHazirla()
  const { rows } = await baglan().query('SELECT instance_id, sistem_prompt FROM whatsapp_kurallar')
  const sonuc: Record<string, string> = {}
  for (const satir of rows) sonuc[satir.instance_id] = satir.sistem_prompt ?? ''
  return sonuc
}

/** Tek bir instance'in kuralini okur (yoksa bos metin). */
export async function kuralOku(instanceId: string): Promise<string> {
  await semaHazirla()
  const { rows } = await baglan().query(
    'SELECT sistem_prompt FROM whatsapp_kurallar WHERE instance_id = $1',
    [instanceId],
  )
  return rows[0]?.sistem_prompt ?? ''
}

/** Tek bir instance'in kuralini yazar. */
export async function kuralYaz(instanceId: string, sistemPrompt: string): Promise<void> {
  await semaHazirla()
  await baglan().query(
    `INSERT INTO whatsapp_kurallar (instance_id, sistem_prompt) VALUES ($1, $2)
     ON CONFLICT (instance_id) DO UPDATE SET sistem_prompt = EXCLUDED.sistem_prompt,
                                             guncellendi = now()`,
    [instanceId, sistemPrompt],
  )
}
