"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
  FaUserCircle,
  FaUsers,
  FaStethoscope ,
  FaRegClipboard,
  FaUserAlt ,
  FaComments ,
  FaRegClock ,
  FaCalendarCheck ,
  FaNotesMedical ,
  FaHome ,
  FaXRay ,
  FaCashRegister 
  
} from 'react-icons/fa';
import { RiDashboardFill } from 'react-icons/ri';

const handleLogout = () => {
  localStorage.clear();
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userInfo, setUserInfo] = useState({ fullName: '', imageUrl: '' });
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('User'))?.tokens;
        const res = await fetch('https://itch-clinc.runasp.net/api/Account/Profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        if (res.ok) {
          const data = await res.json();
          setUserInfo({
            fullName: data?.firstName + " " +data?.lastName  || '',
            imageUrl: data?.imageUrl || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const navItems = [
     { path: '/', icon: <FaHome  />, label: ' الصفحة الرئيسية' },
     { path: '/dashboard/payments', icon: <FaNotesMedical   />, label: 'حجز كشف ' },
    { path: '/dashboard/profile', icon: <FaUserAlt  />, label: 'الملف الشخصي' },
    { path: '/dashboard/user', icon: <FaUsers/>, label: 'المستخدمين' },
    { path: '/dashboard/specialtie', icon: <FaStethoscope />, label: 'التخصصات' },
    { path: '/dashboard/Review', icon: <FaComments  />, label: 'التعليقات' },
    { path: '/dashboard/CaseStudy', icon: <FaRegClipboard />, label: ' حالاتنا' },
    { path: '/dashboard/timework', icon: <FaRegClock  />, label: ' مواعيد العمل' },
    { path: '/dashboard/booking', icon: <FaCalendarCheck  />, label: '  الحجوزات' },
     { path: '/dashboard/rumor', icon: <FaXRay   />, label: '  الاشاعه والتحاليل ' },
     { path: '/dashboard/Accounting', icon: <FaCashRegister   />, label: 'المعاملات الماليه' },
  ];
   
  

  return (
    <div dir="rtl" className="font-sans bg-gradient-to-b from-[#0d155c] to-[#262e79]">
      {/* Mobile Header */}
      {isMobile && (
        <header className="lg:hidden fixed w-full  bg-gradient-to-b from-[#0d155c] to-[#262e79] text-white shadow-md z-50">
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center space-x-1">
              <div className="p-1 bg-white/10 rounded-full">
                {userInfo.imageUrl ? (
                  <img
                    src={`https://itch-clinc.runasp.net/${userInfo.imageUrl}`}
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-2xl text-white/90" />
                )}
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-white/10 transition-all"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile Sidebar Menu */}
          {isOpen && (
            <div className="bg-gradient-to-b from-[#0d155c] to-[#262e79] shadow-lg pb-0">
              <nav>
                <ul className="space-y-0 px-1">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        onClick={closeSidebar}
                        className={`flex items-center p-0 rounded-lg transition-all duration-200 ${
                          pathname === item.path
                            ? 'bg-white/20 text-white'
                            : 'hover:bg-white/10 text-white/90 hover:text-white'
                        }`}
                      >
                        <span className="ml-3 text-lg">{item.icon}</span>
                        <span className="">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button onClick={handleLogout}>
                      <Link
                        href="/auth/signin"
                        className="flex items-center p-0 rounded-lg hover:bg-white/10 transition-all duration-200 w-full"
                      >
                        <span className="ml-3">
                          <FaSignOutAlt className="text-lg" />
                        </span>
                        <span className="font-medium">تسجيل الخروج</span>
                      </Link>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </header>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed mb-10 h-full z-50">
          <aside
            className={`relative h-screen transition-all duration-300 ease-in-out ${
              isCollapsed ? 'w-20' : 'w-48'
            } flex-shrink-0 bg-gradient-to-b from-[#0d155c] to-[#262e79] text-white shadow-2xl`}
          >
            <div className="h-full flex flex-col">
              {/* Header with User Profile */}
              <div
                className={`p-2 flex ${
                  isCollapsed
                    ? 'flex-col items-center py-6'
                    : 'items-center justify-between'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="p-1 bg-white/10 rounded-full">
                    {userInfo.imageUrl ? (
                      <img
                        src={`https://itch-clinc.runasp.net/${userInfo.imageUrl}`}
                        alt="user"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl text-white/90" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm text-white/80 mt-0">{userInfo.fullName}</span>
                  )}
                </div>
                <button
                  onClick={toggleCollapse}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                >
                  {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-0 px-2">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                          pathname === item.path
                            ? 'bg-white/20 text-white shadow-md'
                            : 'hover:bg-white/10 text-white/90 hover:text-white'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? item.label : ''}
                      >
                        <span className={`${isCollapsed ? '' : 'ml-3'} text-lg`}>
                          {item.icon}
                        </span>
                        {!isCollapsed && <span className="font-medium">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer with Logout */}
              <div className="p-0 px-5 border-t border-white/10">
                <button onClick={handleLogout}>
                  <Link
                    href="/auth/signin"
                    className={`flex items-center p-3 rounded-lg hover:bg-white/10 transition-all duration-200 ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                    title={isCollapsed ? 'تسجيل الخروج' : ''}
                  >
                    <span className={isCollapsed ? '' : 'ml-3'}>
                      <FaSignOutAlt className="text-lg" />
                    </span>
                    {!isCollapsed && <span className="font-medium">تسجيل الخروج</span>}
                  </Link>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
