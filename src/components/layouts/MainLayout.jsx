import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar overlay
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop sidebar collapse
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const toggleDesktopCollapse = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Jika layar menjadi desktop (>= lg breakpoint) dan sidebar mobile terbuka, tutup
      // Ini penting agar sidebar tidak "nyangkut" terbuka saat resize dari mobile ke desktop
      if (window.innerWidth >= 1024 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    // Saat rute berubah, tutup sidebar mobile jika terbuka
    if (isSidebarOpen && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname, isSidebarOpen]); // isSidebarOpen sebagai dependency untuk memastikan efek benar saat state berubah

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      <main
        id="main-content"
        className={`flex-1 p-8 min-h-screen transition-all duration-300
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} /* Margin untuk desktop */
          ${isSidebarOpen ? 'ml-0' : 'ml-0'} /* Di mobile, margin-left selalu 0 */
          bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100
        `}
      >
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
              onClick={toggleMobileSidebar}
            ></div>
          )}

        <Header
          toggleMobileSidebar={toggleMobileSidebar}
          toggleDesktopCollapse={toggleDesktopCollapse}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;