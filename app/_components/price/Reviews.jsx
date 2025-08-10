"use client";
import { useState, useEffect } from "react";
import StarRating from "../StarRating";

// دالة لتحويل التاريخ لصيغة ودية بالعربي
function timeAgo(dateString) {
  if (!dateString) return "الآن";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "منذ لحظات";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return date.toLocaleDateString("ar-EG");
}

export default function DentalReviews({ guide }) {
  const [state, setState] = useState({
    showForm: false,
    rating: 0,
    comment: "",
    loading: false,
    message: { type: "", text: "" },
  });

  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("https://itch-clinc.runasp.net/api/Review/GetAll");
        const data = await res.json();
        setReviews(data);
        
        // حساب الإحصائيات
        if (data.length > 0) {
          const totalRating = data.reduce((sum, review) => sum + review.rate, 0);
          const avgRating = totalRating / data.length;
          
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          data.forEach(review => {
            distribution[review.rate] = (distribution[review.rate] || 0) + 1;
          });
          
          setStatistics({
            averageRating: avgRating,
            totalReviews: data.length,
            ratingDistribution: distribution
          });
        }
      } catch {
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  const updateState = (newState) =>
    setState((prev) => ({ ...prev, ...newState }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من وجود تقييم وتعليق
    if (state.rating === 0) {
      updateState({
        message: { type: "error", text: "يرجى اختيار تقييم أولاً" },
      });
      return;
    }
    
    if (state.comment.trim() === "") {
      updateState({
        message: { type: "error", text: "يرجى كتابة تعليق" },
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem("User") || "{}");
    const token = user?.tokens || "";
    
    if (!token) {
      updateState({
        message: { type: "error", text: "يرجى تسجيل الدخول أولاً" },
      });
      return;
    }

    updateState({ loading: true, message: { type: "", text: "" } });
    
    try {
      const response = await fetch(
        "https://itch-clinc.runasp.net/api/Review/Add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rate: state.rating,
            comment: state.comment,
          }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        const newReview = {
          patientName: user?.name || "مريض جديد",
          userImage: user?.image || null,
          rate: state.rating,
          comment: state.comment,
          date: new Date().toISOString(),
        };
        
        setReviews(prev => [newReview, ...prev]);
        
        // تحديث الإحصائيات
        setStatistics(prev => {
          const newTotal = prev.totalReviews + 1;
          const newAvg = ((prev.averageRating * prev.totalReviews) + state.rating) / newTotal;
          const newDistribution = { ...prev.ratingDistribution };
          newDistribution[state.rating] = (newDistribution[state.rating] || 0) + 1;
          
          return {
            averageRating: newAvg,
            totalReviews: newTotal,
            ratingDistribution: newDistribution
          };
        });
        
        updateState({
          message: { type: "success", text: "تم إضافة التقييم بنجاح!" },
          rating: 0,
          comment: ""
        });
        
        setTimeout(() => updateState({ showForm: false }), 1500);
      } else {
        updateState({
          message: {
            type: "error",
            text: data.message || "فشل في إضافة التقييم",
          },
        });
      }
    } catch {
      updateState({
        message: {
          type: "error",
          text: "حدث خطأ أثناء إرسال التقييم",
        },
      });
    } finally {
      updateState({ loading: false });
    }
  };

  return (
    <div className=" w-full">
      <div className="w-full max-w-7xl mx-auto p-6  min-h-screen">
      {/* العنوان الرئيسي */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          آراء وتقييمات مرضانا
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          تعرف على تجارب مرضانا الذين حصلوا على أفضل رعاية لأسنانهم في عيادتنا
        </p>
      </div>

      {/* إحصائيات التقييمات */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* متوسط التقييم */}
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-500 mb-2">
              {statistics.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              <StarRating rating={Math.round(statistics.averageRating)} />
            </div>
            <div className="text-gray-600">
              من أصل {statistics.totalReviews} تقييم
            </div>
          </div>

          {/* توزيع التقييمات */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-8">{star} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${statistics.totalReviews > 0 
                        ? (statistics.ratingDistribution[star] / statistics.totalReviews) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm w-8 text-gray-600">
                  {statistics.ratingDistribution[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* زر إضافة تقييم */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => updateState({ showForm: true })}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          disabled={state.loading}
        >
          {state.loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري التحميل...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              شارك تجربتك معنا
            </div>
          )}
        </button>
      </div>

      {/* عرض التقييمات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.slice(0, visibleCount).map((review, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            {/* معلومات المريض */}
            <div className="flex items-center mb-4">
              <div className="relative">
                {review.userImage ? (
                  <img 
                    src={review.userImage} 
                    alt={review.patientName} 
                    className="w-12 h-12 rounded-full border-2 border-blue-100" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
                    {review.patientName?.charAt(0) || "م"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="mr-3">
                <h3 className="font-bold text-gray-800">{review.patientName}</h3>
                
              </div>
            </div>

            {/* التقييم */}
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={review.rate} />
             
            </div>

            {/* التعليق */}
            <blockquote className="text-gray-700 italic mb-4 min-h-[60px] relative">
  <svg
    className="absolute top-0 left-0 w-6 h-6 text-blue-200 transform -translate-x-1 -translate-y-1"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
  </svg>
  
  <p className="pr-6 pl-6 leading-relaxed break-words whitespace-normal">
    {review.comment}
  </p>
</blockquote>


            {/* تصنيف نوع العلاج */}
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                علاج تجميلي
              </span>
             
            </div>
          </div>
        ))}
      </div>

      {/* زر عرض المزيد */}
      {reviews.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            عرض المزيد من التقييمات
          </button>
        </div>
      )}

      {/* نموذج إضافة تقييم */}
      {state.showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* رأس النموذج */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">شارك تجربتك</h3>
                  <p className="text-blue-100">ساعد الآخرين باختيار أفضل علاج</p>
                </div>
                <button
                  onClick={() => updateState({ showForm: false })}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* محتوى النموذج */}
            <div className="p-6">
              {/* اختيار التقييم */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  كيف تقيم تجربتك؟
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
                        state.rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onMouseEnter={() => updateState({ rating: star })}
                      onClick={() => updateState({ rating: star })}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {state.rating > 0 && (
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {state.rating === 5 ? "ممتاز!" : 
                     state.rating === 4 ? "جيد جداً" : 
                     state.rating === 3 ? "جيد" : 
                     state.rating === 2 ? "مقبول" : "يحتاج تحسين"}
                  </div>
                )}
              </div>

              {/* كتابة التعليق */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شارك تفاصيل تجربتك
                </label>
                <textarea
                  value={state.comment}
                  onChange={(e) => updateState({ comment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="اكتب عن تجربتك في العلاج، جودة الخدمة، والنتائج..."
                  maxLength="500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {state.comment.length}/500 حرف
                </div>
              </div>

              {/* رسالة النجاح/الخطأ */}
              {state.message.text && (
                <div className={`p-3 rounded-lg mb-4 text-center ${
                  state.message.type === "error"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-green-100 text-green-700 border border-green-300"
                }`}>
                  {state.message.text}
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="flex gap-3">
                <button
                  onClick={() => updateState({ showForm: false })}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={state.loading || state.rating === 0 || state.comment.trim() === ""}
                >
                  {state.loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    "نشر التقييم"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}