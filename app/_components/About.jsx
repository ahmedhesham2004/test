"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

// بيانات الهيدر
const header = {
  title: "عن عيادتي",
  subtitle: "رؤيتنا في تقديم أفضل رعاية صحية",
  bgImage: "/backs.jpeg",
};

// بيانات الرؤية والرسالة
const visionMission = [
  {
    title: "الرؤية",
    desc: "قيادة الجيل القادم من خدمات الرعاية الصحية في مصر ومنطقة الشرق الأوسط وشمال إفريقيا من خلال تنفيذ البروتوكولات القياسية وتقديم معايير عالمية في الخدمات الطبية.",
    icon: "👁️",
  },
  {
    title: "الرسالة",
    desc: "تقديم نموذج للتميز في الخدمات الطبية ورعاية المرضى وإلهام المجتمع ومجتمع الرعاية الطبية من خلال إعادة تعريف الرعاية الصحية والخدمات الطبية وتقديم معيار جديد في مصر ومنطقة الشرق الأوسط وشمال إفريقيا.",
    icon: "🎯",
  },
];

// بيانات الأهداف
const goalsDescription = "نسعى لتحقيق مجموعة من الأهداف التي تضمن أفضل تجربة علاجية لمرضانا:";
const clinicGoals = [
  {
    title: "توفير بيئة علاجية آمنة ومريحة للمرضى.",
    desc: "نحرص على تهيئة مساحة علاجية تشعر المرضى بالراحة والأمان",
    icon: "🏥",
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "الارتقاء بمستوى الخدمات الطبية المقدمة.",
    desc: "نسعى دائماً لتطوير خدماتنا ورفع معايير الجودة",
    icon: "⚡",
    color: "from-blue-400 to-indigo-500",
  },
  { 
    title: "الاعتماد على أحدث التقنيات الطبية.", 
    desc: "نستخدم أحدث المعدات والتقنيات الطبية المتطورة",
    icon: "🔬",
    color: "from-purple-400 to-pink-500",
  },
  { 
    title: "تعزيز التوعية الصحية في المجتمع.", 
    desc: "نساهم في نشر الوعي الصحي والوقائي في المجتمع",
    icon: "📢",
    color: "from-orange-400 to-red-500",
  },
];

// بيانات سيكشن عن العيادة
const aboutClinicContent = {
  title: "عن عيادتي",
  text: `في عيادتك، نؤمن بأن الرعاية الصحية تبدأ من الاهتمام الحقيقي بكل مريض. نحرص على تقديم خدمات طبية شاملة تجمع بين الخبرة الطبية والتقنيات الحديثة، مع التركيز على راحة المريض وخصوصيته. 

فريقنا من الأطباء المتخصصين يسعى دائمًا لتقديم أفضل الحلول العلاجية والوقائية، مع الالتزام بأعلى معايير الجودة والإنسانية.

نهدف إلى بناء علاقة ثقة طويلة الأمد مع مرضانا، ونوفر بيئة علاجية آمنة وداعمة تضمن أفضل النتائج الصحية.`,
  image: "/backs.jpeg",
};

// بيانات تخصصات الأسنان
const dentalSectionContent = {
  title: "جميع تخصصات طب الأسنان",
  desc: "تقدر تعمل أشعة، فحوصات، جراحة، معالجة للثة والوجه والفكين، والجودة والأمان عن طريق فريقنا.",
  image: "/backs.jpeg",
  button: { text: "باقي تخصصاتنا الطبية", link: "#" },
  specialties: [
    {
      title: "فينير الأسنان",
      icon: "✨",
      link: "#",
      color: "from-emerald-400 to-teal-500",
      description: "قشور خزفية رفيعة للحصول على ابتسامة مثالية"
    },
    {
      title: "تركيبات الأسنان",
      icon: "🦷",
      link: "#",
      color: "from-cyan-400 to-blue-500",
      description: "تعويض الأسنان المفقودة بأحدث التقنيات"
    },
    {
      title: "زراعة الأسنان",
      icon: "🔧",
      link: "#",
      color: "from-teal-400 to-cyan-500",
      description: "حل دائم وطبيعي لتعويض الأسنان المفقودة"
    },
    {
      title: "تبييض الأسنان",
      icon: "💎",
      link: "#",
      color: "from-blue-400 to-indigo-500",
      description: "تبييض آمن وفعال للحصول على ابتسامة ناصعة"
    },
    {
      title: "تقويم الأسنان",
      icon: "🎯",
      link: "#",
      color: "from-indigo-400 to-purple-500",
      description: "تصحيح وضعية الأسنان بطرق متقدمة"
    },
    {
      title: "هوليود سمايل",
      icon: "🌟",
      link: "#",
      color: "from-purple-400 to-pink-500",
      description: "الحصول على ابتسامة المشاهير"
    },
  ],
};

