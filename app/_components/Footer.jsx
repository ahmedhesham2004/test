"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/about-us" },
    { label: "الخدمات", href: "/work" },
    { label: "المدونة", href: "/price" },
    { label: "تواصل معنا", href: "#" },
  ];

  const services = [
    { label: " تقويم الأسنان ", href: "/work" },
    { label: "  تبييض الأسنان ", href: "/work" },
    { label: " زراعة الأسنان", href: "/work" },
    { label: "ابتسامة هوليود ", href: "/work" },
    { label: "حشو العصب  ", href: "/work" },
  ];

  return (
    <footer id="footer" className="bg-gradient-to-b from-[#0d155c] to-[#262e79] text-white pt-12 pb-6">
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/file.svg" alt="Logo" className="h-12 w-12" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-2xl font-bold tracking-tight">عيادتي</span>
                <span className="text-blue-200 text-xs font-medium">نحو صحة أفضل</span>
              </div>
            </div>
            <p className="text-blue-100 text-sm">
              نقدم لكم أفضل الخدمات الطبية بأعلى معايير الجودة والكفاءة، فريقنا من الأطباء المتخصصين جاهز لخدمتكم على مدار الساعة.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <svg className="w-4 h-4"fill="currentColor"viewBox="0 0 24 24"xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.483v-9.294H9.692V11.03h3.116V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.676h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold border-b border-blue-400/30 pb-2">روابط سريعة</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold border-b border-blue-400/30 pb-2">الخدمات</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-blue-100 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold border-b border-blue-400/30 pb-2">تواصل معنا</h3>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span>   القاهرة، مصر</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span>+2 01 123 456 789    </span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span>info@clinic.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-400/20 mt-8 pt-6 text-center text-blue-200 text-sm">
          <p>© {new Date().getFullYear()} عيادتي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}