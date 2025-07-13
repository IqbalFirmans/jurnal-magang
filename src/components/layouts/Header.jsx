import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore'; 
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const user = useAuthStore((state) => state.user); 
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  }, []);

  const handleLogout = useCallback(() => {
    
      logout(); 
      navigate('/login', { replace: true });
  }, [logout, navigate]);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* <button className="text-gray-500 focus:outline-none focus:text-gray-600 dark:text-gray-400 dark:focus:text-gray-200 lg:hidden">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button> */}

        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard Admin
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.459 4.504a1 1 0 01-1.285.427 1 1 0 01-.427-1.285 6.002 6.002 0 004.307-3.693 1 1 0 111.838.743 8.002 8.002 0 01-5.023 5.438zM16 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM3 10a1 1 0 01-1 1H1a1 1 0 110-2h1a1 1 0 011 1zm7-13a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm6.364 16.364a1 1 0 01-.707 1.707l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zm-12.728 0a1 1 0 01-.707-1.707l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-.707 0zM10 18a1 1 0 01-1 1v1a1 1 0 112 0v-1a1 1 0 01-1-1zm-6.364-1.364a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 focus:outline-none">
              <span className="font-medium">Halo, {user ? user.name : 'Pengguna'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Profil</a>
              <a href="/preferences" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Pengaturan</a>
              <hr className="border-gray-200 dark:border-gray-600 my-1" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;