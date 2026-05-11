export type PlanType = "internet" | "bundle"

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export type ProductIconKey = "wifi" | "tv" | "building"

export type CMSCategory = {
  id: string
  name: string
  slug: string
  planType: PlanType
  description?: string
}

export type CMSProduct = {
  id: string
  name: string
  /** Short line under title (e.g. speed summary) */
  description: string
  price: number
  originalPrice: number | null
  pricePeriod?: string
  features: string[]
  /** Legacy “Best Seller” ribbon on plan cards */
  popular: boolean
  accentColor: string
  planType: PlanType
  iconKey: ProductIconKey
  /** Product / plan card image (URL or data URL) */
  image: string
  categoryId: string
  stockStatus: StockStatus
  /** Homepage featured strip */
  featured: boolean
  hidePrice: boolean
  whatsappRedirect: boolean
  createdAt: string
  updatedAt: string
}

export type CMSHeroBanner = {
  id: string
  name: string
  eyebrow: string
  badgeLabel: string
  titleBefore: string
  titleHighlight: string
  subtitle: string
  feature1: string
  feature2: string
  feature3: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  speedPrimary: string
  speedHighlight: string
  heroSideImage?: string
  isActive: boolean
}

export type CMSOrderStatus = "pending" | "processing" | "completed" | "cancelled"

export type CMSOrder = {
  id: string
  customerName: string
  email: string
  productId: string
  quantity: number
  totalAed: number
  status: CMSOrderStatus
  createdAt: string
}

export type CMSSettings = {
  whatsappPhoneDigits: string
  /** Shown on dashboard overview */
  totalUsersDisplay: number
  plansSectionTitle: string
  plansSectionSubtitle: string
}

export type CMSRecentUpdate = {
  id: string
  label: string
  detail: string
  at: string
}

export type CMSFeaturedConfig = {
  sectionTitle: string
  sectionSubtitle: string
  /** Ordered product IDs */
  productIds: string[]
}
