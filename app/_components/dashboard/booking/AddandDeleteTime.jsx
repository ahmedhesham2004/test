"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const AddandDeleteTime = () => {
  const [token, setToken] = useState(null);
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // تحميل التوكن عند تشغيل الكومبوننت
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    if (user?.tokens) {
      setToken(user.tokens);
    }
  }, []);

  // تحميل المواعيد تلقائيًا بعد التوكن
  useEffect(() => {
    if (token) {
      fetchAvailableSchedules();
    }
  }, [token]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const fetchAvailableSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/GetAvailable",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في جلب المواعيد");
      const data = await res.json();
      setAvailableSchedules(data);
    } catch (err) {
      console.error(err);
      showMessage("حدث خطأ أثناء جلب المواعيد", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/GenerateWeeklyAppointments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في إضافة المواعيد");
      showMessage("تم إضافة مواعيد الأسبوع بنجاح", "success");
      fetchAvailableSchedules();
    } catch (err) {
      console.error(err);
      showMessage("حدث خطأ أثناء الإضافة", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/DeleteOldUnbookedAppointments",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في حذف المواعيد");
      showMessage("تم حذف مواعيد الأسبوع بنجاح", "success");
      fetchAvailableSchedules();
    } catch (err) {
      console.error(err);
      showMessage("حدث خطأ أثناء الحذف", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDateArabic = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const groupSchedulesByDate = () => {
    const grouped = {};
    availableSchedules.forEach(schedule => {
      const date = new Date(schedule.appointmentDate).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mr-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">إدارة المواعيد</h1>
          </div>
          <p className="text-gray-600 text-lg">قم بإدارة مواعيدك بكل سهولة وفعالية</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg shadow-md flex items-center animate-pulse ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-800" 
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-wrap gap-6 justify-center">
            <button
              onClick={handleAddSchedule}
              disabled={!token || loading}
              className="group relative bg-indigo-600 cursor-pointer text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
              )}
              إضافة مواعيد الأسبوع
            </button>

            <button
              onClick={handleDeleteSchedule}
              disabled={!token || loading}
              className="group relative bg-red-500 cursor-pointer  text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              )}
              حذف المواعيد القديمة
            </button>
          </div>
        </div>

        {/* Schedules Display */}
        {availableSchedules.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className=" bg-indigo-400  p-6">
              <div className="flex items-center text-white">
                <Clock className="w-6 h-6 mr-3" />
                <h2 className="text-2xl font-bold">المواعيد المتاحة</h2>
                <span className="mr-auto bg-blue-600 bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                  {availableSchedules.length} موعد
                </span>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
                  <span className="text-gray-600 text-lg">جاري التحميل...</span>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(groupSchedulesByDate()).map(([date, schedules], index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                      <div className="font-bold text-gray-800 mb-3 text-center pb-2 border-b border-gray-300">
                        {new Date(date).toLocaleDateString("ar-EG", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </div>
                      <div className="space-y-2">
                        {schedules.map((schedule, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border-r-4 border-indigo-400">
                            <div className="flex items-center text-gray-700">
                              <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                              <span className="font-medium">
                                {new Date(schedule.appointmentDate).toLocaleTimeString("ar-EG", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!token && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">يرجى تسجيل الدخول للوصول إلى المواعيد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddandDeleteTime;