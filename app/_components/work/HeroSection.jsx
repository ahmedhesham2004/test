"use client";

import React from 'react'
export default function HeroSection() {
  
    return (
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-teal-50 to-cyan-100">
          {/* Animated cloud-like shapes */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-10 right-10 w-36 h-36 bg-white/25 rounded-full blur-xl animate-pulse delay-500"></div>
          
          {/* Additional floating elements */}
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-teal-300/15 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-2/3 right-1/3 w-20 h-20 bg-cyan-300/20 rounded-full blur-lg animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-blue-200/15 rounded-full blur-lg animate-bounce delay-2000"></div>
        </div>
  
        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-[#009688] mb-6 animate-fade-in">
              أسعار خدماتنا في عيادتي    
            </h1>
            
            {/* Decorative line */}
            <div className="w-24 h-1 bg-[#009688] mx-auto mb-8 rounded-full"></div>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
              نقدم لكم أفضل الخدمات الطبية بأسعار مناسبة وجودة عالية
            </p>
          </div>
        </div>
  
        {/* Floating animation keyframes */}
        <style jsx>{`
          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fade-in-delay {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
          
          .animate-fade-in-delay {
            animation: fade-in-delay 1s ease-out 0.5s forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  
}
