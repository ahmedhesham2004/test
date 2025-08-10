"use client";
import React, { useEffect, useState } from "react";
import Getdoctor from '../../../_components/dashboard/accounting/Getdoctor'
import GetBySpecialtie from '../../../_components/dashboard/accounting/GetBySpecialtie'
import GetSummary from '../../../_components/dashboard/accounting/GetSummary'
export default function AccountingTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) {
        throw new Error("التوكن غير موجود");
      }

      const res = await fetch(
        "https://itch-clinc.runasp.net/api/AccountingTransaction/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("فشل في جلب البيانات");
      }

      const data = await res.json();
      setTransactions(data);
      setFiltered(data);
    } catch (error) {
      console.error("فشل تحميل البيانات:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Apply type filter only
  useEffect(() => {
    if (typeFilter === "") {
      setFiltered(transactions);
    } else {
      const filteredData = transactions.filter(
        (item) => item.type === parseInt(typeFilter)
      );
      setFiltered(filteredData);
    }
  }, [typeFilter, transactions]);

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذه الحركة؟");
    if (!confirmDelete) return;

    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) {
        alert("التوكن غير موجود");
        return;
      }

      const res = await fetch(
        `https://itch-clinc.runasp.net/api/AccountingTransaction/Delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("تم الحذف بنجاح");
        fetchData(); // تحديث البيانات بعد الحذف
      } else {
        throw new Error("حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert(error.message || "فشل الاتصال بالخادم");
    }
  };

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50  via-white to-indigo-50 p-6">
      <div className="max-w-7xl  mr-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">الحركات المالية</h2>
            <p className="text-gray-600 mt-2">إدارة جميع الحركات المالية في النظام</p>
          </div>
            <div className='flex justify-center'>
              <Getdoctor/>
              <GetBySpecialtie/>
              <GetSummary/>
            </div>
          {/* Filter Section */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">تصفية حسب النوع</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">عرض الكل</option>
                <option value="0">إيراد</option>
                <option value="1">مصروف</option>
              </select>
            </div>
            
            <button
              onClick={fetchData}
              className="self-end bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تحديث
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">لا توجد حركات مالية</h3>
            <p className="mt-1 text-sm text-gray-500">لم يتم العثور على أي حركات مالية تطابق معايير البحث</p>
          </div>
        )}

        {/* Table Section */}
        {!loading && !error && filtered.length > 0 && (
          <div className="bg-white rounded-xl overflow-auto  shadow-sm border border-gray-100 ">
            <div className=" max-h-[500px] overflow-x-auto">
              <table className="min-w-full divide-y  divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القيمة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التخصص</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطبيب</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{item.description}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        item.type === 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatAmount(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.type === 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type === 0 ? "إيراد" : "مصروف"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.specialtyName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.doctorName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  عرض <span className="font-medium">{filtered.length}</span> من <span className="font-medium">{transactions.length}</span> حركة
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">إيرادات: {filtered.filter(item => item.type === 0).length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">مصروفات: {filtered.filter(item => item.type === 1).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}