import { AppNavbar } from "@/components/common/app-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F3EE]">
      <AppNavbar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