// إحصائيات العيادة
const clinicStats = [
  { number: "5000+", label: "مريض سعيد", icon: "😊" },
  { number: "15+", label: "سنة خبرة", icon: "📅" },
  { number: "10+", label: "تخصص طبي", icon: "🏥" },
  { number: "24/7", label: "خدمة عملاء", icon: "📞" },
];

// شهادات المرضى
const testimonials = [
  {
    name: "أحمد محمد",
    text: "خدمة ممتازة وفريق طبي متميز. أنصح بالعيادة للجميع",
    rating: 5,
    avatar: "👨‍💼"
  },
  {
    name: "فاطمة علي",
    text: "تجربة رائعة ونتائج مذهلة. شكراً للدكتور والفريق",
    rating: 5,
    avatar: "👩‍💼"
  },
  {
    name: "محمد سامي",
    text: "أفضل عيادة أسنان زرتها. النظافة والاهتمام في أعلى مستوى",
    rating: 5,
    avatar: "👨‍🔬"
  },
];

// المزايا التنافسية
const advantages = [
  {
    title: "أطباء متخصصون",
    desc: "فريق من أفضل الأطباء المعتمدين",
    icon: "👨‍⚕️",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "معدات حديثة",
    desc: "أحدث الأجهزة والتقنيات الطبية",
    icon: "🔬",
    color: "from-green-500 to-teal-500"
  },
  {
    title: "بيئة معقمة",
    desc: "أعلى معايير النظافة والتعقيم",
    icon: "🧼",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "أسعار مناسبة",
    desc: "خدمات عالية الجودة بأسعار تنافسية",
    icon: "💰",
    color: "from-orange-500 to-red-500"
  }
];

// Floating Animation Component
const FloatingElement = ({ children, delay = 0 }) => {
  return (
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Stats Counter Component
const StatCounter = ({ endValue, label, icon }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const timer = setTimeout(() => {
      const increment = Math.ceil(parseInt(endValue.replace(/[^\d]/g, '')) / 50);
      let current = 0;
      const target = parseInt(endValue.replace(/[^\d]/g, ''));
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(counter);
        } else {
          setCount(current);
        }
      }, 40);
      
      setHasAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [endValue, hasAnimated]);

  const formatNumber = (num) => {
    if (endValue.includes('+')) return `${num}+`;
    if (endValue.includes('/')) return endValue;
    return num.toString();
  };

  return (
    <div className="text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">
        {formatNumber(count)}
      </div>
      <div className="text-white/90 text-sm">{label}</div>
    </div>
  );
};

