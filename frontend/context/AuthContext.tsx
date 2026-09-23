import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, User } from '../services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const { user: me } = await api.auth.me();
          setUser(me);
        }
      } catch {
        // Token invalid / expired — clear it
        await AsyncStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: t, user: u } = await api.auth.login(email, password);
    await AsyncStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { token: t, user: u } = await api.auth.register(name, email, password);
    await AsyncStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
