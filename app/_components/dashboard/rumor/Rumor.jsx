"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Rumor() {
  const [formData, setFormData] = useState({
    imageFile: null,
    description: "",
    title: "",
    type: "",
    userId: "",
  });

  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
const router = useRouter();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("User"))?.tokens;
        const res = await fetch("https://itch-clinc.runasp.net/api/Users/GetAllUsersWithUserRole", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("فشل في جلب المستخدمين:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({});

    const token = JSON.parse(localStorage.getItem("User"))?.tokens;
    if (!token) {
      alert("التوكن غير موجود");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("ImageUrl", formData.imageFile);
    form.append("Description", formData.description);
    form.append("Title", formData.title);
    form.append("Type", formData.type);

    const endpoint = `https://itch-clinc.runasp.net/api/PatientMedicalRecord/Add/${formData.userId}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        }
        throw new Error("فشل في إرسال البيانات");
      }

      setSuccess(true);
       router.push("rumor");

      setFormData({
        imageFile: null,
        description: "",
        title: "",
        type: "",
        userId: "",
      });
    } catch (err) {
      console.error("خطأ أثناء الإرسال:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl ml-10 mr-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          إضافة سجل طبي جديد
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            تم حفظ السجل الطبي بنجاح!
          </div>
        )}

        <form className="space-y-6">
          {/* اختيار المريض */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المريض
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">اختر المريض</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            {errors.UserId && errors.UserId.map((err, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">{err}</p>
            ))}
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع السجل
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">اختر النوع</option>
              <option value="أشعة">أشعة</option>
              <option value="تحليل">تحليل</option>
            </select>
            {errors.Type && errors.Type.map((err, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">{err}</p>
            ))}
          </div>

          {/* العنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العنوان
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: فحص دوري، أشعة صدر..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
            {errors.Title && errors.Title.map((err, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">{err}</p>
            ))}
          </div>

        
        

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="اكتب وصفاً تفصيلياً للسجل الطبي..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
            {errors.Description && errors.Description.map((err, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">{err}</p>
            ))}
          </div>

          {/* رفع الصورة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة السجل
            </label>
            <div className="border border-gray-300 rounded-lg p-4 border-dashed">
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
            {errors.ImageUrl && errors.ImageUrl.map((err, index) => (
              <p key={index} className="text-red-500 text-sm mt-1">{err}</p>
            ))}
          </div>

          {/* زر الإرسال */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الحفظ...
                </div>
              ) : (
                "حفظ السجل الطبي"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}