"use client";
import React, { useState, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";

const ProfileImage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [token, setToken] = useState(null);

  const baseURL = "https://itch-clinc.runasp.net"; 
  const baseURL1 = "https://itch-clinc.runasp.net/"; 

  useEffect(() => {
    const storedToken = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('User'))?.tokens
      : null;
    setToken(storedToken);

    const fetchImage = async () => {
      try {
        const response = await fetch(`https://itch-clinc.runasp.net/api/Account/Profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          setImageUrl(data.imageUrl); 
        } else {
          setErrorMessage("❌ Failed to fetch image");
        }
      } catch (error) {
        setErrorMessage("❌ An error occurred while fetching the image");
        console.error("An error occurred while fetching the image:", error);
      }
    };

    fetchImage();
  }, [token]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select only an image.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size is too large. Please choose an image less than 5MB.");
        return;
      }
      setNewImage(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newImage) {
      setErrorMessage("Please choose a photo first");
      return;
    }

    if (!token) {
      setErrorMessage("You must be logged in to upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", newImage);

    try {
      const response = await fetch(
        `${baseURL}/api/Account/ChangeImage`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.text();
        window.location.reload();
        console.log("Image uploaded successfully:", result);
        setSuccessMessage("✅ Image changed successfully");
        setErrorMessage(null);

        setImageUrl(URL.createObjectURL(newImage));
        setNewImage(null);

        setTimeout(() => {
          setIsEditing(false);
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error("Failed to upload image:", errorText);
        setErrorMessage("❌ Failed to upload image: " + (errorText || "Unknown error"));
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("An error occurred while uploading the image:", error);
      setErrorMessage("❌ An error occurred while uploading the image.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="relative text-center max-w-2xl mx-auto" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-0">
        <h2 className="text-blue-900 text-xl font-bold text-right border-b px-7 pt-5 pb-4 bg-white rounded-t-md">صورة الملف الشخصي</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mt-4 p-4">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 bg-blue-100 rounded-full flex justify-center items-center relative shadow border-4 border-white"
          style={{
            backgroundImage: `url(${
              newImage
                ? URL.createObjectURL(newImage)
                : imageUrl && imageUrl.startsWith("http")
                ? imageUrl
                : `${baseURL1}${imageUrl}`
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!newImage && !imageUrl && (
            <span className="text-blue-300 text-xl">لا توجد صورة</span>
          )}
          <div
            className="absolute left-[-10px] bottom-2"
            onClick={() => setIsEditing(true)}
          >
            <div className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-full cursor-pointer shadow">
              <CameraIcon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2 w-full">
          <p className="text-gray-700 text-[14px] sm:text-[13px] text-right">اختر صورة من جهازك لرفعها كصورة شخصية</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white cursor-pointer px-6 py-2 rounded-full shadow font-bold text-base transition-all"
          >
            رفع صورة جديدة
          </button>
        </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#00000036] bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-right"
            dir="rtl"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center text-blue-900">
              تغيير صورة الملف الشخصي
            </h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full mb-4 border-2 border-blue-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-l-lg hover:file:bg-blue-400 transition-all"
              placeholder="اختر صورة"
              aria-label="رفع صورة"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 px-4 rounded-full w-full font-bold text-lg shadow transition-all"
            >
              حفظ الصورة
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrorMessage(null);
                setSuccessMessage(null);
                setNewImage(null);
              }}
              className="mt-2 text-blue-700 hover:bg-blue-50 rounded-full p-2 px-4 w-fit text-center font-bold"
            >
              إلغاء
            </button>

            {errorMessage && (
              <p className="text-red-600 text-sm mt-4 text-center">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm mt-4 text-center">{successMessage}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
