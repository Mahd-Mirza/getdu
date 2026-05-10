import type { LucideIcon } from "lucide-react"
import { Building2, Tv, Wifi } from "lucide-react"
import type { ProductIconKey } from "@/lib/cms/types"

export const productIconMap: Record<ProductIconKey, LucideIcon> = {
  wifi: Wifi,
  tv: Tv,
  building: Building2,
}

export function getProductIcon(key: ProductIconKey): LucideIcon {
  return productIconMap[key] ?? Wifi
}
