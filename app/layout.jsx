"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// لازم تعمل wrapper عشان تستخدم hook جوه السيرفر كومبوننت
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

// كومبوننت تقدر تستخدم فيه usePathname
function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    // الصفحات اللي عايز تخفي فيها الـ Navbar والـ Footer
    const hiddenRoutes = ["/dashboard", "/Prescription/" ,"/payment/" ,"/accounting/","/account/" ];

    const shouldHide = hiddenRoutes.some((route) => pathname.startsWith(route));

    setShowNavbar(!shouldHide);
  }, [pathname]);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showNavbar && <Footer />}
    </>
  );
}