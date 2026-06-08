import { NextResponse } from "next/server"
import { mkdir, readFile, writeFile } from "fs/promises"
import { head, put } from "@vercel/blob"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DATA_PATH = path.join(process.cwd(), "data", "cms.json")
const BLOB_PATHNAME = "cms-state.json"

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
}

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function readCmsPayload(): Promise<unknown | null> {
  if (useBlobStorage()) {
    try {
      const meta = await head(BLOB_PATHNAME)
      if (!meta?.url) return null
      const res = await fetch(meta.url, { cache: "no-store" })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  try {
    const raw = await readFile(DATA_PATH, "utf8")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function writeCmsPayload(body: unknown) {
  const json = JSON.stringify(body)

  if (useBlobStorage()) {
    await put(BLOB_PATHNAME, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    })
  }

  await mkdir(path.dirname(DATA_PATH), { recursive: true })
  await writeFile(DATA_PATH, json, "utf8")
}

export async function GET() {
  const payload = await readCmsPayload()
  if (!payload) {
    return NextResponse.json(null, { status: 404, headers: NO_CACHE })
  }
  return NextResponse.json(payload, { headers: NO_CACHE })
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    await writeCmsPayload(body)
    return NextResponse.json({ ok: true }, { headers: NO_CACHE })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
