import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import apiClient from '../../api/axios';

import { useAuthStore } from '../../store/authStore';

import InputField from '../../components/common/InputField';

import { loginSchema } from '../../schemas/authShema';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
    setLoginError('');
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError('');
    setLoading(true);

    try {
      loginSchema.parse(formData);

      const response = await apiClient.post('/api/login', {
        email: formData.email,
        password: formData.password,
      });

      const tokenFromApi = response.data.access_token;
      const userFromApi = response.data.user;

      if (tokenFromApi && userFromApi) {
        loginUser(userFromApi, tokenFromApi);
        navigate('/', { replace: true });
      } else {
        setLoginError('Respons API tidak lengkap: token atau data pengguna tidak ditemukan.');
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        for (const issue of err.issues) {
          newErrors[issue.path[0]] = issue.message;
        }
        setErrors(newErrors);
        console.error('Validation Error (Frontend):', newErrors);
      }
      else if (apiClient.isAxiosError(err)) {
        if (err.response) {
          console.error('Login API Error:', err.response.data);
          console.error('Status Code:', err.response.status);

          if (err.response.status === 401) {
            setLoginError(err.response.data.message || 'Email atau password salah. Silakan coba lagi.');
          } else if (err.response.status === 422) {
            const apiValidationErrors = err.response.data.errors;
            if (apiValidationErrors) {
              setLoginError('Ada kesalahan dalam input Anda.');
              setErrors(prev => ({ ...prev, ...apiValidationErrors }));
            } else {
              setLoginError('Terjadi kesalahan validasi yang tidak terduga.');
            }
          } else {
            setLoginError(err.response.data.message || 'Terjadi kesalahan server. Silakan coba lagi nanti.');
          }
        } else if (err.request) {
          setLoginError('Tidak dapat terhubung ke server. Pastikan server berjalan dan periksa koneksi internet Anda.');
        } else {
          setLoginError('Terjadi kesalahan tak terduga saat menyiapkan permintaan.');
        }
      }
      else {
        console.error('Unexpected Error:', err);
        setLoginError('Terjadi kesalahan yang tidak terduga. Silakan hubungi administrator.');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, navigate, loginUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-400 mb-2">
            Login
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Selamat datang kembali!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={formData.email}
            onChange={handleChange}
            hasError={!!errors.email}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="Masukkan password Anda"
            value={formData.password}
            onChange={handleChange}
            hasError={!!errors.password}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          {loginError && (
            <p className="text-red-500 text-sm text-center -mt-4">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-semibold text-lg
                       hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                       dark:focus:ring-offset-gray-900 transition duration-200 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <a href="#" className="text-red-600 hover:underline dark:text-red-400">Lupa Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;