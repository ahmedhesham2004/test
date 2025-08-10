"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about-us" },
  { label: "الخدمات", href: "/work" },
  { label: "قصص النجاح", href: "/price" },
  { label: " احجز الان", href: "/bokink" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = () => {
      let token = null;
      try {
        const userStr = localStorage.getItem("User");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          token = userObj?.tokens;
        }
      } catch {
        token = null;
      }

      if (token) {
        fetch("https://itch-clinc.runasp.net/api/Account/Profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const userData = data.user || data;
            setUser(userData);
          })
          .catch(() => setUser(null))
          .finally(() => setLoadingUser(false));
      } else {
        setLoadingUser(false);
      }
    };

    fetchUser();

    // استمع لحدث تسجيل الدخول
    window.addEventListener("user-logged-in", fetchUser);

    return () => {
      window.removeEventListener("user-logged-in", fetchUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleLogout = async () => {
  localStorage.removeItem("User");
   window.location.href = "/auth/signin";
};


  return (
    <header className="sticky top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-[#262e79] to-[#0d155c] text-white py-4 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>+20 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>info@clinic.com</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 justify-center">
              <svg
                className="w-5 h-5 mt-0.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="pt-1"> القاهرة، مصر</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">تابعنا على:</span>
            <div className="flex items-center gap-2">
              <a href="#" className="hover:text-blue-300 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76z" />
                </svg>
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.483v-9.294H9.692V11.03h3.116V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.676h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/file.svg" alt="Logo" className="h-12 w-12" />
              </div>
              <div className="flex flex-col">
                <span className="text-blue-900 text-3xl font-bold tracking-tight">
                  عيادتي
                </span>
                <span className="text-blue-600 text-xs font-medium">
                  نحو صحة أفضل
                </span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => {
                const isBooking = link.href === "/bokink";
                return (
                  <Link
                    key={link.label}
                    href={isBooking && !user ? "/auth/signin" : link.href}
                    onClick={(e) => {
                      if (isBooking && !user) {
                        e.preventDefault();
                        alert("يرجى تسجيل الدخول أولاً لإتمام الحجز");
                        router.push("/auth/signin");
                      }
                    }}
                    className="relative group text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2 px-3"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                );
              })}
            </div>

            {/* Right section: User or Login */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={avatarRef}>
                {loadingUser ? (
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <div className="relative">
                    <img
                      src={`https://itch-clinc.runasp.net/${user.imageUrl}`}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover cursor-pointer border-3 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    تسجيل دخول
                  </Link>
                )}

                {/* Dropdown */}
                {dropdownOpen && user && (
                  <div className="absolute left-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden backdrop-blur-md">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                      <p className="text-sm font-semibold text-gray-800">
                        مرحباً بك
                      </p>
                      <p className="text-xs text-gray-600">
                        {user.firstName + " " + user.lastName || user.email}
                      </p>
                    </div>
                    {/* <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      الملف الشخصي
                    </Link>
                    <Link
                      href="/payment"
                      className="flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      الحجوزات
                    </Link> */}
                    {user?.role?.includes("Doctor") ? (
                      <Link
                        href="/doctor"
                        className="flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        لوحة الطبيب
                      </Link>
                    ) : user?.role?.includes("User") ? (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          الملف الشخصي
                        </Link>

                        <Link
                          href="/payment"
                          className="flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          الحجوزات
                        </Link>
                        <Link
                          href="/Rumor"
                          className="flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 6h18M3 12h18M3 18h18M7 6v12M17 6v12"
                            />
                          </svg>
                            الاشاعه والتحاليل
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/dashboard/payments"
                        className="flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"
                          />
                        </svg>
                        لوحة التحكم
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-right text-red-600 hover:bg-red-50 border-t transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>

              {/* Hamburger */}
              <div className="md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {menuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/20 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => {
                const isBooking = link.href === "/bokink";
                return (
                  <Link
                    key={link.label}
                    href={isBooking && !user ? "/auth/signin" : link.href}
                    onClick={(e) => {
                      if (isBooking && !user) {
                        e.preventDefault();
                        alert("يرجى تسجيل الدخول أولاً لإتمام الحجز");
                        router.push("/auth/signin");
                      } else {
                        setMenuOpen(false);
                      }
                    }}
                    className="block text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                );
              })}

              {!loadingUser && user && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
