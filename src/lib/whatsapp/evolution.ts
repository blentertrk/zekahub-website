const BASE_URL = process.env.EVOLUTION_API_URL!
const API_KEY = process.env.EVOLUTION_API_KEY!

function headers() {
  return { 'Content-Type': 'application/json', apikey: API_KEY }
}

export async function listInstances() {
  const res = await fetch(`${BASE_URL}/instance/fetchInstances`, { headers: headers() })
  if (!res.ok) throw new Error(`Evolution API hatası: ${res.status}`)
  return res.json()
}

export async function createInstance(name: string) {
  const res = await fetch(`${BASE_URL}/instance/create`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ instanceName: name, qrcode: true, integration: 'WHATSAPP-BAILEYS' }),
  })
  if (!res.ok) throw new Error(`Instance oluşturulamadı: ${res.status}`)
  return res.json()
}

export async function getQrCode(instanceId: string) {
  const res = await fetch(`${BASE_URL}/instance/connect/${instanceId}`, { headers: headers() })
  if (!res.ok) throw new Error(`QR alınamadı: ${res.status}`)
  return res.json()
}

export async function sendTextMessage(instanceId: string, phone: string, text: string) {
  const res = await fetch(`${BASE_URL}/message/sendText/${instanceId}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ number: phone, text }),
  })
  if (!res.ok) throw new Error(`Mesaj gönderilemedi: ${res.status}`)
  return res.json()
}

export async function deleteInstance(instanceId: string) {
  const res = await fetch(`${BASE_URL}/instance/delete/${instanceId}`, {
    method: 'DELETE',
    headers: headers(),
  })
  if (!res.ok) throw new Error(`Instance silinemedi: ${res.status}`)
  return res.json()
}
