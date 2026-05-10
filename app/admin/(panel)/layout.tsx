import { AdminGate } from "@/components/admin/admin-gate"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>
}
