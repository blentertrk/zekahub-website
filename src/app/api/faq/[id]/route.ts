import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const FAQ_PATH = path.join(process.cwd(), 'data', 'faq.json')

type FaqItem = { id: string; soru: string; cevap: string }

function readFaq(): FaqItem[] {
  return JSON.parse(readFileSync(FAQ_PATH, 'utf-8'))
}

function writeFaq(data: FaqItem[]) {
  writeFileSync(FAQ_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function isAdmin(req: NextRequest) {
  return req.cookies.get('zh_admin')?.value === 'zekahub_admin_ok'
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ mesaj: 'Yetkisiz' }, { status: 401 })
  const { id } = await params
  const { soru, cevap } = await req.json()
  const list = readFaq()
  const idx = list.findIndex(f => f.id === id)
  if (idx === -1) return NextResponse.json({ mesaj: 'Bulunamadı' }, { status: 404 })
  list[idx] = { id, soru, cevap }
  writeFaq(list)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ mesaj: 'Yetkisiz' }, { status: 401 })
  const { id } = await params
  const list = readFaq().filter(f => f.id !== id)
  writeFaq(list)
  return NextResponse.json({ ok: true })
}