export default function About() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full min-h-screen flex flex-col items-center bg-gray-50">
      {/* Enhanced Header Section */}
      <div className="relative w-full h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
        
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+CjwvZz4KPC9nPgo8L3N2Zz4K')] repeat animate-pulse"></div>
        </div>

        {/* Floating Medical Icons */}
        <FloatingElement delay={0}>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
            🩺
          </div>
        </FloatingElement>
        
        <FloatingElement delay={1}>
          <div className="absolute bottom-32 left-16 w-20 h-20 bg-white/15 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
            ⚕️
          </div>
        </FloatingElement>
        
        <FloatingElement delay={2}>
          <div className="absolute top-40 left-32 w-12 h-12 bg-white/25 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
            💊
          </div>
        </FloatingElement>

        {/* Main Header Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {header.title}
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl text-white/95 font-medium max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {header.subtitle}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/bokink"
              className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
            >
              احجز موعدك الآن
            </Link>
            <Link
              href="#footer"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              تواصل معنا
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section - New Addition */}
      <section className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 py-16 -mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {clinicStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <StatCounter 
                  endValue={stat.number} 
                  label={stat.label} 
                  icon={stat.icon}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Clinic Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-20">
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Enhanced Image Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl transform -rotate-1 opacity-10"></div>
            <div className="relative z-10 bg-white rounded-3xl p-4 shadow-2xl">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-8xl">
                🏥
              </div>
            </div>
            
            {/* Floating Elements */}
            <FloatingElement delay={0.5}>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                ✨
              </div>
            </FloatingElement>
            
            <FloatingElement delay={1.5}>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                💎
              </div>
            </FloatingElement>
          </div>
          
          {/* Enhanced Text Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                من نحن
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {aboutClinicContent.title}
              </h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="prose prose-lg text-gray-600 leading-relaxed"
            >
              {aboutClinicContent.text.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </motion.div>
            
            {/* Enhanced Progress Bars */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700 min-w-[120px]">جودة الخدمة</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "98%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    viewport={{ once: true }}
                  />
                </div>
                <span className="text-blue-600 font-bold">98%</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700 min-w-[120px]">رضا المرضى</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "96%" }}
                    transition={{ duration: 1.5, delay: 1.0 }}
                    viewport={{ once: true }}
                  />
                </div>
                <span className="text-emerald-600 font-bold">96%</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-700 min-w-[120px]">الأمان</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    viewport={{ once: true }}
                  />
                </div>
                <span className="text-purple-600 font-bold">100%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Advantages Section - New Addition */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 rounded-full text-lg font-bold mb-4">
              لماذا نحن
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              مزايانا التنافسية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نتميز بعدة مزايا تجعلنا الخيار الأول لرعايتكم الصحية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 hover:border-gray-200">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${advantage.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${advantage.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                      {advantage.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {advantage.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {advantage.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Dental Specialties Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 rounded-full text-lg font-bold">
                  تخصصاتنا
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  {dentalSectionContent.title}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {dentalSectionContent.desc}
                </p>
              </div>
              
              {/* Enhanced Specialties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dentalSectionContent.specialties.map((spec, index) => (
                  <motion.div
                    key={spec.title}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href="/work" className="group relative overflow-hidden bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${spec.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${spec.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                          <span className="text-2xl">{spec.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                            {spec.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            {spec.description}
                          </p>
                          <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-700">
                            اعرف المزيد ←
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href="/work" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                  {dentalSectionContent.button.text}
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-3xl transform -rotate-3 opacity-20"></div>
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl transform rotate-1 opacity-10"></div>
              <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl">
                <div className="w-full h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center text-9xl">
                  🦷
                </div>
              </div>
              
              {/* Floating Dental Icons */}
              <FloatingElement delay={0.5}>
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-2xl shadow-xl">
                  ✨
                </div>
              </FloatingElement>
              
              <FloatingElement delay={1.2}>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-3xl shadow-xl">
                  💎
                </div>
              </FloatingElement>
              
              <FloatingElement delay={2}>
                <div className="absolute top-16 -left-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xl shadow-lg">
                  🌟
                </div>
              </FloatingElement>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Goals Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-full text-lg font-bold mb-4">
              أهدافنا
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              نحو التميز في الرعاية الصحية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {goalsDescription}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clinicGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 hover:border-gray-200">
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-3xl`}></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
                      <span className="text-3xl">{goal.icon}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                        {goal.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {goal.desc}
                      </p>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 2, delay: index * 0.2 + 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New Addition */}
      <section className="w-full bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 rounded-full text-lg font-bold mb-4">
              آراء عملائنا
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              ماذا يقول مرضانا عنا
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {/* Stars */}
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="text-yellow-400 text-2xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-2xl md:text-3xl text-gray-700 font-medium leading-relaxed mb-8 italic">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>
                
                {/* Customer Info */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="text-right">
                    <h4 className="text-xl font-bold text-gray-800">
                      {testimonials[activeTestimonial].name}
                    </h4>
                    <p className="text-gray-600">مريض سعيد</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Vision & Mission Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 rounded-full text-lg font-bold mb-4">
              رؤيتنا ورسالتنا
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              نحو مستقبل أفضل للرعاية الصحية
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {visionMission.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-200">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl"></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                  
                  <div className="relative z-10 text-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {item.desc}
                    </p>
                    
                    {/* Decorative Line */}
                    <div className="flex justify-center gap-2 pt-4">
                      <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      <div className="w-4 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      <div className="w-2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Map Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-red-100 to-orange-100 text-red-600 rounded-full text-lg font-bold mb-4">
              موقعنا
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              زوروا عيادتنا
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نحن في خدمتكم في موقع متميز وسهل الوصول
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl transform rotate-1 opacity-20"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl transform -rotate-1 opacity-10"></div>
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden p-4">
              <iframe
                src="https://www.google.com/maps?q=30.044419,31.235711&z=13&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96 rounded-2xl"
                title="موقع العيادة - ميدان التحرير"
              />
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <span className="text-blue-600 text-2xl">📍</span>
                  <span>وسط البلد: ميدان التحرير، القاهرة</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <span className="text-blue-600 text-2xl">📍</span>
                  <span>مدينة نصر: شارع مصطفى النحاس، القاهرة</span>
                </div>
              </div>
            </div>
            
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  📞
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">اتصل بنا</h4>
                <p className="text-gray-600">+20 123 456 7890</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✉️
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">راسلنا</h4>
                <p className="text-gray-600">info@clinic.com</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  🕒
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">مواعيد العمل</h4>
                <p className="text-gray-600">9 صباحاً - 9 مساءً</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section - New Addition */}
    
    </section>
  );
}