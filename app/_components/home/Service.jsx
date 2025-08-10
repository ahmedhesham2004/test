import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Users, Calendar, CheckCircle } from 'lucide-react';

const Service = () => {
  const services = [
    {
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      title: "زراعة الأسنان",
      description: "زراعة الأسنان تعتبر من أفضل الحلول الحديثة لتعويض الأسنان المفقودة واستعادة وظيفة الفم بشكل طبيعي، في مركز جرانتي نحرص على...",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      title: "حشو الأسنان الهامشية",
      description: "نعرض الأسنان الهامشية للتسوس أو الكسر قد يصيب بالدهليل الشديد عند الكلام أو عند الابتسام والضحك، والنها قد يخون الحشو...",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      title: "علاج التهاب اللثة سريع المفعول",
      description: "علاج التهاب اللثة سريع المفعول يساعد في التخلص من الالتهابات والألم بشكل فعال وآمن باستخدام أحدث التقنيات الطبية المتطورة.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      title: "فينير الأسنان",
      description: "فينير الأسنان يوفر حلولاً تجميلية متقدمة للحصول على ابتسامة مثالية وأسنان بيضاء ناصعة بأحدث التقنيات العالمية.",
      color: "from-orange-400 to-red-500"
    }
  ];

  return (
    <div className='bg-gradient-to-br w-full relative from-slate-50 via-white to-gray-100 min-h-screen'>
      {/* حل مشكلة الخلفية الزائدة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* حل مشكلة المساحة الزائدة */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Modern Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block mb-4 md:mb-6">
            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
              خدمات متميزة
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-6 leading-tight">
            خدمات <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> عيادتي</span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-600 mb-6">
            لطب الأسنان المتقدم
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            فلسفتنا في عيادتي  لطب الأسنان قائمة على تقديم أعلى مستوى من الرعاية الطبية مممثلة في خدمات يشرف عليها فريق طبي مميز، نستخدم أحدث تكنولوجيا في
            مجال طب وجراحة الأسنان، مع مدى الحياة على خدمات زراعة الأسنان - التركيبات الثابتة والمتحركة.
          </p>
        </div>

        {/* حل مشكلة المحاذاة */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {services.map((service, index) => (
              <div key={index} className="transform transition-all duration-500 hover:scale-105">
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-xl transition-all duration-500 group">
                  <div className="flex items-start space-x-6 space-x-reverse">
                    <div className={`w-16 ml-2 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base font-light">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* حل مشكلة المسافة */}
        <div className="text-center mt-16 md:mt-24">
          <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 md:px-16 md:py-5 rounded-full text-lg md:text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 overflow-hidden">
            <Link href='/bokink' className="relative z-10">احجز استشارتك  الآن</Link>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default Service;