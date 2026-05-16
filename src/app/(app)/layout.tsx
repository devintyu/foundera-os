import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-[260px]">
        <TopBar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
