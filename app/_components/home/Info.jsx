"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Clock, MapPin, DollarSign, Phone, Calendar, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function Info() {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const infoCards = [
    {
      id: 1,
      title: "سعر الكشف",
      description: "300 جنيه - كشف شامل مع تقييم كامل لحالة أسنانك والاستشارة الطبية المتخصصة قبل وضع خطة العلاج المناسبة",
      icon: <DollarSign className="w-12 h-12 text-white" />,
      color: "from-emerald-500 to-teal-600",
      price: "300 ج.م",
      features: ["فحص شامل", "استشارة مجانية", "خطة علاج مخصصة"]
    },
    {
      id: 2,
      title: "موقع العيادة",
      description: "24 القاهره مصر     - موقع مميز وسهل الوصول مع إرشادات مفصلة للطريق عبر الهاتف أو الواتساب",
      icon: <MapPin className="w-12 h-12 text-white" />,
      color: "from-blue-500 to-indigo-600",
      address: "    القاهره مصر",
      features: ["موقع مميز", "سهولة الوصول", "إرشادات مفصلة"]
    },
    {
      id: 3,
      title: "مواعيد العمل",
      description: "متاحون 6 أيام في الأسبوع (ماعدا الجمعة) من 3 عصراً حتى 10 مساءً لضمان راحتك ومرونة المواعيد",
      icon: <Clock className="w-12 h-12 text-white" />,
      color: "from-emerald-300 to-teal-200",
      schedule: "3 عصراً - 10 مساءً",
      features: ["6 أيام أسبوعياً", "مرونة في المواعيد", "راحة أكبر"]
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
              معلومات مهمة
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            كل ما تحتاج معرفته
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            معلومات شاملة حول أسعار الكشف، موقع العيادة، ومواعيد العمل
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {infoCards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => (itemRefs.current[index] = el)}
              data-index={index}
              className="relative pt-12"
            >
              {/* Floating Icon */}
              <div className={`absolute -top-8 left-1/2 transform  ml-10 -translate-x-1/2 z-10 transition-all duration-1000 ${
                visibleItems.has(index.toString()) 
                  ? 'animate-bounce opacity-100 scale-100' 
                  : 'translate-y-8 opacity-0 scale-75'
              }`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                  {card.icon}
                </div>
              </div>

              {/* Card */}
              <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 pt-12 text-center min-h-[400px] shadow-xl border border-white/20 transition-all duration-1000 hover:shadow-2xl group ${
                visibleItems.has(index.toString()) 
                  ? 'transform translate-y-0 opacity-100' 
                  : 'transform translate-y-8 opacity-0'
              }`}>
                
                {/* Content */}
                <div className="flex flex-col h-full">
                  <h3 className={`text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300 ${
                    visibleItems.has(index.toString()) 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform translate-y-4 opacity-0'
                  }`}>
                    {card.title}
                  </h3>

                  {/* Special info display */}
                  {card.price && (
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text mb-4">
                      {card.price}
                    </div>
                  )}
                  
                  {card.address && (
                    <div className="text-lg font-semibold text-blue-600 mb-4 flex items-center justify-center space-x-2 space-x-reverse">
                      <Navigation className="w-5 h-5" />
                      <span>{card.address}</span>
                    </div>
                  )}
                  
                  {card.schedule && (
                    <div className="text-lg font-semibold text-purple-600 mb-4 flex items-center justify-center space-x-2 space-x-reverse">
                      <Calendar className="w-5 h-5" />
                      <span>{card.schedule}</span>
                    </div>
                  )}
                  
                  <p className={`text-gray-600 leading-relaxed mb-6 flex-1 transition-all duration-1000 delay-300 ${
                    visibleItems.has(index.toString()) 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform translate-y-4 opacity-0'
                  }`}>
                    {card.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {card.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center justify-center space-x-2 space-x-reverse">
                        {/* <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full"></div> */}
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button className={`w-full bg-gradient-to-r ${card.color} text-white py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg group-hover:shadow-xl flex items-center justify-center space-x-2 space-x-reverse ${
                    visibleItems.has(index.toString()) 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform translate-y-4 opacity-0'
                  }`}>
                    {card.id === 1 && <><DollarSign className="w-5 h-5" /><span>احجز كشف</span></>}
                    {card.id === 2 && <><MapPin className="w-5 h-5" /><span>اعرف الطريق</span></>}
                    {card.id === 3 && <><Phone className="w-5 h-5" /><Link href="/bokink">احجز موعد</Link></>}
                  </button>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0px) translateX(-50%);
          }
          50% {
            transform: translateY(-10px) translateX(-50%);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}