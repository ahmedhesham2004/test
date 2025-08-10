"use client";
import React, { useState } from "react";

export default function GetSummary() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    // إنشاء نافذة جديدة للطباعة
    const printWindow = window.open('', '_blank');
    const printContent = document.querySelector(".print-area");
    
    if (!printContent || !printWindow) return;

    // تحضير محتوى الطباعة
    const printHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ملخص المعاملات المالية</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            background: white;
            color: #333;
            line-height: 1.6;
          }
          .print-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #3B82F6;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #3B82F6;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .summary-card {
            padding: 20px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            text-align: center;
          }
          .summary-card.income {
            border-color: #10b981;
            background-color: #ecfdf5;
          }
          .summary-card.expense {
            border-color: #ef4444;
            background-color: #fef2f2;
          }
          .summary-card.net {
            border-color: #3b82f6;
            background-color: #eff6ff;
          }
          .summary-card .label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .summary-card .amount {
            font-size: 20px;
            font-weight: bold;
          }
          .income .amount { color: #059669; }
          .expense .amount { color: #dc2626; }
          .net .amount { color: #2563eb; }
          .date-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .date-card {
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
            text-align: center;
          }
          .date-card .label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .date-card .value {
            font-weight: 600;
            color: #374151;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .print-container { margin: 0; padding: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h1>ملخص المعاملات المالية</h1>
            <p>تقرير مفصل للفترة المحددة</p>
          </div>
          
          <div class="summary-grid">
            <div class="summary-card income">
              <div class="label">إجمالي الدخل</div>
              <div class="amount">${formatAmount(summary.totalIncome)}</div>
            </div>
            <div class="summary-card expense">
              <div class="label">إجمالي المصروف</div>
              <div class="amount">${formatAmount(summary.totalExpense)}</div>
            </div>
            <div class="summary-card net">
              <div class="label">الصافي</div>
              <div class="amount">${formatAmount(summary.net)}</div>
            </div>
          </div>
          
          <div class="date-info">
            <div class="date-card">
              <div class="label">تاريخ البداية</div>
              <div class="value">${new Date(formData.startDate).toLocaleDateString("ar-EG")}</div>
            </div>
            <div class="date-card">
              <div class="label">تاريخ النهاية</div>
              <div class="value">${new Date(formData.endDate).toLocaleDateString("ar-EG")}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>تم إنشاء هذا التقرير في: ${new Date().toLocaleDateString("ar-EG")} - ${new Date().toLocaleTimeString("ar-EG")}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // كتابة المحتوى في النافذة الجديدة
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // انتظار تحميل المحتوى ثم الطباعة
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSummary(null);
    setError("");
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      const { startDate, endDate } = formData;

      if (!startDate || !endDate)
        throw new Error("يجب اختيار تاريخ البداية والنهاية");

      if (new Date(startDate) > new Date(endDate))
        throw new Error("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");

      const res = await fetch(
        `https://itch-clinc.runasp.net/api/AccountingTransaction/GetSummary?from=${startDate}&to=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في جلب البيانات");
      const result = await res.json();
      setSummary(result);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ startDate: "", endDate: "" });
    setSummary(null);
    setError("");
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num)
      ? "-"
      : num.toLocaleString("ar-EG", {
          style: "currency",
          currency: "EGP",
        });
  };

  return (
    <div className="flex items-center justify-center p-4">


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
              d="M9 5H7a2 2 0 00-2 2v2m0 0v6a2 2 0 002 2h10a2 2 0 002-2V9m0 0a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2 2 2 0 00-2 2v2m0 0h4"
            />
          </svg>
          عرض ملخص التواريخ
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative">
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
                  ملخص المعاملات المالية
                </h2>
              </div>
              {summary && (
                <div className="text-center print:hidden">
                  <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    🖨️ طباعة الإيصال
                  </button>
                </div>
              )}
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
            <div className="p-6 print-area">
              {!summary ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        تاريخ البداية
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full text-black border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
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
                        required
                        className="w-full text-black border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
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
                          جاري التحميل...
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
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          عرض الملخص
                        </div>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
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
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                      <div className="text-sm text-green-600 mb-1">
                        إجمالي الدخل
                      </div>
                      <div className="text-2xl font-bold text-green-800">
                        {formatAmount(summary.totalIncome)}
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                      <div className="text-sm text-red-600 mb-1">
                        إجمالي المصروف
                      </div>
                      <div className="text-2xl font-bold text-red-800">
                        {formatAmount(summary.totalExpense)}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                      <div className="text-sm text-blue-600 mb-1">الصافي</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {formatAmount(summary.net)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">
                          تاريخ البداية
                        </div>
                        <div className="font-medium">
                          {new Date(
                            formData.startDate
                          ).toLocaleDateString("ar-EG")}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">
                          تاريخ النهاية
                        </div>
                        <div className="font-medium">
                          {new Date(
                            formData.endDate
                          ).toLocaleDateString("ar-EG")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setSummary(null)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-4"
                    >
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      بحث جديد
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}