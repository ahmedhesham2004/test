"use client";
import React, { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const PersonalInfo = ({ fetchEndpoint }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  const token = JSON.parse(localStorage.getItem('User'))?.tokens;

  const editableFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "sex",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fetchEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (data) {
          setUserData(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [fetchEndpoint]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);
  
      return () => clearTimeout(timer); 
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSave = async () => {
    setMessage(null);

    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData)
          .filter(([key]) => editableFields.includes(key))
          .map(([key, value]) => {
            if (
              ["firstName", "lastName", "sex"].includes(key) &&
              typeof value === "string"
            ) {
              return [key, capitalize(value)];
            }
            return [key, value];
          })
      );

      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Account/UpdateProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(filteredData),
        }
      );

      const text = await res.text();
      const updated = text ? JSON.parse(text) : formData;

      if (res.ok) {
        setUserData(updated);
        setIsEditing(false);
        setMessage("تم تحديث البيانات بنجاح");
      } else {
        throw new Error(text || "Failed to update");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("حدث خطأ أثناء تحديث البيانات");
    }
  };

  if (!userData) {
    return (
      <p className="text-center mt-10 text-gray-500">...جاري تحميل البيانات</p>
    );
  }

  return (
    <div className="w-full mb-2 py-6 relative  bg-white rounded-lg shadow-md max-w-2xl mx-auto" dir="rtl">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 left-4 p-2 mb-6 mt-2 rounded-full hover:cursor-pointer hover:bg-blue-50 border border-blue-100"
        >
          <PencilSquareIcon className="w-6 h-6 text-blue-700" />
        </button>
      )}
      <h2 className="text-blue-900 text-xl pr-6 font-bold mb-6  text-right border-b pb-3 bg-white rounded-t-md">المعلومات الشخصية</h2>
      <div className="w-full px-6">
        <div className="grid grid-cols-1 mb-5 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-blue-900 font-semibold text-right">الاسم الأول</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-blue-900 font-semibold text-right">اسم العائلة</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-blue-900 font-semibold text-right">رقم الهاتف</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-blue-900 font-semibold text-right">البريد الإلكتروني</label>
            <input
              type="text"
              name="email"
              value={formData.email ? capitalize(formData.email) : ""}
              readOnly
              disabled={!isEditing}
              className="w-full px-4 py-2 bg-gray-100 border border-blue-100 rounded-lg text-blue-900"
            />
          </div>
          <div>
            <label className="block mb-2 text-blue-900 font-semibold text-right">النوع</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-[10px] bg-blue-50 border border-blue-200 rounded-lg text-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">اختر النوع</option>
              <option value="Male">ذكر</option>
              <option value="Female">أنثى</option>
            </select>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex  mx-6 md:mx-0 md:ml-6 flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 px-6 rounded-full font-bold transition-all"
          >
            حفظ التعديلات
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-red-100 text-red-700 py-2 px-6 rounded-full font-bold hover:bg-red-200 transition-all"
          >
            إلغاء
          </button>
        </div>
      )}

      {message && (
        <p className={`mt-4 text-center text-sm ${message.includes('نجاح') || message.includes('successfully') ? 'text-green-700' : 'text-red-600'}`}>{
          message === "تم تحديث البيانات بنجاح"
            ? "تم تحديث البيانات بنجاح"
            : message === "حدث خطأ أثناء تحديث البيانات"
            ? "حدث خطأ أثناء تحديث البيانات"
            : message
        }</p>
      )}
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  editable,
  onChange,
  fullWidth,
  isSelect,
}) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <label className="block mb-1 text-gray-600 font-semibold">{label}</label>
    {editable && isSelect ? (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border px-4 py-1.5 rounded-lg border-[#40434878] bg-[#40434878] text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
      >
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    ) : (
      <input
        type="text"
        name={name}
        value={value || ""}
        readOnly={!editable}
        onChange={onChange}
        className={`w-full border px-4 py-1.5 rounded-lg ${
          editable
            ? "border-[#40434878] bg-[#40434878] text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            : "bg-gray-100 border-gray-300"
        }`}
      />
    )}
  </div>
);

export default PersonalInfo;
