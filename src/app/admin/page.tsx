import { AdminApp } from "@/components/admin/AdminApp";

export const metadata = {
  title: "Menu Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
