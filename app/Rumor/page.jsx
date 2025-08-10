"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) throw new Error("التوكن غير موجود.");

      const response = await fetch(
        "https://itch-clinc.runasp.net/api/PatientMedicalRecord/GetAllForUser",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.errors?.[0]?.description || "فشل في جلب البيانات");
      }

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // تجميع السجلات حسب النوع
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.type]) {
      acc[record.type] = [];
    }
    acc[record.type].push(record);
    return acc;
  }, {});

  return (
    <div className="p-6 w-full bg-white mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">السجل الطبي</h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد سجلات طبية</h3>
          <p className="mt-1 text-gray-500">لا يوجد أي أشعة أو تحاليل مسجلة حتى الآن.</p>
        </div>
      )}

      {Object.entries(groupedRecords).map(([type, typeRecords]) => (
        <div key={type} className="mb-10">
          <h2 className={`text-xl font-semibold mb-4 pb-2 border-b-2 ${
            type === "أشعة" ? "border-blue-200 text-blue-700" : "border-green-200 text-green-700"
          }`}>
            {type === "أشعة" ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                الأشعة
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                التحاليل
              </span>
            )}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeRecords.map((record) => (
              <div key={record.id} className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-800">{record.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      type === "أشعة" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}>
                      {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'بدون تاريخ'}
                    </span>
                  </div>
                  {record.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {record.description}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 p-2 border-t">
                  <img
                    src={`https://itch-clinc.runasp.net/${record.imageUrl}`}
                    alt={record.title}
                    className="w-full h-48 object-contain rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=صورة+غير+متاحة";
                      e.target.className = "w-full h-48 object-cover rounded bg-gray-200";
                    }}
                  />
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {record.patientName || 'غير معروف'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}