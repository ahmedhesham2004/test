"use client";

import React, { useState, useEffect } from "react";
import ProfileImage from "../../_components/profile/ProfileImage";
import PersonalInfo from "../../_components/profile/PersonalInfo";
import AccountSecurity from "../../_components/profile/AccountSecurity";


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
     
       <h1 className="text-blue-900 font-extrabold text-2xl  text-center  pb-3 mb-8 p-7 max-w-2xl mx-auto relative z-10">إعدادات الحساب</h1>
       <div className="rounded-md p-4 space-y-8 relative z-10">
         <ProfileImage imageUrl={`https://itch-clinc.runasp.net/${profileData?.imageUrl}`} />
         <PersonalInfo fetchEndpoint="https://itch-clinc.runasp.net/api/Account/Profile"/>
         <AccountSecurity />
       </div>
     </div>
  );
}
