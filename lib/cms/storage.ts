import { mkdir, readFile, writeFile } from "fs/promises"
import { head, put } from "@vercel/blob"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "data", "cms.json")
const BLOB_PATHNAME = "cms-state.json"
const KV_KEY = "cms-state"

export type CmsStorageMode = "blob" | "kv" | "file" | "none"

export function getCmsStorageMode(): CmsStorageMode {
  if (useBlobStorage()) return "blob"
  if (useKvStorage()) return "kv"
  if (!process.env.VERCEL) return "file"
  return "none"
}

export function hasPersistentStorage() {
  const mode = getCmsStorageMode()
  return mode === "blob" || mode === "kv"
}

function useBlobStorage() {
  // Legacy static token, or OIDC (BLOB_STORE_ID + auto-injected VERCEL_OIDC_TOKEN on Vercel).
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

function useKvStorage() {
  return Boolean(getKvRestConfig())
}

function getKvRestConfig() {
  const url =
    process.env.KV_REST_API_URL ??
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL
  const token =
    process.env.KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ""), token }
}

async function readFromFile(): Promise<unknown | null> {
  try {
    const raw = await readFile(DATA_PATH, "utf8")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function readFromBlob(): Promise<unknown | null> {
  const meta = await head(BLOB_PATHNAME)
  if (!meta?.url) return null

  const cacheBust = meta.uploadedAt
    ? new Date(meta.uploadedAt).getTime()
    : Date.now()
  const res = await fetch(`${meta.url}?v=${cacheBust}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

async function writeToBlob(body: unknown) {
  const json = JSON.stringify(body)
  await put(BLOB_PATHNAME, json, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  })
}

async function readFromKv(): Promise<unknown | null> {
  const cfg = getKvRestConfig()
  if (!cfg) return null

  const res = await fetch(`${cfg.url}/get/${encodeURIComponent(KV_KEY)}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    cache: "no-store",
  })
  if (!res.ok) return null

  const data = (await res.json()) as { result?: string | null }
  if (!data.result) return null
  return JSON.parse(data.result)
}

async function writeToKv(body: unknown) {
  const cfg = getKvRestConfig()
  if (!cfg) throw new Error("KV storage is not configured")

  const json = JSON.stringify(body)
  const res = await fetch(`${cfg.url}/set/${encodeURIComponent(KV_KEY)}/${encodeURIComponent(json)}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    method: "POST",
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `KV write failed (${res.status})`)
  }
}

export async function readCmsPayload(): Promise<unknown | null> {
  if (useBlobStorage()) {
    try {
      const fromBlob = await readFromBlob()
      if (fromBlob) return fromBlob

      // First deploy after connecting Blob: seed from bundled data/cms.json once.
      const fromFile = await readFromFile()
      if (fromFile && process.env.VERCEL) {
        try {
          await writeToBlob(fromFile)
        } catch {
          /* non-fatal — still return file snapshot */
        }
        return fromFile
      }
    } catch {
      /* fall through */
    }
  }

  if (useKvStorage()) {
    try {
      const fromKv = await readFromKv()
      if (fromKv) return fromKv
    } catch {
      /* fall through */
    }
  }

  return readFromFile()
}

export async function writeCmsPayload(body: unknown) {
  const mode = getCmsStorageMode()

  if (mode === "blob") {
    await writeToBlob(body)
  } else if (mode === "kv") {
    await writeToKv(body)
  }

  if (mode === "file" || mode === "none") {
    await mkdir(path.dirname(DATA_PATH), { recursive: true })
    await writeFile(DATA_PATH, JSON.stringify(body), "utf8")
  }
}

export function persistentStorageSetupMessage() {
  return (
    "Persistent storage is not configured. In Vercel open your project → Storage → " +
    "create Blob (recommended) or KV, connect it to this project, then redeploy."
  )
}
