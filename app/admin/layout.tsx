import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">{children}</div>
    </div>
  );
}
