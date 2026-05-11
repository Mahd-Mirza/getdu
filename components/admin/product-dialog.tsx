"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { CMSCategory, CMSProduct } from "@/lib/cms/types"
import { parseFeatures, productFormSchema, type ProductFormValues } from "@/lib/cms/schemas"
import { useCMSStore } from "@/stores/cms-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

function toFormValues(product?: CMSProduct | null): ProductFormValues {
  if (!product) {
    return {
      name: "",
      description: "",
      price: 0,
      originalPrice: "",
      pricePeriod: "/month + 5% VAT",
      featuresText: "• ",
      popular: false,
      accentColor: "#00C2FF",
      planType: "internet",
      iconKey: "wifi",
      image: "/logo.png",
      categoryId: "",
      stockStatus: "in_stock",
      featured: false,
      hidePrice: false,
      whatsappRedirect: false,
    }
  }

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice != null ? String(product.originalPrice) : "",
    pricePeriod: product.pricePeriod ?? "",
    featuresText: product.features.join("\n"),
    popular: product.popular,
    accentColor: product.accentColor,
    planType: product.planType,
    iconKey: product.iconKey,
    image: product.image,
    categoryId: product.categoryId,
    stockStatus: product.stockStatus,
    featured: product.featured,
    hidePrice: product.hidePrice,
    whatsappRedirect: product.whatsappRedirect,
  }
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: CMSProduct | null
  categories: CMSCategory[]
}) {
  const upsertProduct = useCMSStore((s) => s.upsertProduct)

  const defaults = useMemo(() => toFormValues(product), [product])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (open) {
      const next = toFormValues(product)
      if (!next.categoryId && categories[0]) {
        next.categoryId = categories[0].id
      }
      form.reset(next)
    }
  }, [open, product, categories, form])

  function onSubmit(values: ProductFormValues) {
    const originalRaw = values.originalPrice?.trim()
    const originalPrice =
      originalRaw && originalRaw.length > 0 ? Number(originalRaw) : null

    if (originalRaw && (!Number.isFinite(originalPrice) || (originalPrice as number) < 0)) {
      toast.error("Original price is invalid")
      return
    }

    upsertProduct({
      id: product?.id,
      name: values.name.trim(),
      description: values.description.trim(),
      price: values.price,
      originalPrice,
      pricePeriod: values.pricePeriod?.trim() || undefined,
      features: parseFeatures(values.featuresText),
      popular: values.popular,
      accentColor: values.accentColor.trim(),
      planType: values.planType,
      iconKey: values.iconKey,
      image: values.image.trim(),
      categoryId: values.categoryId,
      stockStatus: values.stockStatus,
      featured: values.featured,
      hidePrice: values.hidePrice,
      whatsappRedirect: values.whatsappRedirect,
    })

    toast.success(product ? "Product updated" : "Product created")
    onOpenChange(false)
  }

  const imagePreview = form.watch("image")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-5">
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
            <div className="grid gap-5 pb-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Product name</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name ? (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Short description</Label>
                  <Input id="description" {...form.register("description")} />
                  {form.formState.errors.description ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (AED)</Label>
                  <Input id="price" type="number" step="0.01" {...form.register("price")} />
                  {form.formState.errors.price ? (
                    <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original price (optional)</Label>
                  <Input id="originalPrice" {...form.register("originalPrice")} placeholder="e.g. 399" />
                  {form.formState.errors.originalPrice ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.originalPrice.message as string}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="pricePeriod">Price label</Label>
                  <Input id="pricePeriod" {...form.register("pricePeriod")} />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.watch("categoryId")}
                    onValueChange={(v) => form.setValue("categoryId", v, { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId ? (
                    <p className="text-xs text-destructive">Category is required</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Plan tab</Label>
                  <Select
                    value={form.watch("planType")}
                    onValueChange={(v) =>
                      form.setValue("planType", v as ProductFormValues["planType"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internet">Internet only</SelectItem>
                      <SelectItem value="bundle">Internet + TV + Landline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={form.watch("iconKey")}
                    onValueChange={(v) =>
                      form.setValue("iconKey", v as ProductFormValues["iconKey"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wifi">Wi‑Fi</SelectItem>
                      <SelectItem value="tv">TV</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stock status</Label>
                  <Select
                    value={form.watch("stockStatus")}
                    onValueChange={(v) =>
                      form.setValue("stockStatus", v as ProductFormValues["stockStatus"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In stock</SelectItem>
                      <SelectItem value="low_stock">Low stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent color</Label>
                  <Input id="accentColor" {...form.register("accentColor")} />
                  {form.formState.errors.accentColor ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.accentColor.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" {...form.register("image")} placeholder="https://… or /logo.png" />
                  {form.formState.errors.image ? (
                    <p className="text-xs text-destructive">{form.formState.errors.image.message}</p>
                  ) : null}
                  <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview || "/logo.png"}
                      alt="Preview"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/logo.png"
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="featuresText">Features (one per line)</Label>
                  <Textarea id="featuresText" rows={8} {...form.register("featuresText")} />
                  {form.formState.errors.featuresText ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.featuresText.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-2 sm:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Best seller ribbon</p>
                      <p className="text-xs text-muted-foreground">Shows the highlighted badge</p>
                    </div>
                    <Switch
                      checked={form.watch("popular")}
                      onCheckedChange={(v) => form.setValue("popular", v)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Featured</p>
                      <p className="text-xs text-muted-foreground">Eligible for featured strip</p>
                    </div>
                    <Switch
                      checked={form.watch("featured")}
                      onCheckedChange={(v) => form.setValue("featured", v)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Hide price</p>
                      <p className="text-xs text-muted-foreground">Mask pricing on public cards</p>
                    </div>
                    <Switch
                      checked={form.watch("hidePrice")}
                      onCheckedChange={(v) => form.setValue("hidePrice", v)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">WhatsApp redirect</p>
                      <p className="text-xs text-muted-foreground">CTA opens WhatsApp chat</p>
                    </div>
                    <Switch
                      checked={form.watch("whatsappRedirect")}
                      onCheckedChange={(v) => form.setValue("whatsappRedirect", v)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
