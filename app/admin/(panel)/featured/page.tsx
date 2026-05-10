"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCMSStore } from "@/stores/cms-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { Spinner } from "@/components/ui/spinner"

export default function AdminFeaturedPage() {
  const hydrated = usePersistHydrated(useCMSStore((s) => s._hasHydrated))
  const featured = useCMSStore((s) => s.featured)
  const products = useCMSStore((s) => s.products)
  const setFeaturedConfig = useCMSStore((s) => s.setFeaturedConfig)
  const reorderFeatured = useCMSStore((s) => s.reorderFeatured)

  const [title, setTitle] = useState(featured.sectionTitle)
  const [subtitle, setSubtitle] = useState(featured.sectionSubtitle)
  const [pick, setPick] = useState<string>("")

  useEffect(() => {
    setTitle(featured.sectionTitle)
    setSubtitle(featured.sectionSubtitle)
  }, [featured.sectionTitle, featured.sectionSubtitle])

  const availableToAdd = useMemo(() => {
    const set = new Set(featured.productIds)
    return products.filter((p) => !set.has(p.id))
  }, [products, featured.productIds])

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  function persistMeta() {
    setFeaturedConfig({
      sectionTitle: title.trim(),
      sectionSubtitle: subtitle.trim(),
    })
    toast.success("Featured section saved")
  }

  function addPicked() {
    if (!pick) return
    const next = [...featured.productIds, pick]
    reorderFeatured(next)
    toast.success("Added to featured strip")
    setPick("")
  }

  function remove(id: string) {
    reorderFeatured(featured.productIds.filter((x) => x !== id))
    toast.success("Removed from featured strip")
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...featured.productIds]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    const tmp = next[index]
    next[index] = next[j]
    next[j] = tmp
    reorderFeatured(next)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Featured products</h1>
        <p className="text-sm text-muted-foreground">
          Curate the homepage spotlight rail. Ordering here is respected on the marketing site.
        </p>
      </div>

      <Card className="border-border bg-card/70 p-6 backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ft-title">Section title</Label>
            <Input id="ft-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ft-sub">Section subtitle</Label>
            <Input id="ft-sub" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={persistMeta}>
            Save section copy
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card/70 backdrop-blur-xl">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Add product</p>
            <p className="text-xs text-muted-foreground">
              Pick any catalog item — toggling “Featured” on the product helps you remember eligibility.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={pick} onValueChange={setPick}>
              <SelectTrigger className="w-full sm:w-[320px]">
                <SelectValue placeholder="Choose a product…" />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addPicked} disabled={!pick}>
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </div>
        </div>

        {featured.productIds.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No featured items yet — add products to populate the homepage strip.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Meta</TableHead>
                <TableHead className="w-[170px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featured.productIds.map((id, index) => {
                const p = products.find((x) => x.id === id)
                if (!p) {
                  return (
                    <TableRow key={id}>
                      <TableCell colSpan={4} className="text-sm text-muted-foreground">
                        Missing product ({id}) —{" "}
                        <Button variant="link" className="px-1" onClick={() => remove(id)}>
                          remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }
                return (
                  <TableRow key={id}>
                    <TableCell className="tabular-nums text-muted-foreground">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-2">{p.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-2">
                        {p.featured ? (
                          <Badge variant="secondary" className="text-[10px]">
                            Featured flag
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Not flagged
                          </Badge>
                        )}
                        {p.hidePrice ? (
                          <Badge variant="outline" className="text-[10px]">
                            Hidden price
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => move(index, -1)}>
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => move(index, 1)}>
                          <ArrowDown className="size-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => remove(id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
