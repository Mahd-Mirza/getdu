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

function storageMode(): "blob" | "file" {
  return useBlobStorage() ? "blob" : "file"
}

function responseHeaders(extra?: Record<string, string>) {
  return {
    ...NO_CACHE,
    "X-CMS-Storage": storageMode(),
    ...extra,
  }
}

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function isVercelProduction() {
  return Boolean(process.env.VERCEL) && process.env.NODE_ENV === "production"
}

async function readFromFile(): Promise<unknown | null> {
  try {
    const raw = await readFile(DATA_PATH, "utf8")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function readCmsPayload(): Promise<unknown | null> {
  if (useBlobStorage()) {
    try {
      const meta = await head(BLOB_PATHNAME)
      if (meta?.url) {
        const cacheBust = meta.uploadedAt
          ? new Date(meta.uploadedAt).getTime()
          : Date.now()
        const res = await fetch(`${meta.url}?v=${cacheBust}`, { cache: "no-store" })
        if (res.ok) {
          return res.json()
        }
      }
    } catch {
      /* fall through to bundled cms.json */
    }
  }

  return readFromFile()
}

async function writeCmsPayload(body: unknown) {
  const json = JSON.stringify(body)

  if (useBlobStorage()) {
    await put(BLOB_PATHNAME, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    })
  }

  await mkdir(path.dirname(DATA_PATH), { recursive: true })
  await writeFile(DATA_PATH, json, "utf8")
}

export async function GET() {
  const payload = await readCmsPayload()
  if (!payload) {
    return NextResponse.json(null, { status: 404, headers: responseHeaders() })
  }
  return NextResponse.json(payload, { headers: responseHeaders() })
}

export async function PUT(req: Request) {
  if (isVercelProduction() && !useBlobStorage()) {
    return NextResponse.json(
      {
        error:
          "Persistent storage is not configured. In Vercel → Storage → create a Blob store and connect it to this project, then redeploy.",
      },
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
