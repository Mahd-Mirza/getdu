"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type {
  CMSCategory,
  CMSFeaturedConfig,
  CMSHeroBanner,
  CMSOrder,
  CMSProduct,
  CMSRecentUpdate,
  CMSSettings,
  PlanType,
} from "@/lib/cms/types"
import { buildInitialCmsState, defaultHeroBanner } from "@/lib/cms/seed"

export const CMS_STORAGE_KEY = "getdu-cms-state"
const STORAGE_VERSION = 1

function isoNow() {
  return new Date().toISOString()
}

function randomId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`
}

export type CMSStore = {
  categories: CMSCategory[]
  products: CMSProduct[]
  heroBanners: CMSHeroBanner[]
  featured: CMSFeaturedConfig
  orders: CMSOrder[]
  settings: CMSSettings
  recentUpdates: CMSRecentUpdate[]

  /** Hydration flag from persist (for UI) */
  _hasHydrated: boolean
  setHasHydrated: (v: boolean) => void

  getActiveHero: () => CMSHeroBanner
  upsertCategory: (cat: Omit<CMSCategory, "id"> & { id?: string }) => CMSCategory
  deleteCategory: (id: string) => void
  upsertProduct: (p: Omit<CMSProduct, "id" | "createdAt" | "updatedAt"> & { id?: string }) => CMSProduct
  deleteProduct: (id: string) => void
  upsertHeroBanner: (
    b: Omit<CMSHeroBanner, "id"> & { id?: string },
  ) => CMSHeroBanner
  deleteHeroBanner: (id: string) => void
  setHeroActive: (id: string) => void
  setFeaturedConfig: (partial: Partial<CMSFeaturedConfig>) => void
  reorderFeatured: (productIds: string[]) => void
  upsertOrder: (o: Omit<CMSOrder, "id" | "createdAt"> & { id?: string }) => CMSOrder
  deleteOrder: (id: string) => void
  patchSettings: (partial: Partial<CMSSettings>) => void
  resetToSeed: () => void
}

function pushRecent(
  recent: CMSRecentUpdate[],
  label: string,
  detail: string,
): CMSRecentUpdate[] {
  const row: CMSRecentUpdate = {
    id: randomId("evt"),
    label,
    detail,
    at: isoNow(),
  }
  return [row, ...recent].slice(0, 80)
}

/** Persisted slice — shared with `/api/cms` server sync */
export function cmsStateToPersist(s: CMSStore) {
  return {
    categories: s.categories,
    products: s.products,
    heroBanners: s.heroBanners,
    featured: s.featured,
    orders: s.orders,
    settings: s.settings,
    recentUpdates: s.recentUpdates,
  }
}

export const useCMSStore = create<CMSStore>()(
  persist(
    (set, get) => ({
      ...buildInitialCmsState(),
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      getActiveHero: () => {
        const list = get().heroBanners
        const active = list.find((h) => h.isActive)
        return active ?? list[0] ?? defaultHeroBanner()
      },

      upsertCategory: (cat) => {
        const id = cat.id ?? randomId("cat")
        const row: CMSCategory = {
          id,
          name: cat.name,
          slug: cat.slug,
          planType: cat.planType,
          description: cat.description,
        }
        set((s) => {
          const exists = s.categories.some((c) => c.id === id)
          const categories = exists
            ? s.categories.map((c) => (c.id === id ? row : c))
            : [...s.categories, row]
          return {
            categories,
            recentUpdates: pushRecent(
              s.recentUpdates,
              exists ? "Category updated" : "Category created",
              row.name,
            ),
          }
        })
        return row
      },

      deleteCategory: (id) => {
        const fallback = get().categories.find((c) => c.id !== id)?.id
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          products: s.products.map((p) =>
            p.categoryId === id && fallback ? { ...p, categoryId: fallback } : p,
          ),
          recentUpdates: pushRecent(s.recentUpdates, "Category removed", id),
        }))
      },

      upsertProduct: (p) => {
        const id = p.id ?? randomId("prod")
        const prev = get().products.find((x) => x.id === id)
        const createdAt = prev?.createdAt ?? isoNow()
        const row: CMSProduct = {
          ...p,
          id,
          createdAt,
          updatedAt: isoNow(),
        }
        set((s) => {
          const exists = s.products.some((x) => x.id === id)
          const products = exists
            ? s.products.map((x) => (x.id === id ? row : x))
            : [...s.products, row]
          let featured = s.featured
          const ids = new Set(featured.productIds)
          if (row.featured) {
            if (!ids.has(row.id)) {
              featured = {
                ...featured,
                productIds: [row.id, ...featured.productIds],
              }
            }
          } else {
            featured = {
              ...featured,
              productIds: featured.productIds.filter((x) => x !== row.id),
            }
          }
          return {
            products,
            featured,
            recentUpdates: pushRecent(
              s.recentUpdates,
              exists ? "Product updated" : "Product created",
              row.name,
            ),
          }
        })
        return row
      },

      deleteProduct: (id) => {
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          featured: {
            ...s.featured,
            productIds: s.featured.productIds.filter((x) => x !== id),
          },
          orders: s.orders.filter((o) => o.productId !== id),
          recentUpdates: pushRecent(s.recentUpdates, "Product removed", id),
        }))
      },

      upsertHeroBanner: (b) => {
        const id = b.id ?? randomId("hero")
        const row: CMSHeroBanner = { ...b, id }
        set((s) => {
          const exists = s.heroBanners.some((h) => h.id === id)
          let heroBanners = exists
            ? s.heroBanners.map((h) => (h.id === id ? row : h))
            : [...s.heroBanners, row]
          if (row.isActive) {
            heroBanners = heroBanners.map((h) =>
              h.id === row.id ? h : { ...h, isActive: false },
            )
          }
          return {
            heroBanners,
            recentUpdates: pushRecent(
              s.recentUpdates,
              exists ? "Hero banner updated" : "Hero banner created",
              row.name,
            ),
          }
        })
        return row
      },

      deleteHeroBanner: (id) => {
        set((s) => {
          const next = s.heroBanners.filter((h) => h.id !== id)
          const heroBanners =
            next.length === 0
              ? [defaultHeroBanner()]
              : next.some((h) => h.isActive)
                ? next
                : next.map((h, i) => ({ ...h, isActive: i === 0 }))
          return {
            heroBanners,
            recentUpdates: pushRecent(s.recentUpdates, "Hero banner removed", id),
          }
        })
      },

      setHeroActive: (id) => {
        set((s) => ({
          heroBanners: s.heroBanners.map((h) => ({
            ...h,
            isActive: h.id === id,
          })),
          recentUpdates: pushRecent(s.recentUpdates, "Hero banner published", id),
        }))
      },

      setFeaturedConfig: (partial) => {
        set((s) => ({
          featured: { ...s.featured, ...partial },
          recentUpdates: pushRecent(s.recentUpdates, "Featured section updated", ""),
        }))
      },

      reorderFeatured: (productIds) => {
        set((s) => ({
          featured: { ...s.featured, productIds },
          recentUpdates: pushRecent(s.recentUpdates, "Featured order updated", ""),
        }))
      },

      upsertOrder: (o) => {
        const id = o.id ?? randomId("ord")
        const prev = get().orders.find((x) => x.id === id)
        const row: CMSOrder = {
          ...o,
          id,
          createdAt: prev?.createdAt ?? isoNow(),
        }
        set((s) => {
          const exists = s.orders.some((x) => x.id === id)
          return {
            orders: exists
              ? s.orders.map((x) => (x.id === id ? row : x))
              : [...s.orders, row],
            recentUpdates: pushRecent(
              s.recentUpdates,
              exists ? "Order updated" : "Order created",
              id,
            ),
          }
        })
        return row
      },

      deleteOrder: (id) => {
        set((s) => ({
          orders: s.orders.filter((o) => o.id !== id),
          recentUpdates: pushRecent(s.recentUpdates, "Order removed", id),
        }))
      },

      patchSettings: (partial) => {
        set((s) => ({
          settings: { ...s.settings, ...partial },
          recentUpdates: pushRecent(s.recentUpdates, "Settings saved", ""),
        }))
      },

      resetToSeed: () => {
        set({
          ...buildInitialCmsState(),
          recentUpdates: pushRecent(
            get().recentUpdates,
            "CMS reset",
            "Restored seed dataset",
          ),
        })
      },
    }),
    {
      name: CMS_STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => cmsStateToPersist(s),
      onRehydrateStorage: () => () => {
        queueMicrotask(() => useCMSStore.getState().setHasHydrated(true))
      },
    },
  ),
)

/** Products visible in a plans tab */
export function selectProductsByPlanType(
  products: CMSProduct[],
  tab: PlanType,
) {
  return products.filter((p) => p.planType === tab)
}

export function whatsappHref(digits: string, message?: string) {
  const d = digits.replace(/\D/g, "")
  const q = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${d}${q}`
}
