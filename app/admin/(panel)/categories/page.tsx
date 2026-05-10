"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { CMSCategory } from "@/lib/cms/types"
import { categorySchema } from "@/lib/cms/schemas"
import { useCMSStore } from "@/stores/cms-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

type CategoryFormValues = z.infer<typeof categorySchema>

export default function AdminCategoriesPage() {
  const hydrated = usePersistHydrated(useCMSStore((s) => s._hasHydrated))
  const categories = useCMSStore((s) => s.categories)
  const products = useCMSStore((s) => s.products)
  const upsertCategory = useCMSStore((s) => s.upsertCategory)
  const deleteCategory = useCMSStore((s) => s.deleteCategory)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CMSCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CMSCategory | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      planType: "internet",
      description: "",
    },
  })

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.reset({
        name: editing.name,
        slug: editing.slug,
        planType: editing.planType,
        description: editing.description ?? "",
      })
    } else {
      form.reset({ name: "", slug: "", planType: "internet", description: "" })
    }
  }, [open, editing, form])

  const usage = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1)
    }
    return map
  }, [products])

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(c: CMSCategory) {
    setEditing(c)
    setOpen(true)
  }

  function onSubmit(values: CategoryFormValues) {
    upsertCategory({
      id: editing?.id,
      name: values.name.trim(),
      slug: values.slug.trim(),
      planType: values.planType,
      description: values.description?.trim() || undefined,
    })
    toast.success(editing ? "Category updated" : "Category created")
    setOpen(false)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteCategory(deleteTarget.id)
    toast.success("Category deleted")
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Categories drive grouping in the admin and help classify packages for reporting.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" />
          Add category
        </Button>
      </div>

      <Card className="overflow-hidden border-border bg-card/70 backdrop-blur-xl">
        {categories.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No categories yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead>Tab</TableHead>
                <TableHead className="hidden lg:table-cell">Products</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{c.slug}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {c.planType}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell tabular-nums">
                    {usage.get(c.id) ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" onClick={() => openEdit(c)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => setDeleteTarget(c)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input id="cat-slug" {...form.register("slug")} placeholder="home-bundles" />
              {form.formState.errors.slug ? (
                <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Default plans tab</Label>
              <Select
                value={form.watch("planType")}
                onValueChange={(v) =>
                  form.setValue("planType", v as CategoryFormValues["planType"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internet">Internet only</SelectItem>
                  <SelectItem value="bundle">Internet + TV + Landline</SelectItem>
                  <SelectItem value="business">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" rows={4} {...form.register("description")} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Products in{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name}</span> will be
              reassigned to another category automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
