"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddSpecialtyForm() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      const res = await fetch("https://itch-clinc.runasp.net/api/specialtie/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSpecialties(data);
      setFilteredSpecialties(data);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = specialties.filter(specialty =>
      specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpecialties(results);
  }, [searchTerm, specialties]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    if (editingId) {
      formData.append("Id", editingId);
      formData.append("Name", data.name || currentSpecialty.name);
      formData.append("Description", data.description || currentSpecialty.description);
      formData.append("Price", data.price || currentSpecialty.price);
      formData.append("Duration", data.duration || currentSpecialty.duration);
      
      if (data.image && data.image.length > 0) {
        formData.append("ImageUrl", data.image[0]);
      } else {
        formData.append("ImageUrl", currentSpecialty.imageUrl);
      }
    } else {
      formData.append("Name", data.name);
      formData.append("Description", data.description);
      formData.append("Price", data.price);
      formData.append("Duration", data.duration);
      if (data.image && data.image.length > 0) {
        formData.append("ImageUrl", data.image[0]);
      }
    }

    try {
  const token = JSON.parse(localStorage.getItem("User"))?.tokens;
  const url = editingId
    ? `https://itch-clinc.runasp.net/api/specialtie/Update/${editingId}`
    : "https://itch-clinc.runasp.net/api/specialtie/Add";
  const method = editingId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();

    // ✅ اطبع كامل الريسبونس في الكونسول
    console.log("Response Error:", errorData);

    let errorMessage = "حدث خطأ أثناء حفظ البيانات";
    
    if (errorData && errorData.errors) {
      errorMessage = Object.values(errorData?.errors?.[0]?.description);
    } else if (errorData && errorData.description) {
      errorMessage = errorData.description;
    }
    
    setError(errorMessage);
    return;
  }

  alert(editingId ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
  reset();
  setEditingId(null);
  setShowModal(false);
  setCurrentSpecialty(null);
  setError(null);
  fetchData();
} catch (error) {
  console.error("Fetch Error:", error); // ✅ اطبع الخطأ العام لو حصلت مشكلة في الاتصال
  setError("حدث خطأ أثناء الاتصال بالخادم");
}

  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا التخصص؟")) return;
    
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      const res = await fetch(`https://itch-clinc.runasp.net/api/specialtie/Delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        let errorMessage = "حدث خطأ أثناء حذف التخصص";
        
        if (errorData && errorData.title) {
          errorMessage = `${errorMessage}: ${errorData.title}`;
        }
        
        setError(errorMessage);
        return;
      }

      alert("تم الحذف بنجاح");
      setError(null);
      fetchData();
    } catch (error) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  const handleEdit = (specialty) => {
    setEditingId(specialty.id);
    setCurrentSpecialty(specialty);
    setValue("name", specialty.name);
    setValue("description", specialty.description);
    setValue("price", specialty.price);
    setValue("duration", specialty.duration);
    setShowModal(true);
  };

  return (
    <div  className="min-h-screen  bg-gradient-to-br from-sky-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mr-auto">
        {/* فورم الإضافة */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-4 md:p-6">
            <h2 className="text-2xl font-bold text-white">إدارة التخصصات الطبية</h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {error && (
              <div className="md:col-span-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-700">اسم التخصص</label>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="أدخل اسم التخصص"
                className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-700">وصف التخصص</label>
              <input
                type="text"
                {...register("description", { required: true })}
                placeholder="أدخل وصف التخصص"
                className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-700">السعر (ج.م)</label>
              <input
                type="number"
                {...register("price", { required: true })}
                placeholder="أدخل السعر"
                className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-sky-700">المدة (دقيقة)</label>
              <input
                type="number"
                {...register("duration", { required: true })}
                placeholder="أدخل المدة"
                className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-sky-700">صورة التخصص</label>
              <input
                type="file"
                {...register("image")}
                accept="image/*"
                className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition"
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r cursor-pointer from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md"
              >
                {editingId ? "حفظ التعديلات" : "إضافة تخصص جديد"}
              </button>
            </div>
          </form>
        </div>

        {/* عرض التخصصات */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">قائمة التخصصات</h2>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-sky-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="ابحث عن تخصص..."
                className="block text-black w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-sky-400 bg-opacity-20 text-white placeholder-sky-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {filteredSpecialties.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-sky-600">
                {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد تخصصات متاحة حالياً"}
              </h3>
              <p className="mt-1 text-sm text-sky-500">
                {searchTerm ? "حاول تغيير كلمات البحث" : "يمكنك إضافة تخصص جديد باستخدام النموذج أعلاه"}
              </p>
            </div>
          ) : (
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecialties.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-sky-100 rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                >
                  {s.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`https://itch-clinc.runasp.net/${s.imageUrl}`}
                        alt={s.name}
                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-sky-800">{s.name}</h3>
                        <p className="text-sm text-sky-600 mt-2 line-clamp-2">{s.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-sky-500 cursor-pointer hover:text-sky-700 p-1 rounded-full hover:bg-sky-50 transition"
                          title="تعديل"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-500 cursor-pointer hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                          title="حذف"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-sky-100 flex justify-between items-center">
                      <div className="text-sm bg-sky-50 px-3 py-1 rounded-full">
                        <span className="font-medium text-sky-700">السعر: </span>
                        <span className="text-sky-600">{s.price} ج.م</span>
                      </div>
                      <div className="text-sm bg-sky-50 px-3 py-1 rounded-full">
                        <span className="font-medium text-sky-700">المدة: </span>
                        <span className="text-sky-600">{s.duration} دقيقة</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* فورم التعديل داخل نافذة منبثقة */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">تعديل التخصص</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  reset();
                  setEditingId(null);
                  setCurrentSpecialty(null);
                  setError(null);
                }}
                className="text-white hover:text-sky-200 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded-lg">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-sky-700">اسم التخصص</label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="اسم التخصص"
                  className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-sky-700">وصف التخصص</label>
                <input
                  type="text"
                  {...register("description", { required: true })}
                  placeholder="وصف التخصص"
                  className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-sky-700">السعر</label>
                <input
                  type="number"
                  {...register("price", { required: true })}
                  placeholder="السعر"
                  className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-sky-700">المدة (دقيقة)</label>
                <input
                  type="number"
                  {...register("duration", { required: true })}
                  placeholder="المدة"
                  className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-sky-700">صورة جديدة (اختياري)</label>
                <input
                  type="file"
                  {...register("image")}
                  accept="image/*"
                  className="w-full text-black px-4 py-2 border border-sky-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition"
                />
              </div>
              
              {currentSpecialty?.imageUrl && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-sky-700">الصورة الحالية</label>
                  <div className="border border-sky-200 rounded-lg p-2">
                    <img 
                      src={`https://itch-clinc.runasp.net/${currentSpecialty.imageUrl}`}
                      alt="Current"
                      className="w-full h-40 object-contain"
                    />
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md mt-4"
              >
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}