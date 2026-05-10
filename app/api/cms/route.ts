import { NextResponse } from "next/server"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

export const runtime = "nodejs"

const DATA_PATH = path.join(process.cwd(), "data", "cms.json")

export async function GET() {
  try {
    const raw = await readFile(DATA_PATH, "utf8")
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json(null, { status: 404 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    await mkdir(path.dirname(DATA_PATH), { recursive: true })
    await writeFile(DATA_PATH, JSON.stringify(body), "utf8")
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
