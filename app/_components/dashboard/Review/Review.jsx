"use client";
import { useEffect, useState } from "react";
import { 
  FiStar, FiUser, FiMessageSquare, FiTrash2, 
  FiAlertCircle, FiRefreshCw, FiSearch 
} from "react-icons/fi";

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = JSON.parse(localStorage.getItem('User'))?.tokens;

      if (!token) {
        setError("يرجى تسجيل الدخول أولاً");
        return;
      }

      const res = await fetch("https://itch-clinc.runasp.net/api/Review/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("فشل في جلب التقييمات");
      
      const data = await res.json();
      setReviews(data);
      setFilteredReviews(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(review => 
        review.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.rate?.toString().includes(searchTerm)
      );
      setFilteredReviews(filtered);
    }
  }, [searchTerm, reviews]);

  const deleteReview = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا التقييم؟")) return;

    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;

      const res = await fetch(`https://itch-clinc.runasp.net/api/Review/Delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReviews(prev => prev.filter(review => review.id !== id));
        setFilteredReviews(prev => prev.filter(review => review.id !== id));
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "فشل في حذف التقييم");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error deleting review:", err);
    }
  };

  const renderStars = (rate) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={`${i < rate ? 'text-sky-500 fill-sky-500' : 'text-gray-300'} ml-1`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mr-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-sky-600 text-white mr-3">
              <FiStar className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">إدارة التقييمات</h2>
              <p className="text-xs sm:text-sm text-gray-500">
                إجمالي التقييمات: <span className="font-medium">{filteredReviews.length}</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ابحث في التقييمات..."
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchReviews}
              className="flex items-center justify-center gap-2 text-sm bg-white px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 flex justify-center">
            <div className="animate-pulse w-full">
              <div className="h-8 bg-gray-200 rounded mb-4 max-w-xs"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center text-red-500 flex flex-col items-center">
            <FiAlertCircle className="text-3xl mb-2" />
            <p>{error}</p>
            <button 
              onClick={fetchReviews}
              className="mt-4 text-sm bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Reviews Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      <FiUser className="ml-1" /> المريض
                    </div>
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      <FiStar className="ml-1" /> التقييم
                    </div>
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center justify-end">
                      <FiMessageSquare className="ml-1" /> التعليق
                    </div>
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <div className="ml-4 text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {review.patientName || "زائر"}
                            </div>
                          </div>
                          <div className="flex-shrink-0 h-10 w-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                            <FiUser />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          {renderStars(review.rate)}
                          <span className="mr-2 text-sm text-gray-500">({review.rate})</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-sm text-gray-500 hidden md:table-cell">
                        <div className="max-w-xs truncate">
                          {review.comment || "لا يوجد تعليق"}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="text-red-600 hover:text-red-900 flex items-center justify-end w-full"
                          title="حذف التقييم"
                        >
                          <FiTrash2 className="ml-1" />
                          <span className="hidden sm:inline">حذف</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لا توجد تقييمات حتى الآن"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}