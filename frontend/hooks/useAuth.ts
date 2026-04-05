'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const { user, token, setAuth, logout: storeLogout } = useAuthStore();

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuth(data.user, data.token);
    toast.success('Logged in successfully');
    if (data.user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, phone, password });
    setAuth(data.user, data.token);
    toast.success('Account created successfully');
    router.push('/');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    storeLogout();
    toast.success('Logged out');
    router.push('/');
  };

  return { user, token, login, register, logout, isLoggedIn: !!user, isAdmin: user?.role === 'admin' };
}
