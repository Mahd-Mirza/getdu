import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  planType: z.enum(["internet", "bundle", "business"]),
  description: z.string().optional(),
})

export const productFormSchema = z
  .object({
    name: z.string().min(2),
    description: z.string().min(4),
    price: z.coerce.number().nonnegative(),
    originalPrice: z.string().optional(),
    pricePeriod: z.string().optional(),
    featuresText: z.string().min(4, "Add at least one feature per line"),
    popular: z.boolean(),
    accentColor: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Use a hex color"),
    planType: z.enum(["internet", "bundle", "business"]),
    iconKey: z.enum(["wifi", "tv", "building"]),
    image: z.string().min(4),
    categoryId: z.string().min(1),
    stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]),
    featured: z.boolean(),
    hidePrice: z.boolean(),
    whatsappRedirect: z.boolean(),
  })
  .superRefine((val, ctx) => {
    const t = val.originalPrice?.trim()
    if (!t) return
    const n = Number(t)
    if (!Number.isFinite(n) || n < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid price or leave blank",
        path: ["originalPrice"],
      })
    }
  })

export type ProductFormValues = z.infer<typeof productFormSchema>

export const heroBannerSchema = z.object({
  name: z.string().min(2),
  eyebrow: z.string().min(2),
  badgeLabel: z.string().min(2),
  titleBefore: z.string().min(1),
  titleHighlight: z.string().min(1),
  subtitle: z.string().min(10),
  feature1: z.string().min(2),
  feature2: z.string().min(2),
  feature3: z.string().min(2),
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
  speedPrimary: z.string().min(1),
  speedHighlight: z.string().min(1),
  heroSideImage: z.string().optional(),
  isActive: z.boolean(),
})

export const settingsSchema = z.object({
  whatsappPhoneDigits: z
    .string()
    .min(4)
    .refine((s) => s.replace(/\D/g, "").length >= 8, "Include country code (e.g. 97144310766)"),
  totalUsersDisplay: z.coerce.number().int().nonnegative(),
  plansSectionTitle: z.string().min(2),
  plansSectionSubtitle: z.string().min(10),
})

export const orderSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  totalAed: z.coerce.number().nonnegative(),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
})

export function parseFeatures(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}
