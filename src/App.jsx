import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import appRoutes from './config/routes';
import Sidebar from './components/layouts/Sidebar';
import Header from './components/layouts/Header';
import LoginPage from './pages/auth/LoginPage';
import { useAuthStore } from './store/authStore';
import apiClient from './api/axios';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await apiClient.get('http://localhost:8000/sanctum/csrf-cookie');
        console.log('CSRF cookie fetched successfully.');
      } catch (error) {
        console.error('Failed to fetch CSRF cookie:', error);
      }
    };

    if (!isLoggedIn) {
      fetchCsrfToken();
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {isLoggedIn && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {isLoggedIn && <Header />}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/login" element={
                <ProtectedRoute onlyGuest>
                  <LoginPage />
                </ProtectedRoute>
                }
              />

              {appRoutes.map(({ path, element, roles }, index) => (
                <Route
                  key={index}
                  path={path}
                  element={
                    <ProtectedRoute allowedRoles={roles}>
                      {element}
                    </ProtectedRoute>
                  }
                />
              ))}

              <Route
                path="*"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
