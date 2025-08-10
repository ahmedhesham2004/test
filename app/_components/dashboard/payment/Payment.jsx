"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Payment = () => {
  const [dates, setDates] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [token, setToken] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // 👇 طلعنا الدالة هنا
  const fetchDates = async () => {
    try {
      const response = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/GetAvailable"
      );
      const data = await response.json();
      setDates(data);
    } catch (error) {
      console.error("Error fetching available appointments:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;

      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Users/GetAll",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorJson = await res.json();
        console.error(
          "API Error:",
          errorJson.errors?.[0]?.description || "Unknown error"
        );
        return;
      }

      const data = await res.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(parsedUser.tokens);
    }

    fetchDates(); // ✅ استدعاء جلب المواعيد
    fetchUsers();
  }, []);

  const doctors = allUsers.filter((user) => user.roles.includes("Doctor"));
  const patients = allUsers.filter((user) => user.roles.includes("User"));

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
    if (!appointmentDate || !selectedDoctorId || !selectedUserId) {
      setBookingStatus("من فضلك اختر الموعد والدكتور والمريض");
      return;
    }

    const selectedAppointment = dates.find(
      (item) => item.appointmentDate === appointmentDate
    );

    if (!selectedAppointment) {
      setBookingStatus("حدث خطأ في اختيار الموعد.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("doctorId", selectedDoctorId);
      formData.append("patientId", selectedUserId);

      const res = await fetch(
        `https://itch-clinc.runasp.net/api/Appointment/BookByReceptionist/${selectedAppointment.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await res.json();
    

      if (!res.ok) {
        const errorMessage =
          responseData.errors?.[0]?.description || "حدث خطأ غير متوقع.";
        setBookingStatus(errorMessage);
        return;
      }

      setBookingStatus("تم الحجز بنجاح ✅");
      setSelectedDay("");
      setAppointmentDate("");
      setSelectedDoctorId("");
      setSelectedUserId("");

      // ✅ إعادة جلب المواعيد بعد الحجز
      fetchDates();
    } catch (error) {
      console.error("Booking error:", error.message);
      setBookingStatus("حدث خطأ أثناء الحجز.");
    }
  };


 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            حجز موعد جديد
          </h1>
          <p className="text-gray-600">قم بحجز موعد للمريض بسهولة وسرعة</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <h2 className="text-xl font-semibold text-right flex items-center justify-end gap-2">
              <span>تفاصيل الحجز</span>
              <User className="w-5 h-5" />
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="block text-right font-semibold text-gray-700 flex items-center justify-end gap-2">
                <span>اختر الدكتور</span>
                <User className="w-4 h-4 text-blue-500" />
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full text-black p-4 border-2 border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              >
                <option value="">اختر دكتور</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="block text-right font-semibold text-gray-700 flex items-center justify-end gap-2">
                <span>اختر المريض</span>
                <User className="w-4 h-4 text-blue-500" />
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full text-black p-4 border-2 border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
              >
                <option value="">اختر مريض</option>
                {patients.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Selection */}
            <div className="space-y-2">
              <label className="block text-right font-semibold text-gray-700 flex items-center justify-end gap-2">
                <span>اختر اليوم</span>
                <Calendar className="w-4 h-4 text-blue-500" />
              </label>
              <select
                value={selectedDay}
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setAppointmentDate("");
                  setBookingStatus("");
                }}
                className="w-full text-black p-4 border-2 border-gray-200 rounded-xl text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
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
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="block text-right font-semibold text-gray-700 flex items-center justify-end gap-2">
                <span>اختر الموعد</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </label>
              <select
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className={`w-full text-black p-4 border-2 rounded-xl text-right transition-all duration-200 outline-none ${
                  !selectedDay
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
            </div>

            {/* Submit Button */}
            <button
              onClick={handleBooking}
              disabled={
                !appointmentDate || !selectedDoctorId || !selectedUserId
              }
              className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                appointmentDate && selectedDoctorId && selectedUserId
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>تأكيد الحجز</span>
                <CheckCircle className="w-5 h-5" />
              </div>
            </button>

            {/* Status Message */}
            {bookingStatus && (
              <div
                className={`p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2 ${
                  bookingStatus.includes("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {bookingStatus.includes("✅") ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span>{bookingStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            تأكد من صحة البيانات قبل تأكيد الحجز
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
