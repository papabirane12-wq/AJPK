import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar />
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">{children}</div>
    </div>
  );
}
