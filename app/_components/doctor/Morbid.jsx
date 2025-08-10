"use client";
import React, { useState, useMemo } from "react";

export default function Morbid({ booking }) {
  const [showModal, setShowModal] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) throw new Error("التوكن غير موجود");

      const response = await fetch(
        `https://itch-clinc.runasp.net/api/PatientMedicalRecord/GetAllForUser?patientId=${booking.patientId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data?.errors?.[0]?.description ||
          data?.message ||
          data?.title ||
          JSON.stringify(data) ||
          "فشل في جلب البيانات";
        throw new Error(errorMsg);
      }

      setMedicalRecords(data);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    setShowModal(true);
    fetchMedicalRecords();
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const groupedRecords = useMemo(() => {
    const grouped = { أشعة: [], تحليل: [] };
    medicalRecords.forEach((record) => {
      if (grouped[record.type]) {
        grouped[record.type].push(record);
      }
    });
    return grouped;
  }, [medicalRecords]);

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="bg-gradient-to-r from-blue-600 text-center m-a to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
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
            d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18a2 2 0 01-2 2z"
          />
        </svg>
        عرض الأشعة والتحاليل
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] border border-gray-200 flex flex-col z-50">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold">
                  السجل الطبي للمريض
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 text-2xl sm:text-3xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
              >
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-60">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-ping"></div>
                  </div>
                  <p className="text-gray-600 mt-4 font-medium text-sm sm:text-base">
                    جاري تحميل البيانات...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 sm:px-6 py-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0"
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
                    <span className="font-medium text-sm sm:text-base">
                      {error}
                    </span>
                  </div>
                </div>
              ) : medicalRecords.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                    لا توجد سجلات طبية
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    لم يتم العثور على أي سجلات طبية متاحة لهذا المريض
                  </p>
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-10">
                  {groupedRecords["أشعة"].map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 group flex flex-col"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
                        <img
                          src={`https://itch-clinc.runasp.net/${record.imageUrl}`}
                          alt={record.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=صورة+غير+متاحة";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-4 lg:p-5 flex flex-col justify-between h-full">
                        <h4 className="font-bold text-gray-800 text-base lg:text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {record.title}
                        </h4>
                        <div className="relative">
                          <p
                            className={`text-gray-600 text-sm leading-relaxed break-words whitespace-normal ${
                              expandedDescriptions[record.id]
                                ? ""
                                : "line-clamp-1"
                            }`}
                          >
                            {record.description}
                          </p>
                          {record.description &&
                            record.description.length > 100 && (
                              <button
                                onClick={() => toggleDescription(record.id)}
                                className="text-green-600 hover:text-green-800 text-xs font-medium mt-1 focus:outline-none"
                              >
                                {expandedDescriptions[record.id]
                                  ? "عرض أقل"
                                  : "عرض المزيد"}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {groupedRecords["تحليل"].map((record) => (
                    <div
                      key={record.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-300 group flex flex-col"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
                        <img
                          src={`https://itch-clinc.runasp.net/${record.imageUrl}`}
                          alt={record.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=صورة+غير+متاحة";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-4 lg:p-5 flex flex-col justify-between h-full">
                        <h4 className="font-bold text-gray-800 text-base lg:text-lg mb-2 group-hover:text-green-600 transition-colors duration-300">
                          {record.title}
                        </h4>
                        <div className="relative">
                          <p
                            className={`text-gray-600 text-sm leading-relaxed break-words whitespace-normal ${
                              expandedDescriptions[record.id]
                                ? ""
                                : "line-clamp-3"
                            }`}
                          >
                            {record.description}
                          </p>
                          {record.description &&
                            record.description.length > 100 && (
                              <button
                                onClick={() => toggleDescription(record.id)}
                                className="text-green-600 hover:text-green-800 text-xs font-medium mt-1 focus:outline-none"
                              >
                                {expandedDescriptions[record.id]
                                  ? "عرض أقل"
                                  : "عرض المزيد"}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-200 p-4 sm:p-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}