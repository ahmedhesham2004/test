"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  AlertCircle,
  X,
  PlusCircle,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";



export default function Doctor() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    { type: "", name: "", dosageOrDetails: "" },
  ]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  
  // Morbid Modal States
  const [showMorbidModal, setShowMorbidModal] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [morbidLoading, setMorbidLoading] = useState(false);
  const [morbidError, setMorbidError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedBookingForMorbid, setSelectedBookingForMorbid] = useState(null);
  
  // AddAppointmentSpecialty States
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [specialtyItems, setSpecialtyItems] = useState([{ specialtieId: "", quantity: 1, price: 1 }]);
  const [specialtyErrors, setSpecialtyErrors] = useState([]);
  const [existingSpecialtyItems, setExistingSpecialtyItems] = useState({});
  const [specialtyLoading, setSpecialtyLoading] = useState({});
  const [specialtyFetchError, setSpecialtyFetchError] = useState({});
  const [specialtySubmitError, setSpecialtySubmitError] = useState("");
  const [specialtyResponseStatus, setSpecialtyResponseStatus] = useState({});
  const [isSpecialtyEditMode, setIsSpecialtyEditMode] = useState(false);
  const [specialtyEditIndex, setSpecialtyEditIndex] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [selectedBookingForSpecialty, setSelectedBookingForSpecialty] = useState(null);
  const [specialtyData, setSpecialtyData] = useState({});

  useEffect(() => {
    handleGetBookings();
  }, []);

  // Load specialties once when component mounts
  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Load specialty data for each booking when bookings change
  useEffect(() => {
    if (filteredBookings.length > 0) {
      // Clear previous data
      setSpecialtyData({});
      setSpecialtyLoading({});
      setSpecialtyFetchError({});
      setSpecialtyResponseStatus({});
      
      // Load data for each booking immediately
      filteredBookings.forEach(booking => {
        fetchSpecialtyData(booking);
      });
    }
  }, [filteredBookings]);

  useEffect(() => {
    // Apply filters whenever bookings or filter values change
    let result = [...bookings];

    if (nameFilter) {
      result = result.filter((booking) =>
        booking.patientName.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (dateFromFilter || dateToFilter) {
      const fromDate = dateFromFilter
        ? new Date(dateFromFilter).setHours(0, 0, 0, 0)
        : null;
      const toDate = dateToFilter
        ? new Date(dateToFilter).setHours(23, 59, 59, 999)
        : null;

      result = result.filter((booking) => {
        const bookingDate = new Date(booking.appointmentDate).getTime();

        if (fromDate && toDate) {
          return bookingDate >= fromDate && bookingDate <= toDate;
        } else if (fromDate) {
          return bookingDate >= fromDate;
        } else if (toDate) {
          return bookingDate <= toDate;
        }
        return true;
      });
    }

    setFilteredBookings(result);
  }, [bookings, nameFilter, dateFromFilter, dateToFilter]);

  const handleGetBookings = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) throw new Error("التوكن غير موجود");

      const response = await fetch(
        "https://itch-clinc.runasp.net/api/Appointment/GetDoctorBookings",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result?.description || "فشل التحميل");

      setBookings(result);
      setFilteredBookings(result);
      setShowBookings(true);
      setErrorMsg("");
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMsg(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "\u0645\u0624\u0643\u062f":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
      case "\u0641\u064a \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
      case "\u0645\u064c\u0644\u063a\u064a":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const openPrescriptionModal = (booking) => {
    setSelectedBooking(booking);
    setDiagnosis(booking?.prescription?.diagnosis || "");
    setNotes(booking?.prescription?.notes || "");
    setItems(
      booking?.prescription?.items?.length > 0
        ? booking.prescription.items
        : [{ type: "", name: "", dosageOrDetails: "" }]
    );
    setIsPrescriptionModalOpen(true);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { type: "", name: "", dosageOrDetails: "" }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmitPrescription = async () => {
    const token = JSON.parse(localStorage.getItem("User"))?.tokens;
    if (!token) return alert("التوكن غير موجود");

    const body = { diagnosis, notes, items };

    try {
      const res = await fetch(
        `https://itch-clinc.runasp.net/api/Prescription/Add/${selectedBooking.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        if (result?.errors) {
          let errorMessages = [];

          for (const key in result.errors) {
            const messages = result.errors[key];
            messages.forEach((msg) => {
              errorMessages.push(`• ${msg}`);
            });
          }

          alert("حدثت الأخطاء التالية:\n\n" + errorMessages.join("\n"));
        } else {
          throw new Error(result?.description || "فشل في إرسال الروشتة");
        }

        return;
      }

      alert("تم حفظ الروشتة بنجاح");
      setIsPrescriptionModalOpen(false);
      handleGetBookings();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ: " + err.message);
    }
  };

  const handleViewFullPrescription = (booking) => {
    if (booking?.id) {
      router.push(`/Prescription/${booking.id}`);
    }
  };

  const resetFilters = () => {
    setNameFilter("");
    setDateFromFilter("");
    setDateToFilter("");
  };

  // Morbid Modal Functions
  const fetchMedicalRecords = async (booking) => {
    try {
      setMorbidLoading(true);
      setMorbidError(null);

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
      setMorbidError(err.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setMorbidLoading(false);
    }
  };

  const handleMorbidButtonClick = (booking) => {
    setSelectedBookingForMorbid(booking);
    setShowMorbidModal(true);
    document.body.classList.add('modal-open');
    fetchMedicalRecords(booking);
  };

  const handleCloseMorbidModal = () => {
    setShowMorbidModal(false);
    document.body.classList.remove('modal-open');
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

  // AddAppointmentSpecialty Functions
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

  const fetchSpecialtyData = async (booking) => {
    try {
      setSpecialtyLoading(prev => ({ ...prev, [booking.id]: true }));
      setSpecialtyFetchError(prev => ({ ...prev, [booking.id]: "" }));
      setSpecialtyResponseStatus(prev => ({ ...prev, [booking.id]: null }));

      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) throw new Error("التوكن غير موجود");
      
      const res = await fetch(
        `https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Get/${booking.id}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          method: 'GET'
        }
      );
      
      setSpecialtyResponseStatus(prev => ({ ...prev, [booking.id]: res.status }));
      
      if (!res.ok) {
        // Check if it's a "no data" error (404 or specific error message)
        const errData = await res.json().catch(() => null);
        const errorMessage = errData?.errors?.[0]?.description || errData?.description || errData?.message || "";
        
        // If it's a "no data" error, treat it as success with empty data
        if (res.status === 404 || errorMessage.includes("لم يتم تسجيل بيانات الكشف") || errorMessage.includes("no data")) {
          setSpecialtyData(prev => ({ ...prev, [booking.id]: { items: [] } }));
          setSpecialtyLoading(prev => ({ ...prev, [booking.id]: false }));
          return;
        }
        
        // For other errors, throw the error
        throw new Error(errorMessage || `خطأ كود: ${res.status}`);
      }
      
      const data = await res.json();
      setSpecialtyData(prev => ({ ...prev, [booking.id]: data }));
      
    } catch (err) {
      // Only log and set error for actual errors, not "no data" cases
      if (!err.message.includes("لم يتم تسجيل بيانات الكشف") && !err.message.includes("no data")) {
        console.error('Specialty data fetch error:', err);
        setSpecialtyFetchError(prev => ({ ...prev, [booking.id]: err.message || "حدث خطأ أثناء جلب البيانات" }));
      }
      setSpecialtyData(prev => ({ ...prev, [booking.id]: { items: [] } }));
    } finally {
      setSpecialtyLoading(prev => ({ ...prev, [booking.id]: false }));
    }
  };

  const validateSpecialtyForm = () => {
    const newErrors = specialtyItems.map(item => {
      const err = {};
      if (!item.specialtieId) err.specialtieId = "مطلوب";
      if (item.quantity < 1) err.quantity = "يجب أن تكون 1 أو أكثر";
      if (item.price < 0) err.price = "لا يمكن أن يكون السعر سالبًا";
      return err;
    });
    
    setSpecialtyErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  const handleSpecialtySubmit = async (e) => {
    e.preventDefault();
    if (!validateSpecialtyForm()) return;
    
    const token = JSON.parse(localStorage.getItem("User"))?.tokens;
    if (!token) {
      setSpecialtySubmitError("التوكن غير موجود");
      return;
    }
    
    setSpecialtySubmitError("");
    const body = { items: specialtyItems.map(item => ({
      specialtieId: Number(item.specialtieId),
      quantity: Number(item.quantity),
      price: Number(item.price)
    }))};
    
    const url = isSpecialtyEditMode
      ? `https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Update/${selectedBookingForSpecialty.id}`
      : `https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Add/${selectedBookingForSpecialty.id}`;
    const method = isSpecialtyEditMode ? "PUT" : "POST";

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
        const msg = errData?.description || errData?.message || `فشل في ${isSpecialtyEditMode ? "التعديل" : "الإضافة"}`;
        throw new Error(msg);
      }
      
      setShowSpecialtyModal(false);
      setSpecialtyErrors([]);
      setSpecialtySubmitError("");
      setIsSpecialtyEditMode(false);
      setSpecialtyEditIndex(null);
      await fetchSpecialtyData(selectedBookingForSpecialty);
      setSelectedBookingForSpecialty(null);
    } catch (err) {
      setSpecialtySubmitError(err.message || "حدث خطأ أثناء الإرسال");
    }
  };

  const handleSpecialtyAddItem = () => {
    setSpecialtyItems([...specialtyItems, { specialtieId: "", quantity: 1, price: 1 }]);
    setSpecialtyErrors([...specialtyErrors, {}]);
  };

  const handleSpecialtyRemoveItem = (index) => {
    if (specialtyItems.length === 1) return;
    
    const newItems = [...specialtyItems];
    newItems.splice(index, 1);
    setSpecialtyItems(newItems);
    
    const newErrors = [...specialtyErrors];
    newErrors.splice(index, 1);
    setSpecialtyErrors(newErrors);
  };

  const handleSpecialtyItemChange = (index, field, value) => {
    const newItems = [...specialtyItems];
    newItems[index][field] = value;
    setSpecialtyItems(newItems);
  };

  const prepareSpecialtyEdit = (index) => {
    if (!selectedBookingForSpecialty || !specialtyData[selectedBookingForSpecialty.id]?.items?.[index]) return;
    
    setIsSpecialtyEditMode(true);
    setSpecialtyEditIndex(index);
    setShowSpecialtyModal(true);
    
    // Set the items for editing
    const item = specialtyData[selectedBookingForSpecialty.id].items[index];
    setSpecialtyItems([{
      specialtieId: item.specialtieId.toString(),
      quantity: item.quantity,
      price: item.price
    }]);
  };

  const handleSpecialtyButtonClick = (booking) => {
    setSelectedBookingForSpecialty(booking);
    fetchSpecialtyData(booking);
  };

  // Function to get specialty data for a specific booking
  const getSpecialtyDataForBooking = (booking) => {
    // This will be called for each booking to get its specialty data
    fetchSpecialtyData(booking);
  };

  const handleCloseSpecialtyModal = () => {
    setShowSpecialtyModal(false);
    setIsSpecialtyEditMode(false);
    setSpecialtyEditIndex(null);
    if (selectedBookingForSpecialty) {
      fetchSpecialtyData(selectedBookingForSpecialty);
    }
    setSelectedBookingForSpecialty(null);
  };

  // Print function based on Reset.jsx
  const handlePrintSpecialty = async (bookingId) => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) {
        alert("التوكن غير موجود");
        return;
      }

      // First, try to get the specialty data
      const res = await fetch(`https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Get/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("فشل في جلب البيانات");
      }

      const data = await res.json();
      
      // Now send to accounting API
      const accountingRes = await fetch(
        `https://itch-clinc.runasp.net/api/AccountingTransaction/AddAppointmentToTransactions/${bookingId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!accountingRes.ok) {
        console.error("فشل تسجيل العملية");
        alert("فشل تسجيل المعاملة في النظام");
      } else {
        console.log("تم تسجيل العملية بنجاح");
        alert("تم تسجيل المعاملة بنجاح");
      }

    } catch (error) {
      console.error("خطأ أثناء الطباعة:", error.message);
      alert(`خطأ في الطباعة: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                لوحة تحكم الطبيب
              </h1>
              <p className="text-gray-600 mt-1">إدارة المواعيد والحجوزات</p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl mb-8 shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold text-lg">
                  خطأ في تحميل البيانات
                </h3>
                <p className="text-red-700 mt-1">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {showBookings && !errorMsg && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-7 h-7 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  جميع الحجوزات
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredBookings.length} حجز
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 mt-6">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5"
                    placeholder="ابحث باسم المريض"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      بداية من
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Filter className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نهاية إلى
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Filter className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 relative">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">رقم الحجز</p>
                          <p className="font-bold text-gray-800 text-lg">
                            #{booking?.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            التاريخ والوقت
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatDate(booking?.appointmentDate)}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                          booking?.status
                        )}`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current ml-2"></div>
                        {booking?.status}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          بيانات المريض
                        </h3>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">
                                اسم المريض
                              </p>
                              <p className="font-bold text-gray-800">
                                {booking?.patientName}
                              </p>
                              <p className="text-sm text-gray-500">
                                كود: {booking?.patientId}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
                          <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
                            {specialtyLoading[booking.id] === true && !specialtyData[booking.id] && !specialtyResponseStatus[booking.id] ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
                                  <p className="text-blue-600 font-medium">جاري التحميل...</p>
                                </div>
                              </div>
                            ) : specialtyResponseStatus[booking.id] === 200 && specialtyData[booking.id]?.items?.length > 0 ? (
                              <div className="space-y-1">
                                <div className="flex rtl:space-x-reverse">
                                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                  <h3 className="text-lg font-bold text-blue-800">الكشوفات المضافة</h3>
                                </div>
                                
                                <div className="grid gap-3">
                                  {specialtyData[booking.id].items.map((item, index) => (
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
                                          onClick={() => {
                                            setSelectedBookingForSpecialty(booking);
                                            prepareSpecialtyEdit(index);
                                          }}
                                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:shadow-md"
                                        >
                                          تعديل
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : specialtyResponseStatus[booking.id] === 200 || specialtyResponseStatus[booking.id] === 404 || specialtyResponseStatus[booking.id] === undefined || !specialtyLoading[booking.id] || specialtyData[booking.id] ? (
                              <div className="text-center py-1">
                                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <p className="text-gray-500 text-lg mb-4">لا توجد كشوفات مضافة بعد</p>
                                <button
                                  onClick={() => {
                                    setIsSpecialtyEditMode(false);
                                    setSpecialtyItems([{ specialtieId: "", quantity: 1, price: 1 }]);
                                    setSelectedBookingForSpecialty(booking);
                                    setShowSpecialtyModal(true);
                                  }}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                  + إضافة كشف جديد
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-5">
                                <button
                                  onClick={() => {
                                    setIsSpecialtyEditMode(false);
                                    setSpecialtyItems([{ specialtieId: "", quantity: 1, price: 1 }]);
                                    setSelectedBookingForSpecialty(booking);
                                    setShowSpecialtyModal(true);
                                  }}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                  + إضافة كشف
                                </button>
                              </div>
                            )}
                            
                            {/* Show error if there's one (but not for "no data" errors) */}
                            {specialtyFetchError[booking.id] && !specialtyFetchError[booking.id].includes("لم يتم تسجيل بيانات الكشف") && (
                              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{specialtyFetchError[booking.id]}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                          بيانات الطبيب والروشتة
                        </h3>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-teal-100 p-2 rounded-lg">
                              <Stethoscope className="w-4 h-4 text-teal-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">
                                اسم الطبيب
                              </p>
                              <p className="font-bold text-gray-800">
                                {booking?.doctorName}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-3">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <p className="text-sm font-medium text-gray-600">
                                الروشتة الطبية
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 min-h-20 space-y-2">
                              {booking?.prescription ? (
                                <>
                                  <p className="text-sm text-gray-700">
                                    <strong>التشخيص:</strong>{" "}
                                    {booking.prescription.diagnosis}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <strong>ملاحظات:</strong>{" "}
                                    {booking.prescription.notes || "لا يوجد"}
                                  </p>
                                  <div className="text-sm text-gray-700 mt-2 hidden space-y-1">
                                    {booking.prescription.items
                                      ?.slice(0, 2)
                                      .map((item, idx) => (
                                        <p key={idx}>
                                          - {item.name} ({item.type}) –{" "}
                                          {item.dosageOrDetails}
                                        </p>
                                      ))}
                                    {booking.prescription.items?.length > 2 && (
                                      <p className="text-xs text-gray-500">
                                        و{" "}
                                        {booking.prescription.items.length - 2}{" "}
                                        عناصر أخرى...
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-3 mt-3">
                                    <button
                                      onClick={() =>
                                        handleViewFullPrescription(booking)
                                      }
                                      className="text-blue-600 text-sm hover:underline"
                                    >
                                      عرض التفاصيل كاملة
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <p className="text-sm text-gray-500">
                                    لم يتم كتابة روشتة بعد
                                  </p>
                                  <button
                                    onClick={() =>
                                      openPrescriptionModal(booking)
                                    }
                                    className="text-blue-600 text-sm hover:underline"
                                  >
                                    إضافة رُشدة
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bg-white text-center rounded-lg p-4 border border-gray-200 space-y-4">
                          <button
                            onClick={() => handleMorbidButtonClick(booking)}
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-500 text-lg">
                    لا توجد نتائج مطابقة للبحث
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 mt-2 hover:underline"
                  >
                    إعادة تعيين الفلتر
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-center justify-center"> 
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative top-1/8 max-h-[70vh] overflow-y-auto">
            <button
              onClick={() => setIsPrescriptionModalOpen(false)}
              className="absolute top-2 left-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              إضافة رُشدة
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  التشخيص
                </label>
                <input
                  type="text"
                  className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ملاحظات
                </label>
                <textarea
                  className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  العناصر
                </label>
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <select
                      className="col-span-3 text-black border rounded-md px-2 py-1"
                      value={item.type}
                      onChange={(e) =>
                        handleItemChange(index, "type", e.target.value)
                      }
                    >
                      <option value="">اختر النوع</option>
                      <option value="الدواء">الدواء</option>
                      <option value="التحليل">التحليل</option>
                      <option value="الأشعة">الأشعة</option>
                    </select>
                    <input
                      className="col-span-3 text-black border rounded-md px-2 py-1"
                      placeholder="اسم العنصر"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                    />
                    <input
                      className="col-span-5 text-black border rounded-md px-2 py-1"
                      placeholder="الجرعة أو التفاصيل"
                      value={item.dosageOrDetails}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "dosageOrDetails",
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="flex items-center text-blue-600 text-sm gap-1 mt-2"
                >
                  <PlusCircle className="w-4 h-4" /> إضافة عنصر جديد
                </button>
              </div>

              <button
                onClick={handleSubmitPrescription}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-4"
              >
                حفظ الروشتة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Morbid Modal */}
      {showMorbidModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ overscrollBehavior: 'none' }}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={handleCloseMorbidModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col" style={{ overscrollBehavior: 'contain' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex justify-between items-center rounded-t-2xl flex-shrink-0">
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
                onClick={handleCloseMorbidModal}
                className="text-white hover:text-gray-200 text-2xl sm:text-3xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
              >
                &times;
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto bg-gray-50 modal-scroll" style={{ overscrollBehavior: 'contain' }}>
                <div className="p-4 sm:p-6">
                  {morbidLoading ? (
                    <div className="flex flex-col justify-center items-center h-48 sm:h-60">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-ping"></div>
                      </div>
                      <p className="text-gray-600 mt-4 font-medium text-sm sm:text-base">
                        جاري تحميل البيانات...
                      </p>
                    </div>
                  ) : morbidError ? (
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
                          {morbidError}
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
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 p-4 sm:p-6 flex justify-end rounded-b-2xl flex-shrink-0">
              <button
                onClick={handleCloseMorbidModal}
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

      {/* AddAppointmentSpecialty Modal */}
      {showSpecialtyModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm transition-opacity duration-300"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-100 hover:scale-[1.02] max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6 relative">
                <button
                  className="absolute top-4 right-4 text-white hover:text-red-300 text-2xl font-bold transition-colors duration-200 hover:scale-110 transform"
                  onClick={handleCloseSpecialtyModal}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold text-center text-white">
                  {isSpecialtyEditMode ? "✏️ تعديل الكشف" : "➕ إضافة كشف جديد"}
                </h2>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-white text-gray-800 overflow-y-auto max-h-[calc(90vh-120px)]">
                {specialtySubmitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 text-sm font-medium">{specialtySubmitError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSpecialtySubmit} className="space-y-6">
                  {specialtyItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 relative bg-white">
                      {specialtyItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleSpecialtyRemoveItem(index)}
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
                            onChange={(e) => handleSpecialtyItemChange(index, 'specialtieId', e.target.value)}
                            className={`w-full border-2 ${specialtyErrors[index]?.specialtieId ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white`}
                          >
                            <option value="">اختر تخصصًا</option>
                            {specialties.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          {specialtyErrors[index]?.specialtieId && (
                            <p className="text-red-500 text-sm flex items-center space-x-1 rtl:space-x-reverse">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span>{specialtyErrors[index]?.specialtieId}</span>
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
                              onChange={(e) => handleSpecialtyItemChange(index, 'quantity', e.target.value)} 
                              min={1}
                              className={`w-full border-2 ${specialtyErrors[index]?.quantity ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white`}
                            />
                            {specialtyErrors[index]?.quantity && (
                              <p className="text-red-500 text-sm flex items-center space-x-1 rtl:space-x-reverse">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{specialtyErrors[index]?.quantity}</span>
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
                              onChange={(e) => handleSpecialtyItemChange(index, 'price', e.target.value)} 
                              min={0} 
                              step={0.1}
                              className={`w-full border-2 ${specialtyErrors[index]?.price ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white`}
                            />
                            {specialtyErrors[index]?.price && (
                              <p className="text-red-500 text-sm flex items-center space-x-1 rtl:space-x-reverse">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{specialtyErrors[index]?.price}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {!isSpecialtyEditMode && (
                    <button
                      type="button"
                      onClick={handleSpecialtyAddItem}
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
                      onClick={handleCloseSpecialtyModal}
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
    </div>
  );
}
