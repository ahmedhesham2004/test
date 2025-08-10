"use client";
import React, { useState, useEffect } from "react";

export default function Getdoctor() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: "",
    startDate: "",
    endDate: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // جلب قائمة الدكاترة
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("User"))?.tokens;
        const res = await fetch(
          "https://itch-clinc.runasp.net/api/Users/GetAllDoctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("فشل في جلب قائمة الدكاترة");
        const result = await res.json();
        setDoctors(result);
      } catch (err) {
        console.error(err);
        setError("فشل في جلب بيانات الأطباء");
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // جلب البيانات المالية للطبيب
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);

    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      const { doctorId, startDate, endDate } = formData;

      // التحقق من صحة التواريخ
      if (new Date(startDate) > new Date(endDate)) {
        throw new Error("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
      }

      const response = await fetch(
        `https://itch-clinc.runasp.net/api/AccountingTransaction/GetByDoctor/${doctorId}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل في جلب البيانات");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  // إغلاق المودال ومسح البيانات
  const closeModal = () => {
    setShowModal(false);
    setData(null);
    setFormData({
      doctorId: "",
      startDate: "",
      endDate: "",
    });
    setError("");
  };

  // ترجمة أسماء الحقول
  const translateField = (field) => {
    const translations = {
      id: "المعرف",
      name: "اسم الخدمة",
      description: "الوصف",
      amount: "المبلغ",
      type: "النوع",
      date: "التاريخ",
      specialtyName: "التخصص",
      doctorName: "اسم الطبيب",
      totalAmount: "إجمالي المبلغ"
    };
    return translations[field] || field;
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? "-" : num.toLocaleString("ar-EG") + " ج.م";
  };

  // تنسيق نوع المعاملة
  const formatType = (type) => {
    return type === 0 ? "دخل" : "مصروف";
  };

  // دالة الطباعة المخصصة
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    let printContent = `
      <html>
        <head>
          <title>كشف حساب الطبيب</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; }
            .summary { margin-top: 30px; display: flex; justify-content: space-around; }
            .summary-box { border: 1px solid #ddd; padding: 10px 20px; border-radius: 5px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>كشف حساب الطبيب</h1>
    `;

    if (data && data.transactions && data.transactions.length > 0) {
      // معلومات الطبيب
      const doctor = doctors.find(d => d.id === formData.doctorId);
      printContent += `
        <div>
          <p><strong>اسم الطبيب:</strong> ${doctor ? `${doctor.firstName} ${doctor.lastName}` : 'غير معروف'}</p>
          <p><strong>الفترة من:</strong> ${formatDate(formData.startDate)} <strong>إلى:</strong> ${formatDate(formData.endDate)}</p>
        </div>
      `;

      // الجدول
      printContent += `
        <table>
          <thead>
            <tr>
              ${Object.keys(data.transactions[0]).map(key => 
                `<th>${translateField(key)}</th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.transactions.map(row => `
              <tr>
                ${Object.entries(row).map(([key, value]) => `
                  <td>
                    ${key === "amount" ? formatAmount(value) : 
                      key === "date" ? formatDate(value) : 
                      key === "type" ? formatType(value) : 
                      value || "-"}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // الملخص
      printContent += `
        <div class="summary">
          <div class="summary-box">
            <h3>عدد المعاملات</h3>
            <p>${data.transactions.length}</p>
          </div>
          <div class="summary-box">
            <h3>إجمالي المبلغ</h3>
            <p>${formatAmount(data.totalAmount)}</p>
          </div>
        </div>
      `;
    } else {
      printContent += `
        <p style="text-align: center; margin-top: 50px;">لا توجد بيانات متاحة للطباعة</p>
      `;
    }

    printContent += `
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // تأخير الطباعة لضمان تحميل المحتوى
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <button
          onClick={() => setShowModal(true)}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            عرض بيانات الطبيب
          </div>
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl relative max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v2m0 0v6a2 2 0 002 2h10a2 2 0 002-2V9m0 0a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2 2 2 0 00-2 2v2m0 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    بحث عن المعاملات المالية للطبيب
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-auto flex-1">
                {!data ? (
                  <>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* اختيار الطبيب */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                            اختر الطبيب
                          </label>
                          <select
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-right"
                            required
                          >
                            <option value="">اختر الطبيب</option>
                            {doctors.map((doctor) => (
                              <option key={doctor.id} value={doctor.id}>
                                {`${doctor.firstName} ${doctor.lastName}`}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* التواريخ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                              تاريخ البداية
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                              تاريخ النهاية
                            </label>
                            <input
                              type="date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* زر البحث */}
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            جاري البحث...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            بحث
                          </div>
                        )}
                      </button>
                    </div>

                    {error && (
                      <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* زر الطباعة */}
                    <div className="text-center print:hidden mb-4">
                      <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        🖨️ طباعة الكشف
                      </button>
                    </div>

                    {/* نتائج البحث */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          نتائج البحث
                        </h3>
                        <button
                          onClick={() => setData(null)}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                          بحث جديد
                        </button>
                      </div>

                      {data.transactions && data.transactions.length > 0 ? (
                        <>
                          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                            <table className="w-full bg-white">
                              <thead className="bg-gray-50">
                                <tr>
                                  {Object.keys(data.transactions[0]).map((key) => (
                                    <th
                                      key={key}
                                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                                    >
                                      {translateField(key)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {data.transactions.map((row, index) => (
                                  <tr
                                    key={index}
                                    className={`hover:bg-gray-50 ${
                                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                  >
                                    {Object.entries(row).map(
                                      ([key, value], cellIndex) => (
                                        <td
                                          key={cellIndex}
                                          className="px-4 py-3 text-right text-sm text-gray-700"
                                        >
                                          {key === "amount"
                                            ? formatAmount(value)
                                            : key === "date"
                                            ? formatDate(value)
                                            : key === "type"
                                            ? formatType(value)
                                            : value || "-"}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* ملخص النتائج */}
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <div className="text-sm text-blue-600 mb-1">
                                عدد المعاملات
                              </div>
                              <div className="text-2xl font-bold text-blue-800">
                                {data.transactions.length}
                              </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                              <div className="text-sm text-green-600 mb-1">
                                إجمالي الدخل
                              </div>
                              <div className="text-2xl font-bold text-green-800">
                                {formatAmount(data.totalAmount)}
                              </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                              <div className="text-sm text-purple-600 mb-1">
                                آخر معاملة
                              </div>
                              <div className="text-lg font-bold text-purple-800">
                                {formatDate(data.transactions[0]?.date)}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h4 className="mt-3 text-lg font-medium text-gray-700">
                            لا توجد نتائج
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            لم يتم العثور على معاملات في الفترة المحددة
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}