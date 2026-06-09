import { NextResponse } from "next/server"
import {
  getCmsStorageMode,
  hasPersistentStorage,
  persistentStorageSetupMessage,
  readCmsPayload,
  writeCmsPayload,
} from "@/lib/cms/storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
}

function responseHeaders(extra?: Record<string, string>) {
  return {
    ...NO_CACHE,
    "X-CMS-Storage": getCmsStorageMode(),
    ...extra,
  }
}

function isVercelProduction() {
  return Boolean(process.env.VERCEL) && process.env.NODE_ENV === "production"
}

export async function GET() {
  const payload = await readCmsPayload()
  if (!payload) {
    return NextResponse.json(null, { status: 404, headers: responseHeaders() })
  }
  return NextResponse.json(payload, { headers: responseHeaders() })
}

export async function PUT(req: Request) {
  if (isVercelProduction() && !hasPersistentStorage()) {
    return NextResponse.json(
      { error: persistentStorageSetupMessage() },
      { status: 503, headers: responseHeaders() },
    )
  }

  try {
    const body = await req.json()
    await writeCmsPayload(body)
    return NextResponse.json({ ok: true }, { headers: responseHeaders() })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500, headers: responseHeaders() })
  }
}
