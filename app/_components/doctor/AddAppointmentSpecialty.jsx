"use client";
import React, { useEffect, useState } from "react";

export default function AddAppointmentSpecialty({ booking }) {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([{ specialtieId: "", quantity: 1, price: 1 }]);
  const [errors, setErrors] = useState([]);
  const [existingItems, setExistingItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [responseStatus, setResponseStatus] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [specialties, setSpecialties] = useState([]);

  const fetchSpecialties = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) throw new Error("التوكن غير موجود");
      const res = await fetch("https://itch-clinc.runasp.net/api/specialtie/GetAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل في جلب التخصصات");
      const list = await res.json();
      setSpecialties(list);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError("");
      setResponseStatus(null);
      await fetchSpecialties();

      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) throw new Error("التوكن غير موجود");
      const res = await fetch(
        `https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Get/${booking.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponseStatus(res.status);
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg =
          (errData?.errors?.[0]?.description ||
            errData?.description ||
            errData?.message) ||
          `خطأ كود: ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      setExistingItems(data);
      // عند جلب البيانات نضعها في حالة items لاستخدامها عند التعديل
      if (data?.items?.length > 0) {
        setItems(data.items.map(item => ({
          specialtieId: item.specialtieId.toString(),
          quantity: item.quantity,
          price: item.price
        })));
      }
    } catch (err) {
      setFetchError(err.message || "حدث خطأ أثناء جلب البيانات");
      setExistingItems({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [booking.id]);

  const validateForm = () => {
    const newErrors = items.map(item => {
      const err = {};
      if (!item.specialtieId) err.specialtieId = "مطلوب";
      if (item.quantity < 1) err.quantity = "يجب أن تكون 1 أو أكثر";
      if (item.price < 0) err.price = "لا يمكن أن يكون السعر سالبًا";
      return err;
    });
    
    setErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const token = JSON.parse(localStorage.getItem("User"))?.tokens;
    if (!token) {
      setSubmitError("التوكن غير موجود");
      return;
    }
    
    setSubmitError("");
    const body = { items: items.map(item => ({
      specialtieId: Number(item.specialtieId),
      quantity: Number(item.quantity),
      price: Number(item.price)
    }))};
    
    const url = isEditMode
      ? `https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Update/${booking.id}`
      : `https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Add/${booking.id}`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.description || errData?.message || `فشل في ${isEditMode ? "التعديل" : "الإضافة"}`;
        throw new Error(msg);
      }
      
      setShowModal(false);
      setErrors([]);
      setSubmitError("");
      setIsEditMode(false);
      setEditIndex(null);
      await fetchData();
    } catch (err) {
      setSubmitError(err.message || "حدث خطأ أثناء الإرسال");
    }
  };

  const handleAddItem = () => {
    setItems([...items, { specialtieId: "", quantity: 1, price: 1 }]);
    setErrors([...errors, {}]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return; // لا تسمح بإزالة آخر عنصر
    
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    
    const newErrors = [...errors];
    newErrors.splice(index, 1);
    setErrors(newErrors);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const prepareEdit = (index) => {
    if (!existingItems?.items?.[index]) return;
    
    setIsEditMode(true);
    setEditIndex(index);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="animate-spin rounded-full h-6 w-6"></div>
              <p className="text-blue-600 font-medium">جاري التحميل...</p>
            </div>
          </div>
        ) : responseStatus === 200 && existingItems?.items?.length > 0 ? (
          <div className="space-y-1">
            <div className="flex rtl:space-x-reverse">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <h3 className="text-lg font-bold text-blue-800">الكشوفات المضافة</h3>
            </div>
            
            <div className="grid gap-3">
              {existingItems.items.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-2 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-gray-500 font-medium">التخصص:</span>
                          <span className="text-blue-700 font-semibold">{item.specialtieName || "غير معروف"}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-gray-500 font-medium">الكمية:</span>
                          <span className="text-green-600 font-semibold">{item.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-gray-500 font-medium">السعر:</span>
                          <span className="text-orange-600 font-semibold">{item.price} جنيه</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => prepareEdit(index)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:shadow-md"
                    >
                      تعديل
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          
          </div>
        ) : responseStatus === 200 ? (
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-4">لا توجد كشوفات مضافة بعد</p>
            <button
              onClick={() => {
                setIsEditMode(false);
                setItems([{ specialtieId: "", quantity: 1, price: 1 }]);
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              + إضافة كشف جديد
            </button>
          </div>
        ) : (
          <div className="text-center py-5">
            <button
              onClick={() => {
                setIsEditMode(false);
                setItems([{ specialtieId: "", quantity: 1, price: 1 }]);
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              + إضافة كشف
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm transition-opacity duration-300"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6 relative">
                <button
                  className="absolute top-4 right-4 text-white hover:text-red-300 text-2xl font-bold transition-colors duration-200 hover:scale-110 transform"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditMode(false);
                    setEditIndex(null);
                    fetchData(); // إعادة تحميل البيانات عند الإغلاق
                  }}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold text-center text-white">
                  {isEditMode ? "✏️ تعديل الكشف" : "➕ إضافة كشف جديد"}
                </h2>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 text-sm font-medium">{submitError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      
                      <div className="space-y-4">
                        {/* Specialty Selection */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800">
                            <span className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span>التخصص</span>
                              <span className="text-red-500">*</span>
                            </span>
                          </label>
                          <select
                            value={item.specialtieId}
                            onChange={(e) => handleItemChange(index, 'specialtieId', e.target.value)}
                            className={`w-full border-2 ${errors[index]?.specialtieId ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white`}
                          >
                            <option value="">اختر تخصصًا</option>
                            {specialties.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          {errors[index]?.specialtieId && (
                            <p className="text-red-500 text-sm flex items-center space-x-1 rtl:space-x-reverse">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span>{errors[index]?.specialtieId}</span>
                            </p>
                          )}
                        </div>

                        {/* Quantity and Price in Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Quantity */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800">
                              <span className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span>الكمية</span>
                                <span className="text-red-500">*</span>
                              </span>
                            </label>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                              min={1}
                              className={`w-full border-2 ${errors[index]?.quantity ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                            />
                            {errors[index]?.quantity && (
                              <p className="text-red-500 text-sm flex items-center space-x-1 rtl:space-x-reverse">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{errors[index]?.quantity}</span>
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800">
                              <span className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span>السعر (جنيه)</span>
                                <span className="text-red-500">*</span>
                              </span>
                            </label>
                            <input 
                              type="number" 
                              value={item.price} 
                              onChange={(e) => handleItemChange(index, 'price', e.target.value)} 
                              min={0} 
                              step={0.1}
                              className={`w-full border-2 ${errors[index]?.price ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                            />
                            {errors[index]?.price && (
                              <p className="text-red-500 text-sm flex items-center space-x-1 rtl:space-x-reverse">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{errors[index]?.price}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>إضافة عنصر جديد</span>
                    </button>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>حفظ</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowModal(false);
                        setIsEditMode(false);
                        setEditIndex(null);
                        fetchData(); // إعادة تحميل البيانات عند الإغلاق
                      }} 
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-300 hover:border-gray-400"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}