"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";

export default function DentalCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // دالة للانتقال إلى صفحة الحجز
  const handleBookingClick = () => {
    router.push('/bokink');
  };

  // دالة للانتقال إلى الفوتر
  const handleContactClick = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://itch-clinc.runasp.net/api/CaseStudy/GetAll");
        
        if (!response.ok) {
          throw new Error('فشل في تحميل الحالات');
        }
        
        const data = await response.json();
        setCases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 min-h-screen">
        <div className="w-full max-w-6xl mx-auto py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الحالات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 min-h-screen">
        <div className="w-full max-w-6xl mx-auto py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      <div className="w-full max-w-6xl mx-auto py-12 px-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            حالات نجاح من عيادتنا
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            استكشف مجموعة من الحالات الناجحة التي تم علاجها في عيادتنا بأحدث التقنيات والأساليب المتطورة
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{cases.length}+</div>
            <div className="text-gray-600">حالة ناجحة</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">رضا المرضى</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
            <div className="text-gray-600">سنوات خبرة</div>
          </div>
        </div>

        {/* Swiper للحالات */}
        {cases.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            spaceBetween={30}
            slidesPerView={1}
            dir="rtl"
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 25 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="dental-cases-swiper"
          >
            {cases.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* صورة الحالة */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`https://itch-clinc.runasp.net/${item.beforImageUrl}`}
                      alt={`حالة ${item.title || 'طبية'}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxMDAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                      }}
                    />
                    {/* شارة "قبل" */}
                    <div className="absolute    top-14 right-0 bg-[#eeeeee7d] text-black px-2 py-0 rounded-sm text-sm font-medium">
                      قبل العلاج
                    </div>
                  </div>

                  {/* محتوى البطاقة */}
                  <div className="p-6">
                 
                   

                  <div className="w-full bg-[#F7F7F7] rounded-xl my-4 flex flex-col items-start pb-3">
                <div className="flex  items-center justify-center p-1 pr-3" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "2rem", height: "2rem", margin: "1px" }}
                    width="20"
                    height="20"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <path
                      d="M38.0645 14.1938C37.2245 14.1938 36.5148 14.7351 36.2477 15.4841H34.7742C34.2677 11.1325 30.5639 7.74219 26.0781 7.74219C24.9587 7.74219 23.8639 7.95316 22.8245 8.36864L22.2484 8.59896C20.8103 9.17445 19.1871 9.1738 17.7503 8.59896L17.1729 8.36799C16.1355 7.95316 15.0406 7.74219 13.9213 7.74219C9.43548 7.74219 5.73226 11.1325 5.22581 15.4841H3.75226C3.48516 14.7351 2.77548 14.1938 1.93548 14.1938C0.868387 14.1938 0 15.0622 0 16.1293C0 17.1964 0.868387 18.0648 1.93548 18.0648C2.77548 18.0648 3.48516 17.5235 3.75226 16.7744H5.17097C5.21935 18.6661 5.76645 20.508 6.77161 22.1164L8.18129 24.3706C10.4258 27.9641 11.6129 32.1028 11.6129 36.339V36.7745C11.6129 38.5532 13.06 40.0003 14.8387 40.0003C16.6174 40.0003 18.0645 38.5532 18.0645 36.7745V31.6132C18.0645 30.5461 18.9329 29.6777 20 29.6777C21.0671 29.6777 21.9355 30.5461 21.9355 31.6132V36.7745C21.9355 38.5532 23.3826 40.0003 25.1613 40.0003C26.94 40.0003 28.3871 38.5532 28.3871 36.7745V36.339C28.3871 32.1028 29.5742 27.9648 31.8187 24.3712L33.2284 22.1164C34.2335 20.508 34.7806 18.6661 34.829 16.7744H36.2477C36.5148 17.5235 37.2245 18.0648 38.0645 18.0648C39.1316 18.0648 40 17.1964 40 16.1293C40 15.0622 39.1316 14.1938 38.0645 14.1938ZM13.9213 9.03251C14.8755 9.03251 15.8097 9.21187 16.6948 9.5667L17.2723 9.79767C19.0161 10.4944 20.9839 10.4951 22.729 9.79767L23.3052 9.5667C24.191 9.21251 25.1245 9.03251 26.0794 9.03251C29.8516 9.03251 32.9723 11.8467 33.4716 15.4841H6.52903C7.02839 11.8467 10.149 9.03251 13.9213 9.03251ZM1.93548 16.7744C1.57935 16.7744 1.29032 16.4848 1.29032 16.1293C1.29032 15.7738 1.57935 15.4841 1.93548 15.4841C2.29161 15.4841 2.58065 15.7738 2.58065 16.1293C2.58065 16.4848 2.29161 16.7744 1.93548 16.7744ZM8.11419 21.8306L9.03226 20.9132C9.37742 20.568 9.97742 20.568 10.3226 20.9132L11.3458 21.9357C11.7626 22.3519 12.3155 22.5809 12.9032 22.5809H13.2813C13.7839 22.5809 14.1935 22.9899 14.1935 23.4932V24.6841C14.1935 25.0777 13.9426 25.4254 13.5703 25.5499L13.4387 25.5938C12.7839 25.8112 12.2632 26.3325 12.0445 26.9874L11.8929 27.4448C11.811 27.6899 11.6239 27.8841 11.389 27.9874C10.831 26.4951 10.1284 25.0525 9.27548 23.6874L8.11419 21.8306ZM27.7839 30.7086C27.7581 30.6525 27.7419 30.5919 27.7419 30.5261V29.7041C27.7419 29.0441 27.3755 28.4506 26.7845 28.1551L26.6961 28.1112C26.5458 28.0357 26.4516 27.8841 26.4516 27.7157V27.539C26.4516 27.2951 26.6497 27.097 26.8935 27.097C27.6897 27.097 28.3813 26.5577 28.5742 25.7848L28.8065 24.8506C28.8568 24.6538 29.0323 24.5164 29.2355 24.5164H29.5006C29.5484 24.5164 29.5955 24.5241 29.6406 24.539L30.1374 24.7048C29.08 26.5983 28.2916 28.6164 27.7839 30.7086ZM32.1348 21.4325L30.8013 23.5661L30.0484 23.3151C29.8716 23.2557 29.6877 23.2261 29.5013 23.2261H29.2361C28.44 23.2261 27.7484 23.7654 27.5555 24.5383L27.3232 25.4725C27.2723 25.6693 27.0968 25.8067 26.8935 25.8067C25.9381 25.8067 25.1613 26.5835 25.1613 27.539V27.7157C25.1613 28.3757 25.5277 28.9693 26.1187 29.2648L26.2071 29.3086C26.3574 29.3841 26.4516 29.5357 26.4516 29.7041V30.5261C26.4516 31.2267 26.8723 31.8286 27.4897 32.1009C27.2387 33.4938 27.0968 34.9099 27.0968 36.339V36.7745C27.0968 37.8415 26.2284 38.7099 25.1613 38.7099C24.0942 38.7099 23.2258 37.8415 23.2258 36.7745V31.6132C23.2258 29.8344 21.7787 28.3874 20 28.3874C18.2213 28.3874 16.7742 29.8344 16.7742 31.6132V36.7745C16.7742 37.8415 15.9058 38.7099 14.8387 38.7099C13.7716 38.7099 12.9032 37.8415 12.9032 36.7745V36.339C12.9032 33.9054 12.52 31.5061 11.8006 29.2093C12.4168 28.9764 12.9071 28.4796 13.1168 27.8525L13.2684 27.3951C13.3594 27.1241 13.5748 26.9086 13.8458 26.8177L13.9781 26.7738C14.8794 26.4732 15.4839 25.6332 15.4839 24.6841V23.4932C15.4839 22.279 14.4961 21.2906 13.2813 21.2906H12.9032C12.6594 21.2906 12.431 21.1957 12.2581 21.0235L11.2348 20.0003C10.4019 19.1686 8.9529 19.168 8.12 20.0003L7.44516 20.6751C6.83677 19.4635 6.50064 18.1351 6.46064 16.7744H33.5381C33.4903 18.4241 33.011 20.0293 32.1348 21.4325ZM38.0645 16.7744C37.7084 16.7744 37.4194 16.4848 37.4194 16.1293C37.4194 15.7738 37.7084 15.4841 38.0645 15.4841C38.4206 15.4841 38.7097 15.7738 38.7097 16.1293C38.7097 16.4848 38.4206 16.7744 38.0645 16.7744Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M18.0625 22.0638L19.4677 23.0006C19.489 23.0141 19.5064 23.0341 19.518 23.058L20.1786 24.3793C20.6186 25.2599 21.5031 25.8064 22.487 25.8064H23.7186C24.5148 25.8064 25.1619 25.1593 25.1619 24.3638C25.1619 23.8135 24.8561 23.3193 24.3644 23.0735L24.2064 22.9941C23.9993 22.8909 23.8715 22.6838 23.8715 22.4535C23.8715 22.2922 23.9348 22.1399 24.0483 22.0257L24.5722 21.5019C24.9528 21.1219 25.1619 20.6161 25.1619 20.078C25.1619 18.9677 24.2586 18.0645 23.1483 18.0645H22.0922C21.4122 18.0645 20.7477 18.3399 20.2677 18.8206L19.7786 19.3096C19.7496 19.338 19.7109 19.3548 19.6702 19.3548H18.8625C18.067 19.3548 17.4199 20.0019 17.4199 20.7974V20.8638C17.4199 21.3464 17.6599 21.7954 18.0625 22.0638ZM18.7102 20.7974C18.7102 20.7135 18.7786 20.6451 18.8625 20.6451H19.6702C20.0548 20.6451 20.4161 20.4954 20.6902 20.2225L21.1799 19.7328C21.4199 19.4922 21.7528 19.3548 22.0922 19.3548H23.1483C23.547 19.3548 23.8715 19.6793 23.8715 20.078C23.8715 20.2716 23.7967 20.4528 23.6599 20.5896L23.1361 21.1135C22.7786 21.4709 22.5812 21.947 22.5812 22.4535C22.5812 23.1761 22.9825 23.8251 23.629 24.1483L23.787 24.2277C23.8393 24.2535 23.8715 24.3057 23.8715 24.3638C23.8715 24.4477 23.8031 24.5161 23.7193 24.5161H22.4877C21.9954 24.5161 21.5535 24.2432 21.3335 23.8032L20.6735 22.4832C20.5612 22.2574 20.3909 22.0651 20.1825 21.927L18.7793 20.9915C18.7361 20.9619 18.7102 20.9141 18.7102 20.8632V20.7974Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M19.3548 3.87097H20.6451V2.58065H21.9354V1.29032H20.6451V0H19.3548V1.29032H18.0645V2.58065H19.3548V3.87097Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M3.22524 10.3225C3.58155 10.3225 3.8704 10.0337 3.8704 9.67739C3.8704 9.32108 3.58155 9.03223 3.22524 9.03223C2.86893 9.03223 2.58008 9.32108 2.58008 9.67739C2.58008 10.0337 2.86893 10.3225 3.22524 10.3225Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M13.5475 5.16142C13.9038 5.16142 14.1927 4.87257 14.1927 4.51626C14.1927 4.15994 13.9038 3.87109 13.5475 3.87109C13.1912 3.87109 12.9023 4.15994 12.9023 4.51626C12.9023 4.87257 13.1912 5.16142 13.5475 5.16142Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M27.7428 3.87089C28.0991 3.87089 28.388 3.58204 28.388 3.22573C28.388 2.86941 28.0991 2.58057 27.7428 2.58057C27.3865 2.58057 27.0977 2.86941 27.0977 3.22573C27.0977 3.58204 27.3865 3.87089 27.7428 3.87089Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M20.0006 14.1936C20.3569 14.1936 20.6458 13.9048 20.6458 13.5485C20.6458 13.1922 20.3569 12.9033 20.0006 12.9033C19.6443 12.9033 19.3555 13.1922 19.3555 13.5485C19.3555 13.9048 19.6443 14.1936 20.0006 14.1936Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M3.87109 1.29053H5.16142V3.87117H3.87109V1.29053Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M5.16211 3.87109H7.74275V5.16142H5.16211V3.87109Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M1.29102 3.87109H3.87166V5.16142H1.29102V3.87109Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M3.87109 5.16113H5.16142V7.74178H3.87109V5.16113Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M34.8379 1.29053H36.1282V3.87117H34.8379V1.29053Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M36.1289 3.87109H38.7096V5.16142H36.1289V3.87109Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M32.2578 3.87109H34.8385V5.16142H32.2578V3.87109Z"
                      fill="#414451"
                    ></path>
                    <path
                      d="M34.8379 5.16113H36.1282V7.74178H34.8379V5.16113Z"
                      fill="#414451"
                    ></path>
                  </svg>
                  <span className="text-gray-400 pr-2 font-bold">
                    الحالة الصحية :
                  </span>
                  <span className="text-[#222] font-bold">{item.title}</span>
                </div>

                {/* الوصف */}
              </div>    
                  

                    {/* زر المشاهدة */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">لا توجد حالات متاحة حالياً</div>
          </div>
        )}

        {/* أزرار التنقل المخصصة */}
        <div className="flex justify-center mt-8 space-x-4 space-x-reverse">
          <button className="swiper-button-prev-custom w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="swiper-button-next-custom w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* قسم الاتصال */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            هل تحتاج لاستشارة طبية؟
          </h2>
          <p className="text-gray-600 mb-6">
            احجز موعدك الآن واحصل على أفضل رعاية لأسنانك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBookingClick}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              احجز موعد
            </button>
            <button 
              onClick={handleContactClick}
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              اتصل بنا
            </button>
          </div>
        </div>
      </div>

      {/* الأنماط المخصصة */}
      <style jsx>{`
        .dental-cases-swiper .swiper-pagination-bullet {
          background-color: #3b82f6;
        }
        .dental-cases-swiper .swiper-pagination-bullet-active {
          background-color: #1d4ed8;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}