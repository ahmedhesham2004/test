import React from 'react'
import Reviews from '../_components/price/Reviews'
import After from '../_components/price/After'

export default function Page() {
  return (
    <div className="w-full min-h-screen py-12 relative overflow-hidden">
      {/* SVG BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none">
        {/* دائرة كبيرة شفافة */}
        <svg width="600" height="600" className="absolute left-[-200px] top-[-200px]" fill="none">
          <circle cx="300" cy="300" r="300" fill="#5eead4" fillOpacity="0.15" />
        </svg>
        {/* دائرة أصغر */}
        <svg width="300" height="300" className="absolute right-[-100px] bottom-[-100px]" fill="none">
          <circle cx="150" cy="150" r="150" fill="#99f6e4" fillOpacity="0.18" />
        </svg>
        {/* زخرفة طبية (سن) */}
        <svg width="120" height="120" className="absolute left-10 bottom-10" fill="none" viewBox="0 0 40 40">
          <path d="M20 3C12 3 5 10 5 18c0 10 15 19 15 19s15-9 15-19c0-8-7-15-15-15z" fill="#5eead4" fillOpacity="0.12"/>
        </svg>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* محتوى الصفحة الحالي */}
        <After/>
        <Reviews/>
      </div>
    </div>
  );
}
