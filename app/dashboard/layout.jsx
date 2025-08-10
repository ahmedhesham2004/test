"use client";
import { usePathname } from "next/navigation";
import Navbar from "../../app/_components/Navbar";
import Footer from "../../app/_components/Footer";
import Slidebar from '../_components/dashboard/Slidebar';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const showNavbar = !pathname.startsWith("/dashboard");

  // إخفاء السليدر في صفحة الحجز برقم ديناميكي
  const showSidebar = !pathname.startsWith("/dashboard/booking/");

  return (
    <div dir='rtl' className="flex bg-gradient-to-br from-slate-50 to-blue-50 flex-row">
      {showSidebar && <Slidebar />}
      {showNavbar && <Navbar />}
      <main className="flex-1 mt-20 md:mt-0">
        {children}
      </main>
    </div>
  );
}
