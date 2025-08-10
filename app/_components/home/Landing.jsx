"use client"
import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

const Landing = () => {
  const [currentSlide, setCurrentSlide] = useState(0);


  const slides = [
    {
      title: "عيادة الأسنان المتخصصة",
      subtitle: "احجز موعدك الآن",
      description: "نقدم أفضل خدمات طب الأسنان بأحدث التقنيات والأجهزة الطبية المتطورة. فريقنا من الأطباء المتخصصين يضمن لك أفضل رعاية طبية لأسنانك وصحة فمك.",
      image: "/download.jpeg",
      bgGradient: "from-cyan-400 via-blue-400 to-blue-500"
    },

    {
      title: "رعاية شاملة للأسنان",
      subtitle: "علاج احترافي متقدم",
      description: "خدمات أسنان شاملة تشمل العلاج التحفظي، والتجميلي، والجراحي. نستخدم أحدث الأجهزة والتقنيات لضمان أفضل النتائج وراحة المريض.",
      image: "/download (1).jpeg",
      bgGradient: "from-teal-400 via-cyan-400 to-blue-400"
    },
    {
      title: "تصميم الابتسامة المثالية",
      subtitle: "ابتسامة هوليوود الرائعة",
      description: "احصل على ابتسامة أحلامك مع خدمات تجميل الأسنان المتطورة. نوفر حلول تجميلية شاملة تشمل التبييض، والقشور، والتقويم الشفاف.",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=500&fit=crop&crop=face",
      bgGradient: "from-cyan-400 via-blue-400 to-blue-500"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds
    

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[605px] overflow-hidden" dir="rtl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'translate-x-0 opacity-100' : 
            index < currentSlide ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
          }`}
        >
          <div className={`w-full h-[605px] bg-gradient-to-br ${slide.bgGradient} relative overflow-hidden`}>
            {/* الدوائر الزخرفية المتحركة */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-16 w-12 h-12 sm:w-16 sm:h-16 border-2 border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-16 left-8 sm:top-24 sm:left-32 w-4 h-4 sm:w-6 sm:h-6 bg-white/30 rounded-full animate-bounce"></div>
            <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-16 w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-24 right-8 sm:bottom-32 sm:right-32 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full animate-bounce"></div>
            <div className="absolute top-12 right-1/4 sm:top-16 sm:right-1/3 w-3 h-3 sm:w-4 sm:h-4 bg-white/25 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 left-1/4 sm:bottom-40 sm:left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-white/15 rounded-full animate-bounce"></div>

            {/* أيقونات طب الأسنان المتحركة */}
            <div className="absolute top-8 left-6 sm:top-12 sm:left-24 text-white/30 transform rotate-45 animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sm:w-7 sm:h-7">
                <path d="M4.5 2C3.12 2 2 3.12 2 4.5S3.12 7 4.5 7H6v10c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4V7h1.5C20.88 7 22 5.88 22 4.5S20.88 2 19.5 2h-15zM8 7h8v10c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V7z"/>
                <rect x="9" y="8" width="6" height="1" rx="0.5"/>
                <rect x="9" y="10" width="6" height="1" rx="0.5"/>
                <rect x="9" y="12" width="6" height="1" rx="0.5"/>
              </svg>
            </div>
            
            <div className="absolute top-16 right-4 sm:top-20 sm:right-20 text-white/25 transform rotate-12 animate-bounce">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-6 sm:h-6">
                <path d="M12 2C10.34 2 9 3.34 9 5v2c0 1.1-.9 2-2 2s-2 .9-2 2v8c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3v-8c0-1.1-.9-2-2-2s-2-.9-2-2V5c0-1.66-1.34-3-3-3z"/>
              </svg>
            </div>
            
            <div className="absolute bottom-20 right-6 sm:bottom-24 sm:right-24 text-white/20 transform -rotate-12 animate-pulse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                <path d="M4.5 2C3.12 2 2 3.12 2 4.5S3.12 7 4.5 7H6v10c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4V7h1.5C20.88 7 22 5.88 22 4.5S20.88 2 19.5 2h-15zM8 7h8v10c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V7z"/>
                <rect x="9" y="8" width="6" height="1" rx="0.5"/>
                <rect x="9" y="10" width="6" height="1" rx="0.5"/>
              </svg>
            </div>
            
            <div className="absolute bottom-24 left-8 sm:bottom-32 sm:left-32 text-white/15 transform rotate-45 animate-bounce">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-6 sm:h-6">
                <path d="M12 2C10.34 2 9 3.34 9 5v2c0 1.1-.9 2-2 2s-2 .9-2 2v8c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3v-8c0-1.1-.9-2-2-2s-2-.9-2-2V5c0-1.66-1.34-3-3-3z"/>
              </svg>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center">
              <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-12">
                
                {/* المحتوى الأيمن - الصورة */}
                <div className="flex-1 flex justify-center items-center order-1 lg:order-2">
                  <div className="relative">
                    <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[570px] lg:h-[520px] rounded-tr-[150px] rounded-tl-[150px] bg-white/20 rounded-ee-md flex items-center justify-center backdrop-blur-sm border border-white/30 transform transition-all duration-700 hover:scale-105 hover:rotate-2">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent lg:w-[570px] lg:h-[520px] rounded-tr-[150px] rounded-tl-[150px]  animate-pulse"></div>
                      <img 
                        src={slide.image}
                        alt="مريض الأسنان"
                        className="w-[400px] h-[300px] sm:w-88 sm:h-88 lg:w-[550px] lg:h-[500px] object-cover rounded-tr-[150px] rounded-tl-[150px]  z-10 transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* المحتوى الأيسر - النص */}
                <div className="flex-1 text-white space-y-4 sm:space-y-6 text-center lg:text-right max-w-md lg:max-w-2xl order-2 lg:order-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-wider leading-tight transform transition-all duration-700 hover:scale-105">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal tracking-wide text-white/90">
                    {slide.subtitle}
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed opacity-90 text-white/90 max-w-xl mx-auto lg:mx-0">
                    {slide.description}
                  </p>
                  <Link href="/bokink">
                    <button className="bg-white/20 cursor-pointer hover:bg-white/30 backdrop-blur-sm text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 mt-6 sm:mt-8 transform hover:scale-105 hover:shadow-lg border border-white/30">
                      أحجز موعدك الآن
                    </button>
                  </Link>
                  
                  {/* أيقونات وسائل التواصل الاجتماعي */}
                  <div className="flex space-x-4 space-x-reverse pt-6 sm:pt-8 justify-center lg:justify-end">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-6 backdrop-blur-sm">
                      <Instagram size={20} />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-6 backdrop-blur-sm">
                      <Facebook size={20} />
                    </div>
                    <div className="w-12 mr-4 h-12 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-6 backdrop-blur-sm">
                      <Twitter size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التنقل على شكل مثلثات */}
            <div className="absolute left-4 sm:left-8  top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 sm:space-y-3">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] cursor-pointer sm:border-l-[12px] sm:border-r-[12px] sm:border-b-[20px] border-l-transparent border-r-transparent transition-all duration-300 transform hover:scale-110 ${
                    index === currentSlide ? 'border-b-white' : 'border-b-white/40'
                  }`}
                  style={{ transform: 'rotate(-90deg)' }}
                />
              ))}
            </div>

            {/* مؤشر التقدم */}
            <div className="absolute bottom-4 left-1/2 transform  -translate-x-1/2 flex space-x-2 sm:space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* الشريط السفلي الأزرق الداكن */}
      <div className="absolute bottom-0 cursor-pointer left-0 w-full h-1 sm:h-2 bg-blue-800">
        <div 
          className="h-full bg-white  transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Landing;