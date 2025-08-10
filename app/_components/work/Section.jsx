"use client";
import { useEffect, useRef, useState } from 'react';

export default function Section() {
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

  const features = [
    {
      id: 1,
      title: "سعر الكشف",
      description: "300 جنيه , إنت هتكون محتاج تكشف والدكتور يقيم حالتك الأول قبل ما نعمل أي حاجة لأسنانك",
      imageSrc: "/calendar.webp" // ضع مسار صورة الكارت هنا
    },
    {
      id: 2,
      title: " هتلاقينا فين",
      description: "عنوان عيادتنا 24 مكرم عبيد بمدينة نصر , أول لما متخرج معانا سواء أونلاين أو عن طريق الـ What's app أو بالتليفون هنتليفنلنا بنقولك أنسب طريق ليك",
      imageSrc: "/pin-1.webp" // ضع مسار صورة الموقع هنا
    },
    {
      id: 3,
      title: "مواعيدنا ايه",
      description: "احنا موجودين كل ايام الاسبوع ماعدا الجمعة و مواعيدنا من 3 العصر لـ 10 بليل",
      imageSrc: "/card.webp" // ضع مسار صورة التقويم هنا
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => (itemRefs.current[index] = el)}
              data-index={index}
              className="relative pt-12"
            >
              {/* Floating Image - positioned absolutely above the card */}
              <div className={`absolute -top-16 left-2/3 transform -translate-x-1/2 z-10 transition-all duration-1000 ${
                visibleItems.has(index.toString()) 
                  ? 'animate-float opacity-100 scale-100' 
                  : 'translate-y-8 opacity-0 scale-75'
              }`}>
                <div className="w-44 h-44   flex items-center justify-center">
                  <img 
                    src={feature.imageSrc} 
                    alt={feature.title}
                    className="w-44 h-44 object-contain"
                  />
                </div>
              </div>

              {/* Card */}
              <div className={`bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 pt-16 text-white text-center min-h-[320px] shadow-xl transition-all duration-1000 ${
                visibleItems.has(index.toString()) 
                  ? 'transform translate-y-0 opacity-100' 
                  : 'transform translate-y-8 opacity-0'
              }`}>
                
                {/* Content */}
                <div className="flex flex-col h-full">
                  <h3 className={`text-2xl font-bold mb-6 transition-all duration-1000 delay-300 ${
                    visibleItems.has(index.toString()) 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform translate-y-4 opacity-0'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed flex-1 transition-all duration-1000 delay-500 ${
                    visibleItems.has(index.toString()) 
                      ? 'transform translate-y-0 opacity-100' 
                      : 'transform translate-y-4 opacity-0'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(-50%);
          }
          50% {
            transform: translateY(-10px) translateX(-50%);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}