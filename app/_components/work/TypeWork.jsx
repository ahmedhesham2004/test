"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SpecialtiesWithSidebar() {
  const [specialties, setSpecialties] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://itch-clinc.runasp.net/api/specialtie/GetAll");
        if (!response.ok) {
          throw new Error('Failed to fetch specialties');
        }
        const data = await response.json();
        setSpecialties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  // Scroll smooth behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const scrollToSpecialty = (id) => {
    const element = document.getElementById(`specialty-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleDescription = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 flex justify-center items-center">
        <div className="text-[#009688] text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 flex justify-center items-center">
        <div className="text-red-500 text-lg">حدث خطأ في تحميل البيانات</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 bg-white">
      {/* Sidebar */}
      <div className="w-full hidden md:block lg:w-64 shrink-0 space-y-3 sticky top-40 self-start h-fit border-l border-gray-200 pr-4 text-right">
        <h3 className="text-xl font-bold text-[#009688] mb-2">جميع التخصصات</h3>
        <ul className="text-sm text-gray-800 space-y-2">
          {specialties.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSpecialty(item.id)}
                className="hover:text-cyan-700 cursor-pointer block text-right w-full transition-colors duration-200"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {specialties.map((item) => (
          <div
            key={item.id}
            id={`specialty-${item.id}`}
            className="bg-[#f3fbfb] p-6 rounded-3xl shadow flex flex-col md:flex-row gap-6"
          >
            <div
              className="md:w-1/3 w-full flex justify-center items-center cursor-pointer"
              onClick={() => scrollToSpecialty(item.id)}
            >
              <img
                src={`https://itch-clinc.runasp.net/${item.imageUrl}`}
                alt={item.name}
                className="rounded-2xl w-full max-w-[300px] h-[200px] object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <h2 className="text-[#009688] font-bold text-xl mb-2">
                {item.name}
              </h2>
              
              <ul className="list-disc pr-5 text-gray-700 space-y-1 text-sm">
                {item.price && (
                  <li>السعر يبدأ من: {item.price.toLocaleString()} جنيه</li>
                )}
                {item.duration && <li>المدة: {item.duration} دقيقة</li>}
              </ul>
              
              <AnimatePresence mode="wait">
                {expanded === item.id && (
                  <motion.div
                    className="text-gray-600 mt-4 text-sm leading-relaxed"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.description && item.description
                      .split(/[.؟!]/g)
                      .filter(p => p.trim() !== '')
                      .map((part, idx) => (
                        <p key={idx} className="mb-3">{part.trim()}.</p>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-4">
                <button
                  onClick={() => toggleDescription(item.id)}
                  className="bg-[#dff5f3] hover:bg-[#c5ebe6] text-[#004d40] font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-colors duration-200"
                >
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      expanded === item.id ? 'rotate-90' : 'rotate-180'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 19l-7-7 7-7v14zM14 5h2v14h-2V5z" />
                  </svg>
                  {expanded === item.id ? "إخفاء الوصف" : `اعرف أكتر عن ${item.name}`}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}