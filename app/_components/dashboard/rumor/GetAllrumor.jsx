"use client";
import React, { useEffect, useState } from "react";

export default function GetAllrumor() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [hoveredDescription, setHoveredDescription] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    id: "",
    patientName: "",
    type: "",
    title: "",
    description: "",
    image: null,
  });

  const fetchRecords = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      const res = await fetch(
        "https://itch-clinc.runasp.net/api/PatientMedicalRecord/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السجل؟")) return;

    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      await fetch(
        `https://itch-clinc.runasp.net/api/PatientMedicalRecord/Delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRecords();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record.id);
    setFormData({
      id: record.id,
      patientName: record.patientName,
      type: record.type,
      title: record.title,
      description: record.description,
      image: null,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      const form = new FormData();
      form.append("Id", formData.id);
      form.append("PatientName", formData.patientName);
      form.append("Type", formData.type);
      form.append("Title", formData.title);
      form.append("Description", formData.description);

      if (formData.image instanceof File) {
        form.append("ImageUrl", formData.image);
      }

      const res = await fetch(
        `https://itch-clinc.runasp.net/api/PatientMedicalRecord/Update/${formData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Update error:", text);
        alert("فشل في التحديث: " + text);
        return;
      }

      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error("Update failed:", error);
      alert("حدث خطأ أثناء التحديث.");
    }
  };

  const handleDescriptionMouseEnter = (description, event) => {
    setHoveredDescription(description);
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + 250,
    });
  };

  const handleDescriptionMouseLeave = () => {
    setHoveredDescription(null);
  };

  const filteredRecords = records.filter((r) =>
    r.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-7xl ml-10 mr-auto min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            <span className="text-blue-600">سجلات</span> الأشعة والتحاليل الطبية
          </h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ابحث باسم المريض..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-auto" style={{ maxHeight: "600px" }}>
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    اسم المريض
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    الوصف
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    الصورة
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-medium">
                      {record.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.type === "أشعة" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                      {record.title}
                    </td>
                    <td 
                      className="px-6 py-4 text-right text-gray-700 max-w-xs relative cursor-pointer"
                      onMouseEnter={(e) => handleDescriptionMouseEnter(record.description, e)}
                      onMouseLeave={handleDescriptionMouseLeave}
                    >
                      <p className="truncate">{record.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <img
                        src={`https://itch-clinc.runasp.net/${record.imageUrl}`}
                        alt="صورة"
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="تعديل"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="حذف"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tooltip for Description */}
        {hoveredDescription && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateX(-50%) translateY(-100%)',
            }}
          >
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm text-sm leading-relaxed">
              <div className="relative">
                <div className="whitespace-pre-wrap break-words text-right">
                  {hoveredDescription}
                </div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        )}

        {/* مودال التعديل */}
        {editingRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    تعديل السجل الطبي
                  </h3>
                  <button
                    onClick={() => setEditingRecord(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المريض
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleFormChange}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع السجل
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر النوع</option>
                      <option value="أشعة">أشعة</option>
                      <option value="تحليل">تحليل</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان السجل
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الوصف التفصيلي
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="4"
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      صورة السجل (اختياري)
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="mt-2 text-sm text-gray-600">اضغط لرفع صورة</span>
                        <input 
                          type="file" 
                          name="image" 
                          onChange={handleFormChange} 
                          className="hidden text-black" 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingRecord(null)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    حفظ التغييرات
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