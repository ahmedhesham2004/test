"use client";

import React, { useState, useEffect } from "react";
import ProfileImage from "../_components/profile/ProfileImage";
import PersonalInfo from "../_components/profile/PersonalInfo";
import AccountSecurity from "../_components/profile/AccountSecurity";
import Doctor from "../_components/doctor/Doctor";
import Link from "next/link";

import {
  Calendar,
 
} from "lucide-react";
export default function Page() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem('User'));
      setToken(user?.tokens);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(" https://itch-clinc.runasp.net/api/Account/Profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const result = await response.json();
        setProfileData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) return <div className="text-blue-900 p-6">جاري تحميل البيانات...</div>;

  if (error) return <div className="text-red-600 p-6">حدث خطأ: {error}</div>;

  return (
    <div className="w-full min-h-screen relative    py-6 px-6 overflow-hidden" dir="rtl">
       {/* خلفية SVG هادئة */}
       <svg className="absolute -top-20 left-0 w-full h-[400px] md:h-[500px] z-0" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.13}}>
         <path fill="#06b6d4" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
       </svg>
       <h1 className="text-blue-900 font-extrabold text-2xl  text-center  pb-3 mb-8 p-7 max-w-2xl mx-auto relative z-10">إعدادات الحساب</h1>
       <div className="rounded-md p-4 space-y-8 relative z-10">
       
         <ProfileImage imageUrl={`https://itch-clinc.runasp.net/${profileData?.imageUrl}`} />
         <PersonalInfo fetchEndpoint="https://itch-clinc.runasp.net/api/Account/Profile"/>
         <AccountSecurity />
       </div>
        <div className="m-auto my-4 w-50 text-center "> 
        <Link
            href="/Prescription"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <Calendar className="w-5 h-5" />
            عرض الحجوزات
          </Link>
        {/* <Doctor/> */}
       </div>
     </div>
  );
}
