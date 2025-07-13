import { create } from 'zustand';

const getInitialLoginStatus = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('auth_token');
  }
  return false;
};

const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      return null;
    }
  } 
  return null;
};

export const useAuthStore = create((set) => ({
  isLoggedIn: getInitialLoginStatus(),
  user: getInitialUser(),
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,

  login: (userData, token) => { 
    set({ isLoggedIn: true, user: userData, token: token }); 
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Token ', token)
      localStorage.setItem('auth_token', token); 
    }
  },

  logout: () => {
    set({ isLoggedIn: false, user: null, token: null }); 
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token'); 
    }
  },
}));