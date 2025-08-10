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

        {/* زر الطباعة */}
<div className="mt-6 text-center print:hidden">
  <button
    onClick={() => {
      window.print(); // بس طباعة من غير أي API
    }}
    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
  >
    <span>🖨️</span>
    طباعة الإيصال 
  </button>
</div>

       
      </div>

      {/* خط منقط للقطع */}
      <div className="print:block hidden border-t-2 border-dashed border-gray-400 mx-4"></div>
    </div>
  );
}