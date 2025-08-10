"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";

export default function UserAccount() {
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    if (user?.tokens) setToken(user.tokens);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/GetBookedByuser",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      showMessage("حدث خطأ في تحميل الحجوزات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      showMessage("نوع الملف غير مسموح به (يجب أن يكون jpg, jpeg, png)", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("حجم الملف كبير جداً (الحد الأقصى 5MB)", "error");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!imageFile) {
      showMessage("يجب اختيار صورة التحويل", "error");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("phoneNumber", phoneNumber);

    
//     const now = new Date();
// const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
// const localISOString = yesterday.toISOString();



    // formData.append("paymentDate", localISOString.split(".")[0]);

  
    formData.append("ImageUrl", imageFile);

    try {
      const res = await fetch(
        `https://itch-clinc.runasp.net/api/Payment/ConfirmAppointment/${selectedPayment}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.errors
          ? Object.values(data.errors).flat().join(", ")
          : data.message || "حدث خطأ أثناء إرسال البيانات";
        throw new Error(errorMsg);
      }

      showMessage("تم إرسال بيانات الدفع بنجاح", "success");
      closeModal();
      fetchBookings();
    } catch (error) {
      console.error("Payment Error:", error);
      showMessage(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (bookingId) => {
    setSelectedPayment(bookingId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
    setPhoneNumber("");
    setImageFile(null);
    setImagePreview("");
  };

  const getStatusColor = (booking) => {
    if (booking.status === "Confirmed") return "bg-green-100 text-green-800 border-green-200";
    if (booking.status === "PendingReview") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusIcon = (booking) => {
    if (booking.status === "Confirmed") return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">جاري تحميل الحجوزات...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Calendar className="w-6 h-6 mr-3" />
                الحجوزات ({bookings.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 text-gray-500 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">
                          {booking.patientName}
                        </h3>
                        <span
                          className={`mr-4 px-3 py-1 rounded-full text-sm font-medium border flex items-center ${getStatusColor(
                            booking
                          )}`}
                        >
                          {getStatusIcon(booking)}
                          <span className="mr-1">
                            {booking.status === "Confirmed"
                              ? "مؤكد"
                              : booking.status === "PendingReview"
                              ? "قيد المراجعة"
                              : "في الانتظار"
                              }
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          <span>{formatDate(booking.appointmentDate)}</span>
                        </div>

                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-gray-700">الحالة: {booking.status}</span>
                        </div>
                      </div>
                      <div className="pr-3 pt-2 ">
                            اسم الدكتور : 
                            {  booking.doctorName||"لم يتم اضافه دكتور بعد"}
                          </div>
                    </div>

                    <div className="flex items-center justify-end">
                      {booking.status === "PendingConfirmation" && (
                        <button
                          onClick={() => openModal(booking.id)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
                        >
                          ارسال بيانات الدفع
                        </button>
                      )}
                    </div>
                    {booking.prescription ?( <div className="relative flex md:flex-col  md:top-3">
                      <div  className="">
                      <Link href={`/payment/${booking.id}`} className="p-3 px-4 rounded-xl text-white bg- bg-blue-500 hover:bg-blue-400">
                        الروشتة
                      </Link>
                    </div>
                    <div className="mt-6 m-auto">
                      <Link className="p-3 px-4 rounded-xl text-white bg- bg-blue-500 hover:bg-blue-400" href={`account/${booking.id}`}>معلومات الدفع</Link>
                    </div>
                    </div>
                  ):<div  className="relative font-medium text-red-700  top-0 md:top-10">
                      لم يتم الكشف بعد
                    </div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">
              لا توجد حجوزات
            </h3>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 text-gray-500 hover:text-red-500"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-right">إرسال بيانات الدفع</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-right">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border rounded p-2 text-right"
                    required
                    pattern="[0-9]{10,15}"
                    title="يجب أن يكون رقم الهاتف بين 10 إلى 15 رقمًا"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-right">
                    صورة التحويل
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="w-full border rounded p-2"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 object-contain border rounded"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    مسموح بملفات JPG, JPEG, PNG بحد أقصى 5MB
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center min-w-20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "إرسال الدفع"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {message.text && (
          <div
            className={`fixed bottom-4 left-4 px-4 py-2 rounded-lg shadow-md text-white ${
              message.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
