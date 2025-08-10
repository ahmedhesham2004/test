"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddAccountingTransaction() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    name: "",
    description: "",
    specialtieId: null,
    doctorId: null,
  });

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // جلب الدكاترة
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("User"))?.tokens;
        const res = await fetch("https://itch-clinc.runasp.net/api/Users/GetAllDoctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("فشل في تحميل الدكاترة", err);
      }
    };

    fetchDoctors();
  }, []);

  // جلب التخصصات
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("User"))?.tokens;
        const res = await fetch("https://itch-clinc.runasp.net/api/specialtie/GetAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setSpecialties(data);
      } catch (err) {
        console.error("فشل في تحميل التخصصات", err);
      }
    };

    fetchSpecialties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "type"
          ? parseInt(value)
          : value === "" ? null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (![0, 1].includes(formData.type) || isNaN(formData.amount)) {
      setError("يرجى ملء جميع الحقول بشكل صحيح");
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;

      const body = {
        ...formData,
        doctorId: formData.type === 1 ? null : formData.doctorId || null,
        specialtieId: formData.specialtieId || null,
      };

      const res = await fetch(
        "https://itch-clinc.runasp.net/api/AccountingTransaction/Add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        alert("تمت إضافة الحركة بنجاح");
        router.push("Accounting");
      } else {
        const data = await res.json();
        setError(data.message || "فشل في الإضافة");
      }
    } catch (err) {
      console.error("خطأ:", err);
      setError("فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">إضافة حركة مالية جديدة</h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* الاسم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحركة</label>
              <input
                type="text"
                name="name"
                placeholder="مثال: كشف جديد، شراء أدوات..."
                value={formData.name ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                required
              />
            </div>

            {/* الوصف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (اختياري)</label>
              <textarea
                name="description"
                placeholder="وصف تفصيلي للحركة..."
                value={formData.description ?? ""}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* المبلغ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ج.م</span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-[10px] pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>

              {/* النوع */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحركة</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                >
                 
                  <option value="0">إيراد</option>
                  <option value="1">مصروف</option>
                </select>
              </div>
            </div>

            {/* التخصص */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التخصص (اختياري)</label>
              <select
                name="specialtieId"
                value={formData.specialtieId ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">اختر التخصص</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* الدكتور - يظهر فقط لو النوع "إيراد" */}
            {formData.type === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الطبيب</label>
                <select
                  name="doctorId"
                  value={formData.doctorId ?? ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">اختر الطبيب</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.firstName} {doc.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/transactions")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري الحفظ...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    إضافة الحركة
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}