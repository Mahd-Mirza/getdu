"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { formatDistanceToNow } from "date-fns"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { CMSOrder } from "@/lib/cms/types"
import { orderSchema } from "@/lib/cms/schemas"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { useCMSStore } from "@/stores/cms-store"
import { usePersistHydrated } from "@/hooks/use-store-hydrated"
import { Spinner } from "@/components/ui/spinner"

type OrderFormValues = z.infer<typeof orderSchema>

const PAGE_SIZE = 8

export default function AdminOrdersPage() {
  const hydrated = usePersistHydrated(useCMSStore((s) => s._hasHydrated))
  const orders = useCMSStore((s) => s.orders)
  const products = useCMSStore((s) => s.products)
  const upsertOrder = useCMSStore((s) => s.upsertOrder)
  const deleteOrder = useCMSStore((s) => s.deleteOrder)

  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CMSOrder | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CMSOrder | null>(null)

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      email: "",
      productId: products[0]?.id ?? "",
      quantity: 1,
      totalAed: 0,
      status: "pending",
    },
  })

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.reset({
        customerName: editing.customerName,
        email: editing.email,
        productId: editing.productId,
        quantity: editing.quantity,
        totalAed: editing.totalAed,
        status: editing.status,
      })
    } else {
      form.reset({
        customerName: "",
        email: "",
        productId: products[0]?.id ?? "",
        quantity: 1,
        totalAed: 0,
        status: "pending",
      })
    }
  }, [open, editing, form, products])

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }, [orders])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const rows = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    )
  }

  function onSubmit(values: OrderFormValues) {
    upsertOrder({
      id: editing?.id,
      customerName: values.customerName.trim(),
      email: values.email.trim(),
      productId: values.productId,
      quantity: values.quantity,
      totalAed: values.totalAed,
      status: values.status,
    })
    toast.success(editing ? "Order updated" : "Order created")
    setOpen(false)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteOrder(deleteTarget.id)
    toast.success("Order deleted")
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Static demo pipeline — wire to your backend later without changing the UI shell.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Plus className="mr-2 size-4" />
          Add order
        </Button>
      </div>

      <Card className="overflow-hidden border-border bg-card/70 backdrop-blur-xl">
        {sorted.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No orders yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden lg:table-cell">Product</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">When</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => {
                const p = products.find((x) => x.id === o.productId)
                return (
                  <TableRow key={o.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{o.customerName}</span>
                        <span className="text-xs text-muted-foreground">{o.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{p?.name ?? o.productId}</TableCell>
                    <TableCell className="text-right tabular-nums">AED {o.totalAed}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(o.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setEditing(o)
                            setOpen(true)
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => setDeleteTarget(o)}>
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

        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">{safePage + 1}</span> /{" "}
            <span className="font-medium text-foreground">{pageCount}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 0}
              onClick={() => setPage((x) => Math.max(0, x - 1))}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((x) => Math.min(pageCount - 1, x + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit order" : "Add order"}</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="o-name">Customer</Label>
              <Input id="o-name" {...form.register("customerName")} />
              {form.formState.errors.customerName ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.customerName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="o-email">Email</Label>
              <Input id="o-email" type="email" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={form.watch("productId")}
                onValueChange={(v) => form.setValue("productId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pick product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="o-qty">Quantity</Label>
                <Input id="o-qty" type="number" {...form.register("quantity")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="o-total">Total (AED)</Label>
                <Input id="o-total" type="number" step="0.01" {...form.register("totalAed")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) =>
                  form.setValue("status", v as OrderFormValues["status"], { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
            <AlertDialogTitle>Delete order?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove order <span className="font-medium text-foreground">{deleteTarget?.id}</span>.
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
