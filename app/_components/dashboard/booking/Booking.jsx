"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  AlertCircle,
  Users,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const Booking = () => {
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [deleteResponse, setDeleteResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  // تحميل التوكن من localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    if (user?.tokens) setToken(user.tokens);
  }, []);

  // عرض الرسائل
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // تحميل الحجوزات المحجوزة فقط
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/GetBookedAppointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في جلب الحجوزات");
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data);
      showMessage("تم تحميل الحجوزات بنجاح", "success");
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showMessage("حدث خطأ في تحميل الحجوزات", "error");
    } finally {
      setLoading(false);
    }
  };

  // State جديد
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // دالة تحميل بيانات الدفع
  const fetchPaymentDetails = async (id) => {
    try {
      const res = await fetch(
        `https://itch-clinc.runasp.net/api/Payment/Get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(id);
      if (!res.ok) throw new Error("فشل في تحميل بيانات الدفع");
      const data = await res.json();
      setSelectedPayment(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      showMessage("فشل في تحميل بيانات الدفع", "error");
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const res = await fetch(
        `https://itch-clinc.runasp.net/api/Appointment/Cancel/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.text();

      if (!res.ok) throw new Error(result);

      showMessage("تم إلغاء الحجز بنجاح", "success");
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      showMessage("فشل في إلغاء الحجز", "error");
    }
  };

  // استدعاء endpoint مخصص للدكاترة بدلاً من الفلترة
  const fetchDoctors = async () => {
    const token = JSON.parse(localStorage.getItem('User'))?.tokens;
    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Users/GetAllDoctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في جلب بيانات الأطباء");
      const data = await res.json();
      setDoctors(data || []);
      
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
   
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(parsedUser.tokens);
    }

    fetchDoctors();
  }, []);

  const confirmPayment = async () => {
    if (!selectedDoctorId) {
      showMessage("يجب اختيار طبيب أولاً", "error");
      return;
    }

    try {
      const formData = new FormData();
          formData.append("doctorId", selectedDoctorId);
      const res = await fetch(
        `https://itch-clinc.runasp.net/api/Payment/AdminConfirmedAppointment/${selectedPayment.appointmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
        
          },
          body: formData,
        }
      );

      const result = await res.text();
      console.log(formData)

      if (!res.ok) throw new Error(result);

      showMessage("تمت الموافقة على الدفع بنجاح", "success");
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error approving payment:", error);
      showMessage("فشل في الموافقة على الدفع", "error");
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  // فلترة الحجوزات
  useEffect(() => {
    let filtered = bookings;

    // فلترة بالاسم
    if (searchTerm) {
      filtered = filtered.filter((booking) =>
        booking.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // فلترة بالحالة
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => {
        if (statusFilter === "booked") {
          return booking.status === "Confirmed";
        }
        if (statusFilter === "not-booked") {
          return (
            booking.status === "PendingReview" ||
            booking.status === "PendingConfirmation"
          );
        }
        return booking.status?.toLowerCase() === statusFilter;
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  // حذف الحجوزات القديمة
  const deleteOldBookings = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/DeleteAppointmentsOlderThanOneMonth",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text();
      setDeleteResponse(text);
      showMessage("تم حذف الحجوزات القديمة بنجاح", "success");
      fetchBookings();
    } catch (error) {
      setDeleteResponse("حصل خطأ أثناء الحذف");
      showMessage("حدث خطأ أثناء الحذف", "error");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getStatusColor = (booking) => {
    if (booking.isBooked) return "bg-green-100 text-green-800 border-green-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusIcon = (booking) => {
    if (booking.isBooked) return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    underReview: bookings.filter(
      (b) => b.status === "PendingReview" || b.status === "PendingConfirmation"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-7xl mr-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">إدارة الحجوزات</h1>
          </div>
          <p className="text-gray-600 text-lg">
            تتبع وإدارة جميع حجوزات المرضى
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg shadow-md flex items-center animate-pulse ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">إجمالي الحجوزات</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">الحجوزات المؤكدة</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.confirmed}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-r-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">قيد المراجعة</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.underReview}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث باسم المريض..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="all">جميع الحجوزات</option>
                <option value="booked">الحجوزات المؤكدة</option>
                <option value="not-booked">في الانتظار</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={fetchBookings}
                disabled={loading || !token}
                className="flex items-center px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                تحديث
              </button>

              <button
                onClick={deleteOldBookings}
                disabled={deleteLoading || !token}
                className="flex items-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5 mr-2" />
                )}
                حذف القديمة
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">جاري تحميل الحجوزات...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Calendar className="w-6 h-6 mr-3" />
                الحجوزات ({filteredBookings.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start relative justify-between">
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
                            {booking.isBooked ? "مؤكد" : "في الانتظار"}
                          </span>
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          <span>{formatDate(booking.appointmentDate)}</span>
                          
                        </div>

                        <div className="flex items-center ">
                          <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 text-blue-500 mt-1" />
                            <span className="text-gray-700">الحالة:</span>
                          </div>

                          <div className="mr-2">
                            {booking.status === "PendingReview" ? (
                              <button
                                onClick={() => fetchPaymentDetails(booking.id)}
                                className="mt-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                              >
                                عرض الدفع
                              </button>
                            ) : (
                              <span className="inline-block mt-1 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg">
                                {booking.status === "Confirmed" ? (
                                  <p className="mt-0 text-green-600">
                                    تم التأكيد
                                  </p>
                                ) : (
                                  <p className="mt-0 text-red-600">
                                    لم يتم الدفع
                                  </p>
                                )}
                              </span>
                            ) }
                          </div>
                          
                        </div>
                        <div className="pr-3 ">
                            اسم الدكتور : 
                            {  booking.doctorName||"لم يتم اضافه دكتور بعد"}
                          </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-gray-600">
                      {booking.status === "PendingConfirmation" && (
                        <button
                          onClick={() => cancelAppointment(booking.id)}
                          className=" text-white   rounded  transition mt-1"
                        >
                          <Trash2 className="w-6 h-6 text-red-600 cursor-pointer" />
                        </button>
                      )}
                    </div>
                    {booking.prescription ?(
                    <div className="relative flex md:flex-col  md:top-10">
                        <div  >
                      <Link href={`/dashboard/booking/${booking.id}`} className="p-3 px-4 rounded-xl text-white bg- bg-blue-500 hover:bg-blue-400">
                        الروشتة
                      </Link>
                    </div>
                    <div className="mt-6 m-auto">
                      <Link className="p-3 px-4 rounded-xl text-white bg- bg-blue-500 hover:bg-blue-400" href={`/accounting/${booking.id}`}>معلومات الدفع</Link>
                    </div>
                    </div>
                  ):<div  className="relative font-black text-red-700  top-0 md:top-10">
                      لم يتم الكشف بعد
                    </div>}
                    
                    {/* <div  className="relative top-12">
                      <Link href={`/dashboard/booking/${booking.id}`} className="p-3 px-4 rounded-xl text-white bg- bg-blue-500 hover:bg-blue-400">
                        الروشتة
                      </Link>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد حجوزات
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "لا توجد حجوزات تطابق معايير البحث"
                : "لم يتم العثور على أي حجوزات حتى الآن"}
            </p>
          </div>
        )}

        {/* Delete Response */}
        {deleteResponse && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-800 p-4">
              <h3 className="text-white font-semibold flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                نتيجة عملية الحذف
              </h3>
            </div>
            <pre className="p-4 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50">
              {deleteResponse}
            </pre>
          </div>
        )}

        {!token && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              يرجى تسجيل الدخول
            </h3>
            <p className="text-gray-500">
              تحتاج إلى تسجيل الدخول للوصول إلى الحجوزات
            </p>
          </div>
        )}
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 left-3 text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                بيانات الدفع
              </h2>

              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>رقم الحجز:</strong> {selectedPayment.appointmentId}
                </p>
                <p>
                  <strong>رقم الهاتف:</strong> {selectedPayment.phoneNumber}
                </p>
                <p>
                  <strong>تاريخ الدفع:</strong>{" "}
                  {formatDate(selectedPayment.paymentDate)}
                </p>
                <div>
                  <strong>صورة الدفع:</strong>
                  <img
                    src={`https://itch-clinc.runasp.net/${selectedPayment.imageUrl}`}
                    alt="إيصال الدفع"
                    className="mt-2 rounded-xl max-h-64 object-contain border"
                  />
                </div>
                <div className="space-y-2">
                  <label className=" text-right font-semibold text-gray-700 flex items-center justify-end gap-2">
                    <span>اختر الدكتور</span>
                    <User className="w-4 h-4 text-blue-500" />
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full  p-4 border-2 border-gray-200 rounded-xl text-right bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  >
                    <option value="">اختر دكتور</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={confirmPayment}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                تأكيد الموافقة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;