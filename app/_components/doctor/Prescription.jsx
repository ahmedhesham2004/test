"use client";
import { useEffect, useState } from "react";

export default function Prescription() {
  const [id, setId] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // جلب ID من URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParts = window.location.pathname.split("/");
      const foundId = urlParts[urlParts.length - 1];
      if (!isNaN(foundId)) {
        setId(Number(foundId));
      } else {
        setError("رقم الروشتة غير صالح");
        setLoading(false);
      }
    }
  }, []);

  // جلب بيانات الروشتة من API
  useEffect(() => {
    if (!id) return;

    const fetchPrescription = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("User"))?.tokens;
        if (!token) throw new Error("التوكن غير موجود");

        const res = await fetch(
          `https://itch-clinc.runasp.net/api/Prescription/Get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || "فشل في جلب بيانات الروشتة");
        }

        const data = await res.json();
        setPrescription(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  const handlePrint = () => {
    // إنشاء نافذة جديدة للطباعة
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) return;

    // تحضير محتوى الطباعة
    const printHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>روشتة طبية - ${prescription?.patientName || 'مريض'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            background: white;
            color: #333;
            line-height: 1.4;
            font-size: 12px;
          }
          
          .prescription-container {
            max-width: 100%;
            background: white;
            border: 2px solid #2563eb;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 15px 20px;
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 20px;
          }
          
          .clinic-info {
            text-align: right;
          }
          
          .clinic-info h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          
          .clinic-info p {
            font-size: 11px;
            opacity: 0.9;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2563eb;
            font-weight: bold;
            font-size: 14px;
          }
          
          .prescription-title {
            text-align: left;
          }
          
          .prescription-title h2 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          
          .prescription-title p {
            font-size: 11px;
            opacity: 0.9;
          }
          
          .patient-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            padding: 15px 20px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .info-item {
            text-align: center;
          }
          
          .info-item .label {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 3px;
            font-weight: 500;
          }
          
          .info-item .value {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .diagnosis-section, .notes-section {
            padding: 15px 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 8px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 3px;
            display: inline-block;
          }
          
          .diagnosis-content, .notes-content {
            background: #f1f5f9;
            padding: 10px;
            border-radius: 6px;
            border-right: 4px solid #2563eb;
            font-size: 11px;
            line-height: 1.5;
          }
          
          .medications-section {
            padding: 15px 20px;
          }
          
          .medication-item {
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            margin-bottom: 8px;
            background: #fdfdfd;
          }
          
          .medication-item:last-child {
            margin-bottom: 0;
          }
          
          .medication-main-line {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 15px;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .medication-type {
            font-size: 10px;
            color: #64748b;
            font-weight: 500;
            text-align: center;
            background: #f1f5f9;
            padding: 4px 8px;
            border-radius: 4px;
          }
          
          .medication-name {
            font-size: 13px;
            font-weight: bold;
            color: #1e293b;
            text-align: center;
          }
          
          .medication-dosage {
            background: #2563eb;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-align: center;
          }
          
          .medication-instructions {
            font-size: 10px;
            color: #475569;
            background: #f8fafc;
            padding: 5px 8px;
            border-radius: 4px;
            border-right: 2px solid #0ea5e9;
            text-align: right;
          }
          
          .no-medications {
            text-align: center;
            color: #64748b;
            background: #f8fafc;
            padding: 20px;
            border-radius: 6px;
            font-size: 11px;
          }
          
          .footer {
            padding: 15px 20px;
            border-top: 1px solid #e2e8f0;
            background: #f8fafc;
          }
          
          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 15px;
          }
          
          .signature-item {
            text-align: center;
          }
          
          .signature-item .label {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 8px;
          }
          
          .signature-line {
            height: 40px;
            border-bottom: 2px dashed #94a3b8;
            margin-bottom: 5px;
          }
          
          .signature-item .name {
            font-size: 11px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .stamp-area {
            width: 50px;
            height: 50px;
            border: 2px dashed #94a3b8;
            border-radius: 50%;
            margin: 0 auto 5px;
          }
          
          .validity-note {
            text-align: center;
            font-size: 9px;
            color: #64748b;
            background: #fffbeb;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #fbbf24;
          }
          
          .medications-grid {
            display: grid;
            gap: 8px;
          }
        </style>
      </head>
      <body>
        <div class="prescription-container">
          <!-- Header -->
          <div class="header">
            <div class="clinic-info">
              <h1>عيادة الدكتور ...</h1>
              <p>متخصصون في الرعاية الصحية الشاملة</p>
              <p>📍 العنوان | 📞 رقم الهاتف</p>
            </div>
            <div class="logo">
              شعار
            </div>
            <div class="prescription-title">
              <h2>روشتة طبية</h2>
              <p>رقم: ${id}</p>
              <p>${new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </div>

          <!-- Patient Info -->
          <div class="patient-info">
            <div class="info-item">
              <div class="label">اسم المريض</div>
              <div class="value">${prescription?.patientName || 'غير محدد'}</div>
            </div>
            <div class="info-item">
              <div class="label">الجنس</div>
              <div class="value">${prescription?.patientSex || 'غير محدد'}</div>
            </div>
            <div class="info-item">
              <div class="label">التاريخ</div>
              <div class="value">${new Date().toLocaleDateString('ar-EG')}</div>
            </div>
          </div>

          <!-- Diagnosis -->
          <div class="diagnosis-section">
            <h3 class="section-title">التشخيص</h3>
            <div class="diagnosis-content">
              ${prescription?.diagnosis || 'غير محدد'}
            </div>
          </div>

          ${prescription?.notes ? `
          <!-- Notes -->
          <div class="notes-section">
            <h3 class="section-title">ملاحظات طبية</h3>
            <div class="notes-content">
              ${prescription.notes}
            </div>
          </div>
          ` : ''}

          <!-- Medications -->
          <div class="medications-section">
            <h3 class="section-title">العلاج الدوائي</h3>
            
            ${prescription?.items?.length > 0 ? `
              <div class="medications-grid">
                ${prescription.items.map((item, index) => `
                  <div class="medication-item">
                    <div class="medication-main-line">
                      <div class="medication-type">${item.type || 'غير محدد'}</div>
                      <div class="medication-name">${item.name || 'بدون اسم'}</div>
                      <div class="medication-dosage">${item.dosageOrDetails || 'غير محدد'}</div>
                    </div>
                    ${item.instructions ? `
                      <div class="medication-instructions">
                        <strong>تعليمات:</strong> ${item.instructions}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="no-medications">
                لا توجد أدوية مذكورة في هذه الوصفة
              </div>
            `}
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="signature-section">
              <div class="signature-item">
                <div class="label">توقيع الطبيب</div>
                <div class="signature-line"></div>
                <div class="name">د. ${prescription?.doctorName || 'اسم الطبيب'}</div>
              </div>
              <div class="signature-item">
                <div class="label">ختم العيادة</div>
                <div class="stamp-area"></div>
                <div class="name">الختم الرسمي</div>
              </div>
            </div>
            <div class="validity-note">
              ⚠️ هذه الوصفة صالحة لمدة 14 يوم من تاريخ إصدارها
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // كتابة المحتوى في النافذة الجديدة
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // انتظار تحميل المحتوى ثم الطباعة
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="text-gray-700 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 print:p-0">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm print:shadow-none print:max-w-full print:rounded-none border border-gray-200 print:border-0">
        {/* زر الطباعة */}
        <div className="p-4 border-b border-gray-200 print:hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">روشتة طبية رقم #{id}</h3>
              <p className="text-sm text-gray-600">مريض: {prescription?.patientName}</p>
            </div>
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              🖨️ طباعة الروشتة
            </button>
          </div>
        </div>

        {/* رأس الروشتة */}
        <div className="p-6 justify-between  flex text-center border-b border-gray-200">
          <div className="mb-4 text-right">
            
            <h1 className="text-2xl font-bold text-gray-800">عيادة .... </h1>
            <p className="text-gray-600 text-sm">متخصصون في الرعاية الصحية الشاملة</p>
          </div>
          <div className="logo">
              <img src="sasa" alt="logo" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">روشتة طبية</h2>
          <p className="text-gray-500 text-sm">رقم: {id}</p>
          </div>
        </div>

        {/* معلومات المريض */}
        <div className="p-6 flex justify-between gap-4 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-1">اسم المريض</p>
            <p className="font-medium text-gray-800">{prescription?.patientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">تاريخ اليوم</p>
            <p className="font-medium text-gray-800">{new Date().toLocaleDateString('ar-EG')}</p>
          </div>
          {/* <div>
            <p className="text-sm text-gray-500 mb-1">العمر</p>
            <p className="font-medium text-gray-800">..................</p>
          </div> */}
          <div>
            <p className="text-sm text-gray-500 mb-1">الجنس</p>
            <p className="font-medium text-gray-800">{prescription?.patientSex}</p>
          </div>
        </div>

        {/* التشخيص */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">التشخيص</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-800">{prescription?.diagnosis || "غير محدد"}</p>
          </div>
        </div>

        {/* الملاحظات */}
        {prescription?.notes && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">ملاحظات طبية</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-800">{prescription.notes}</p>
            </div>
          </div>
        )}

        {/* الأدوية */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">العلاج الدوائي</h3>
          
          {prescription?.items?.length > 0 ? (
            <div className="space-y-3">
              {prescription.items.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800">{item.name || "بدون اسم"}</h4>
                      <p className="text-sm text-gray-600">{item.type || "غير محدد"}</p>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-800">
                      {item.dosageOrDetails || "غير محدد"}
                    </div>
                  </div>
                  {item.instructions && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600"><span className="font-medium">تعليمات:</span> {item.instructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
              لا توجد أدوية مذكورة
            </div>
          )}
        </div>

        {/* التذييل */}
        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">توقيع الطبيب</p>
              <div className="h-16 border-t border-dashed border-gray-400 mx-auto"></div>
              <p className="text-gray-600 mt-2">د. {prescription?.doctorName || "اسم الطبيب"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">ختم العيادة</p>
              <div className="h-16 w-16 border border-dashed border-gray-400 rounded-full mx-auto flex items-center justify-center text-gray-400">
                 
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-8">
            هذه الوصفة صالحة لمدة 14 يوم من تاريخها
          </p>
        </div>
      </div>
    </div>
  );
}