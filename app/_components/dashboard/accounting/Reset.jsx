"use client";
import { useEffect, useState } from "react";

export default function Reset() {
  const [id, setId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParts = window.location.pathname.split("/");
      const foundId = urlParts[urlParts.length - 1];
      if (!isNaN(foundId)) {
        setId(Number(foundId));
      }
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const token = JSON.parse(localStorage.getItem("User"))?.tokens;
      if (!token) {
        console.error("التوكن غير موجود في localStorage");
        return;
      }

      try {
        const res = await fetch(`https://itch-clinc.runasp.net/api/AppointmentSpecialtie/Get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("فشل في جلب البيانات");

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("خطأ أثناء جلب البيانات:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // تحميل أو خطأ
  if (loading) return <p className="text-center mt-10 text-blue-600 font-medium">جاري تحميل البيانات...</p>;
  if (!data) return <p className="text-center mt-10 text-red-600 font-medium">لم يتم العثور على البيانات.</p>;

  // عرض إيصال
  return (
    <div className="max-w-sm mx-auto mt-8 bg-white shadow-lg print:shadow-none print:max-w-none print:mx-0 print:mt-0">
      {/* رأس الإيصال */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
        <div className="mb-3">
         
          <h1 className="text-xl font-bold">عيادتي   </h1>
          
        </div>
        
        {/* معلومات العيادة */}
        <div className="text-xs opacity-90 space-y-1">
          <p>القاهره مصر    </p>
          <p>📞 01234567890 </p>
          <p>📧 info@clinic.com</p>
        </div>
      </div>

      {/* معلومات الإيصال */}
      <div className="p-6">
        <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">إيصال دفع</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>رقم الإيصال: #{data.id}</span>
            <span>التاريخ: {new Date().toLocaleDateString('ar-EG')}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            الوقت: {new Date().toLocaleTimeString('ar-EG')}
          </div>
        </div>

        {/* تفاصيل الخدمات */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">تفاصيل الخدمات:</h3>
          {data.items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 mb-3 border-r-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-800">{item.specialtieName}</span>
                <span className="text-blue-600 font-semibold">{item.price} ج.م</span>
              </div>
              <div className="text-sm text-gray-600">
                <span>الكمية: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ملخص المبالغ */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4">
          <div className="space-y-2 text-sm">
            {/* <div className="flex justify-between">
              <span className="text-gray-600">الإجمالي قبل الخصم:</span>
              <span className="font-medium">{data.totalBeforeDiscount} ج.م</span>
            </div> */}
            
            {data.discountPercentage > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>نسبة الخصم ({data.discountPercentage}%):</span>
                  <span>- {data.discountValue} ج.م</span>
                </div>
              </>
            )}
            
            <div className="border-t border-gray-200 pt-2 mt-3">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <span className="text-lg font-bold text-gray-800">إجمالي المبلغ المستحق:</span>
                <span className="text-xl font-bold text-blue-600">{data.totalAfterDiscount} ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p className="mb-2">شكراً لثقتكم في عيادتنا</p>
          <p>نتمنى لكم دوام الصحة والعافية</p>
          <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-yellow-700 font-medium">⚠️ يرجى الاحتفاظ بهذا الإيصال كإثبات للدفع</p>
          </div>
        </div>

        {/* أزرار الطباعة وتسجيل المعاملة */}
        <div className="mt-6 space-y-3 print:hidden">
          {/* زر الطباعة */}
          <button
            onClick={() => {
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
                  <title>إيصال دفع - ${data.id}</title>
                  <style>
                    * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }
                    
                    @page {
                      size: A4;
                      margin: 20mm;
                    }
                    
                    body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      direction: rtl;
                      background: white;
                      color: #333;
                      line-height: 1.5;
                      font-size: 12px;
                    }
                    
                    .receipt-container {
                      max-width: 100%;
                      background: white;
                      border: 2px solid #2563eb;
                      border-radius: 12px;
                      overflow: hidden;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    
                    .receipt-header {
                      background: linear-gradient(135deg, #2563eb, #1d4ed8);
                      color: white;
                      padding: 20px;
                      text-align: center;
                    }
                    
                    .clinic-name {
                      font-size: 24px;
                      font-weight: bold;
                      margin-bottom: 10px;
                    }
                    
                    .clinic-info {
                      font-size: 11px;
                      opacity: 0.9;
                      line-height: 1.4;
                    }
                    
                    .clinic-info p {
                      margin-bottom: 3px;
                    }
                    
                    .receipt-content {
                      padding: 20px;
                    }
                    
                    .receipt-info {
                      text-align: center;
                      margin-bottom: 20px;
                      padding-bottom: 15px;
                      border-bottom: 2px dashed #e5e7eb;
                    }
                    
                    .receipt-title {
                      font-size: 18px;
                      font-weight: bold;
                      color: #1f2937;
                      margin-bottom: 10px;
                    }
                    
                    .receipt-meta {
                      display: grid;
                      grid-template-columns: 1fr 1fr;
                      gap: 15px;
                      font-size: 11px;
                      color: #6b7280;
                    }
                    
                    .receipt-meta-item {
                      background: #f9fafb;
                      padding: 8px;
                      border-radius: 6px;
                      text-align: center;
                    }
                    
                    .services-section {
                      margin-bottom: 20px;
                    }
                    
                    .section-title {
                      font-size: 14px;
                      font-weight: bold;
                      color: #1f2937;
                      margin-bottom: 12px;
                      border-bottom: 2px solid #2563eb;
                      padding-bottom: 4px;
                      display: inline-block;
                    }
                    
                    .service-item {
                      background: #f8fafc;
                      border-radius: 8px;
                      padding: 12px;
                      margin-bottom: 8px;
                      border-right: 4px solid #2563eb;
                      display: grid;
                      grid-template-columns: 2fr 1fr;
                      gap: 15px;
                      align-items: center;
                    }
                    
                    .service-item:last-child {
                      margin-bottom: 0;
                    }
                    
                    .service-info h4 {
                      font-size: 13px;
                      font-weight: bold;
                      color: #1f2937;
                      margin-bottom: 3px;
                    }
                    
                    .service-info .quantity {
                      font-size: 10px;
                      color: #6b7280;
                    }
                    
                    .service-price {
                      font-size: 14px;
                      font-weight: bold;
                      color: #2563eb;
                      text-align: center;
                      background: white;
                      padding: 6px 12px;
                      border-radius: 6px;
                    }
                    
                    .summary-section {
                      border-top: 2px dashed #e5e7eb;
                      padding-top: 15px;
                      margin-top: 20px;
                    }
                    
                    .summary-row {
                      display: flex;
                      justify-content: space-between;
                      margin-bottom: 8px;
                      font-size: 12px;
                    }
                    
                    .discount-row {
                      color: #059669;
                      font-weight: 600;
                    }
                    
                    .total-section {
                      background: #2563eb;
                      color: white;
                      padding: 15px;
                      border-radius: 8px;
                      margin-top: 12px;
                      text-align: center;
                    }
                    
                    .total-label {
                      font-size: 14px;
                      margin-bottom: 5px;
                    }
                    
                    .total-amount {
                      font-size: 24px;
                      font-weight: bold;
                    }
                    
                    .footer-section {
                      margin-top: 20px;
                      text-align: center;
                      border-top: 1px solid #e5e7eb;
                      padding-top: 15px;
                    }
                    
                    .thank-you {
                      font-size: 11px;
                      color: #6b7280;
                      margin-bottom: 10px;
                    }
                    
                    .warning-note {
                      background: #fffbeb;
                      border: 1px solid #fbbf24;
                      color: #92400e;
                      padding: 10px;
                      border-radius: 6px;
                      font-size: 10px;
                      font-weight: 600;
                    }
                    
                    .print-date {
                      margin-top: 15px;
                      font-size: 9px;
                      color: #9ca3af;
                    }
                  </style>
                </head>
                <body>
                  <div class="receipt-container">
                    <!-- Header -->
                    <div class="receipt-header">
                      <div class="clinic-name">عيادتي</div>
                      <div class="clinic-info">
                        <p>📍 القاهرة، مصر</p>
                        <p>📞 01234567890</p>
                        <p>📧 info@clinic.com</p>
                      </div>
                    </div>

                    <!-- Content -->
                    <div class="receipt-content">
                      <!-- Receipt Info -->
                      <div class="receipt-info">
                        <h2 class="receipt-title">إيصال دفع</h2>
                        <div class="receipt-meta">
                          <div class="receipt-meta-item">
                            <strong>رقم الإيصال:</strong><br>
                            #${data.id}
                          </div>
                          <div class="receipt-meta-item">
                            <strong>التاريخ:</strong><br>
                            ${new Date().toLocaleDateString('ar-EG')}<br>
                            <small>${new Date().toLocaleTimeString('ar-EG')}</small>
                          </div>
                        </div>
                      </div>

                      <!-- Services -->
                      <div class="services-section">
                        <h3 class="section-title">تفاصيل الخدمات</h3>
                        ${data.items.map(item => `
                          <div class="service-item">
                            <div class="service-info">
                              <h4>${item.specialtieName}</h4>
                              <div class="quantity">الكمية: ${item.quantity}</div>
                            </div>
                            <div class="service-price">${item.price} ج.م</div>
                          </div>
                        `).join('')}
                      </div>

                      <!-- Summary -->
                      <div class="summary-section">
                        ${data.discountPercentage > 0 ? `
                          <div class="summary-row discount-row">
                            <span>خصم (${data.discountPercentage}%):</span>
                            <span>- ${data.discountValue} ج.م</span>
                          </div>
                        ` : ''}
                        
                        <div class="total-section">
                          <div class="total-label">إجمالي المبلغ المستحق</div>
                          <div class="total-amount">${data.totalAfterDiscount} ج.م</div>
                        </div>
                      </div>

                      <!-- Footer -->
                      <div class="footer-section">
                        <div class="thank-you">
                          <p>شكراً لثقتكم في عيادتنا</p>
                          <p>نتمنى لكم دوام الصحة والعافية</p>
                        </div>
                        
                        <div class="warning-note">
                          ⚠️ يرجى الاحتفاظ بهذا الإيصال كإثبات للدفع
                        </div>
                        
                        <div class="print-date">
                          تم طباعة هذا الإيصال في: ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}
                        </div>
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
            }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>🖨️</span>
            طباعة الإيصال
          </button>
          
          {/* زر تسجيل المعاملة */}
          <button
            onClick={async () => {
              const token = JSON.parse(localStorage.getItem("User"))?.tokens;
              if (!token) return alert("التوكن غير موجود");

              try {
                const res = await fetch(
                  `https://itch-clinc.runasp.net/api/AccountingTransaction/AddAppointmentToTransactions/${id}`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (!res.ok) {
                  console.error("فشل تسجيل العملية");
                  alert("فشل تسجيل المعاملة في النظام");
                } else {
                  console.log("تم تسجيل العملية بنجاح");
                  alert("تم تسجيل المعاملة بنجاح ✅");
                }
              } catch (err) {
                console.error("حصل خطأ:", err.message);
                alert("حدث خطأ أثناء الاتصال بالسيرفر");
              }
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>💾</span>
            تسجيل المعاملة في النظام
          </button>
        </div>
      </div>

      {/* خط منقط للقطع */}
      <div className="print:block hidden border-t-2 border-dashed border-gray-400 mx-4"></div>
    </div>
  );
}