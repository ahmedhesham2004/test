"use client";
import React, { useState } from "react";
import {
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function   AccountSecurity() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const token = JSON.parse(localStorage.getItem('User'))?.tokens;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (!formData.oldPassword || !formData.newPassword) {
      setMessage(" All fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage(" The new password must be at least 6 characters long");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage("The new password cannot be the same as the old one");
      return;
    }

    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Account/ChangePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            CurrentPassword: formData.oldPassword,
            NewPassword: formData.newPassword,
          }),
        }
      );

      if (res.ok) {
        setMessage(" Password changed successfully");
        setIsEditing(false);
        setFormData({ oldPassword: "", newPassword: "" });
      } else {
        const errText = await res.text();
        throw new Error(errText ||"Failed to change password");
      }
    } catch (error) {
      console.error("Password change failed:", error);
      setMessage(" Failed to change password");
    }
  };

  return (
    <div className="mt-10 mb-10 pb-3 bg-white rounded-md relative shadow-md max-w-2xl mx-auto" dir="rtl">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 left-4 p-2 rounded-full cursor-pointer hover:bg-blue-50 border border-blue-100"
        >
          <PencilSquareIcon className="w-6 h-6 text-blue-700" />
        </button>
      )}

      <h2 className="font-bold mb-6 px-7 pt-5 pb-4 border-b text-blue-900 text-xl text-right bg-white rounded-t-md">
        تغيير كلمة المرور
      </h2>

      <div className="space-y-5 p-6 pb-5 pt-0">
        <Field
          label="كلمة المرور الحالية"
          name="oldPassword"
          type={showPasswords.oldPassword ? "text" : "password"}
          value={formData.oldPassword}
          onChange={handleChange}
          editable={isEditing}
          show={showPasswords.oldPassword}
          toggleShow={() =>
            setShowPasswords((prev) => ({
              ...prev,
              oldPassword: !prev.oldPassword,
            }))
          }
        />
        <Field
          label="كلمة المرور الجديدة"
          name="newPassword"
          type={showPasswords.newPassword ? "text" : "password"}
          value={formData.newPassword}
          onChange={handleChange}
          editable={isEditing}
          show={showPasswords.newPassword}
          toggleShow={() =>
            setShowPasswords((prev) => ({
              ...prev,
              newPassword: !prev.newPassword,
            }))
          }
        />
      </div>

      {isEditing && (
        <div className="mt-6 flex    flex-col sm:flex-row gap-4 p-6 pt-0 justify-end">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({ oldPassword: "", newPassword: "" });
              setMessage(null);
            }}
            className="bg-red-100 text-red-700 py-2 px-6 rounded-full hover:bg-red-200 font-bold transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 px-6 rounded-full font-bold transition-all"
          >
            حفظ كلمة المرور
          </button>
        </div>
      )}

      {message && (
        <p className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{
          message === " All fields are required"
            ? "جميع الحقول مطلوبة"
            : message === " The new password must be at least 6 characters long"
            ? "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"
            : message === "The new password cannot be the same as the old one"
            ? "كلمة المرور الجديدة لا يمكن أن تكون مثل القديمة"
            : message === " Password changed successfully"
            ? "تم تغيير كلمة المرور بنجاح"
            : message === " Failed to change password"
            ? "حدث خطأ أثناء تغيير كلمة المرور"
            : message
        }</p>
      )}
    </div>
  );
}

const Field = ({
  label,
  name,
  value,
  onChange,
  editable,
  type = "text",
  show,
  toggleShow,
}) => (
  <div className="relative">
    <label className="block mb-1 text-blue-900 font-semibold text-right">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      readOnly={!editable}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg pr-10 text-blue-900 placeholder:text-gray-400 bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
        editable ? '' : 'bg-gray-100 border-gray-200'
      }`}
    />
    {editable && (
      <button
        type="button"
        onClick={toggleShow}
        className="absolute top-[38px] left-3 text-blue-700 cursor-pointer"
      >
        {show ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    )}
  </div>
);
