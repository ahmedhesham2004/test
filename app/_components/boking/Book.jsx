"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Calendar, Clock, User, Phone, Mail, MapPin, Stethoscope, Heart, Shield, Star } from "lucide-react";

const Book = () => {
  const router = useRouter();
  const [dates, setDates] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(parsedUser.tokens);
    }

    const fetchDates = async () => {
      try {
        const response = await fetch("https://itch-clinc.runasp.net/api/Appointment/GetAvailable");
        const data = await response.json();
        setDates(data);
      } catch (error) {
        console.error("Error fetching available appointments:", error);
      }
    };

    fetchDates();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredDates = selectedDay
    ? dates.filter((item) => {
        const date = new Date(item.appointmentDate);
        return date.toLocaleDateString("en-CA") === selectedDay;
      })
    : [];

  const uniqueDays = [
    ...new Set(
      dates.map((item) => {
        const date = new Date(item.appointmentDate);
        return date.toLocaleDateString("en-CA");
      })
    ),
  ];

  const handleBooking = async () => {
    const selectedAppointment = dates.find(
      (item) => item.appointmentDate === appointmentDate
    );

    if (!selectedAppointment) {
      setBookingStatus("حدث خطأ في اختيار الموعد.");
      return;
    }

    try {
      const res = await fetch(`https://itch-clinc.runasp.net/api/Appointment/BookByuser/${selectedAppointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        const errorJson = await res.json();
        const errorMessage = errorJson.errors?.[0]?.description || "حدث خطأ غير متوقع.";
        setBookingStatus(errorMessage);
        return;
      }

      setBookingStatus("تم الحجز بنجاح");
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Booking error:", error.message);
      setBookingStatus("حدث خطأ أثناء الحجز.");
    }
  };

  const handleAlertClick = () => {
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Stethoscope className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            عيادتي  الطبية
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            احجز موعدك بسهولة واحصل على أفضل رعاية طبية مع فريقنا المتخصص من الأطباء ذوي الخبرة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">+100</h3>
            <p className="text-gray-600">مريض سعيد</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">2+</h3>
            <p className="text-gray-600">سنة خبرة</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
    <Clock className="w-8 h-8 text-white" />
  </div>
  <h3 className="text-3xl font-bold text-gray-800 mb-2">15 دقائق</h3>
  <p className="text-gray-600">متوسط مدة الانتظار</p>
</div>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Info */}
        

            {/* Working Hours */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="w-6 h-6 ml-3 text-blue-600" />
                مواعيد العمل
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="font-semibold text-gray-800">السبت - الخميس</span>
                  <span className="font-bold text-blue-600">9:00 - 17:00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="font-semibold text-gray-800">الجمعة</span>
                  <span className="font-bold text-red-600">اوقات محددة</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Stethoscope className="w-6 h-6 ml-3 text-blue-600" />
                خدماتنا الطبية
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-l from-blue-50 to-transparent rounded-xl border-r-4 border-blue-500">
                  <p className="font-semibold text-gray-800">فحص عام شامل</p>
                </div>
                <div className="p-3 bg-gradient-to-l from-green-50 to-transparent rounded-xl border-r-4 border-green-500">
                  <p className="font-semibold text-gray-800">استشارات طبية</p>
                </div>
                <div className="p-3 bg-gradient-to-l from-purple-50 to-transparent rounded-xl border-r-4 border-purple-500">
                  <p className="font-semibold text-gray-800">فحوصات مخبرية</p>
                </div>
                <div className="p-3 bg-gradient-to-l from-orange-50 to-transparent rounded-xl border-r-4 border-orange-500">
                  <p className="font-semibold text-gray-800">متابعة دورية</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100 text-right">
              
              {/* Form Header */}
              <div className="text-center mb-10 pb-8 border-b border-gray-200">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                  احجز موعدك
                </h2>
                <p className="text-gray-600 text-lg">اختر التاريخ والوقت المناسب لك</p>
              </div>

              {/* اختيار اليوم */}
              <div className="mb-8">
                <label className="block text-gray-800 font-bold text-lg mb-4 flex items-center">
                  <Calendar className="w-5 h-5 ml-3 text-blue-600" />
                  اختر اليوم المناسب
                </label>
                <div className="relative">
                  <select
                    value={selectedDay}
                    onChange={(e) => {
                      setSelectedDay(e.target.value);
                      setAppointmentDate("");
                      setBookingStatus("");
                    }}
                    className="w-full p-5 border-2 border-gray-200 rounded-2xl text-right focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner text-lg appearance-none"
                  >
                    <option value="">اختر يومًا</option>
                    {uniqueDays.map((day, index) => (
                      <option key={index} value={day}>
                        {new Date(day).toLocaleDateString("ar-EG", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* اختيار الموعد */}
              <div className="mb-10">
                <label className="block text-gray-800 font-bold text-lg mb-4 flex items-center">
                  <Clock className="w-5 h-5 ml-3 text-blue-600" />
                  اختر الوقت المناسب
                </label>
                <div className="relative">
                  <select
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className={`w-full p-5 border-2 rounded-2xl text-right focus:ring-4 focus:ring-blue-100 transition-all duration-300 backdrop-blur-sm shadow-inner text-lg appearance-none ${
                      !selectedDay 
                        ? "border-gray-200 bg-gray-100/80 text-gray-500" 
                        : "border-gray-200 bg-white/80 focus:border-blue-400"
                    }`}
                    disabled={!selectedDay}
                  >
                    <option value="">
                      {selectedDay ? "اختر الموعد" : "اختر يوم أولاً"}
                    </option>
                    {filteredDates.map((item, index) => (
                      <option key={index} value={item.appointmentDate}>
                        {formatDate(item.appointmentDate)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* زر تأكيد الحجز */}
              <button
                onClick={handleBooking}
                disabled={!appointmentDate}
                className={`w-full py-5 px-8 rounded-2xl text-white font-bold text-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shadow-xl ${
                  appointmentDate 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-2xl" 
                    : "bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed shadow-md"
                }`}
              >
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 ml-3" />
                  تأكيد الحجز
                </div>
              </button>

              {/* حالة الحجز */}
              {bookingStatus && !showSuccessAlert && (
                <div className="mt-8 p-5 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-2xl flex items-center border-r-4 border-red-400 shadow-lg backdrop-blur-sm">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center ml-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-lg font-semibold">{bookingStatus}</span>
                </div>
              )}

              {/* Alert النجاح */}
              {showSuccessAlert && (
                <div 
                  onClick={handleAlertClick}
                  className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-2xl flex items-center cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border-r-4 border-green-400 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02]"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center ml-5">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xl">تم الحجز بنجاح!</p>
                      <p className="text-base text-green-600 mt-2">اضغط للمتابعة لإكمال الحجز</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">ملاحظات مهمة</h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold mb-2 text-blue-800">قبل الموعد</h4>
                <p className="text-sm">يرجى الحضور قبل 15 دقيقة من موعدك المحدد</p>
              </div>
             <div className="bg-green-50 p-4 rounded-xl">
  <h4 className="font-semibold mb-2 text-green-800">تأكيد الحجز</h4>
  <p className="text-sm">
    يُرجى دفع ثمن الكشف على الرقم التالي: <span className="font-medium">01010101010</span>
  </p>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;