"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://itch-clinc.runasp.net/api/Auth/ForgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"  
        },
        body: JSON.stringify({
          email: email.trim()  
        }),
      });
      

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
        setTimeout(() => router.push("http://localhost:3000//auth/signin"), 5000);
      } else {
        setError(data.message || "❌ حدث خطأ، يرجى المحاولة لاحقًا.");
      }
    } catch (err) {
      setError("❌ حدث خطأ أثناء الإرسال.");
      console.error("🚨 Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 100%)",
        fontFamily: "'Cairo', 'Poppins', sans-serif",
      }}
      dir="rtl"
    >
      {/* خلفية SVG شفافة */}
      <svg className="absolute left-0 top-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{zIndex:0}}>
        <ellipse cx="500" cy="100" rx="120" ry="40" fill="#0288d1"/>
        <ellipse cx="100" cy="500" rx="100" ry="30" fill="#4dd0e1"/>
        <path d="M300 100 Q320 80 340 100 T380 100" stroke="#0288d1" strokeWidth="6" fill="none"/>
        <ellipse cx="300" cy="300" rx="180" ry="60" fill="#b3e5fc"/>
      </svg>
      <div className="relative bg-white/95 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[410px] border border-blue-100 z-10">
        {/* أيقونة سن متحركة */}
        <div className="flex justify-center mb-2 animate-bounce-slow">
          <svg width="60" height="60" viewBox="0 0 148.202 148.203" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <g>
                <path d="M141.343,31.736c-2.917-12.577-11.417-21.793-24.606-26.677c-8.786-3.245-30.184-6.214-39.604,4.859C46.763-8.078,30.749,1.725,19.98,13.292c-23.769,25.532-12.894,51.253-2.731,62.42c7.347,8.087,9.472,12.763,10.662,18.104c0.268,1.175,0.874,4.646,0.904,5.389c1.878,44.476,17.043,48.287,20.669,48.555c1.057,0.305,2.098,0.444,3.105,0.444c1.848,0,3.599-0.493,5.188-1.467c7.532-4.616,9.853-18.986,11.893-31.64c0.742-4.579,1.434-8.902,2.243-11.417c1.403-4.354,2.563-5.347,2.552-5.498c1.011,0.45,2.716,3.708,2.904,4.992c0.28,1.918,0.481,4.402,0.706,7.186c1.163,14.285,2.898,35.828,18.091,37.388c1.078,0.231,3.642,0.469,6.79-1.431c7.161-4.348,12.464-16.801,15.746-37.017l0.493-3.233c1.182-8.104,2.819-19.211,9.512-26.25C136.441,71.742,145.775,50.859,141.343,31.736z M124.22,75.529c-8.062,8.477-9.938,21.215-11.167,29.654l-0.475,3.13c-3.782,23.255-9.408,30.275-12.416,32.395c-1.59,1.12-2.582,0.962-2.473,1.005l-0.706-0.141c-10.181-0.889-11.679-19.418-12.665-31.7c-0.244-2.947-0.457-5.571-0.749-7.599c-0.299-2.047-3.197-9.853-8.525-10.297c-5.729-0.384-8.217,7.252-9.033,9.797c-0.956,2.978-1.659,7.307-2.469,12.337c-1.559,9.633-3.909,24.198-9.006,27.328c-0.686,0.427-1.714,0.864-3.565,0.268l-0.941-0.146h-0.082c-0.155,0-13.149-1.571-14.885-42.612c-0.061-1.431-0.815-5.468-1.041-6.491c-1.638-7.318-4.923-12.994-12.133-20.922c-2.414-2.643-22.776-26.631,2.683-53.972C36.269,4.999,53.528-3.508,92.721,28.679c1.334,1.087,3.288,0.904,4.391-0.43c1.096-1.333,0.901-3.285-0.427-4.39c-5.023-4.113-9.736-7.611-14.157-10.538c7.222-7.252,24.266-5.279,32.065-2.387c11.296,4.177,18.256,11.651,20.697,22.229C139.011,49.293,131.259,68.143,124.22,75.529z" fill="#fff" stroke="#0288d1" stroke-width="2.5"/>
              </g>
            </g>
          </svg>
        </div>
        <h2 className="text-[20px] sm:text-[24px] py-2 font-bold text-center text-[#04234e] mb-4">
          إعادة تعيين كلمة المرور
        </h2>
        <p className="text-cyan-700/90 text-base font-semibold mb-4 text-center">
          لا تقلق! سنساعدك على استعادة حسابك بسرعة. فقط أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-[90%] sm:w-[409px] mx-auto">
          <div className="w-full mt-3 relative">
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="my-3 w-full h-[45px] sm:h-[45px] bg-white/80 border border-cyan-200 placeholder:text-cyan-400 pr-[45px] sm:pr-[45px] pl-6 rounded-2xl outline-none text-[15px] sm:text-[17px] text-blue-900 shadow focus:ring-2 focus:ring-cyan-200"
            />
            <span className="absolute right-3 sm:right-3 top-[32px] transform -translate-y-1/2 text-blue-400">  
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
          </div>
  
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
          <div className="w-full max-w-[189px] mx-auto h-[46px]">
            <button
              type="submit"
              className="w-full h-full bg-cyan-600 cursor-pointer rounded-full text-white text-[18px] sm:text-[20px] font-extrabold hover:bg-cyan-700 transition shadow-xl"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إعادة تعيين"}
            </button>
          </div>
        </form>
  
        <div className="text-center mt-4">
          <Link href="/auth/signin" className="text-[#020032] font-medium hover:text-[#376c89] underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
  
}
