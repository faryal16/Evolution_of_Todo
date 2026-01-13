import { User, AuthSession } from '@/types';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const EXPIRES_KEY = 'expiresAt'; // store backend expiration

// 🔹 Store authentication token, user data, and expiration
export const setAuthData = (token: string, user: User, expiresAt: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  }
};

// 🔹 Get authentication token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') return localStorage.getItem(TOKEN_KEY);
  return null;
};

// 🔹 Get user data
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// 🔹 Get token expiration
export const getTokenExpiration = (): string | null => {
  if (typeof window !== 'undefined') return localStorage.getItem(EXPIRES_KEY);
  return null;
};

// 🔹 Check if token is expired
export const isTokenExpired = (): boolean => {
  const expiresAt = getTokenExpiration();
  if (!expiresAt) return true;
  return Date.now() > new Date(expiresAt).getTime();
};

// 🔹 Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getUser();
  if (!token || !user) return false;
  return !isTokenExpired();
};

// 🔹 Clear authentication data
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  }
};

// 🔹 Get session info
export const getAuthSession = (): AuthSession | null => {
  const token = getAuthToken();
  const user = getUser();
  const expiresAt = getTokenExpiration();
  if (token && user && expiresAt) return { token, user, expiresAt };
  return null;
};

// 🔹 Refresh token (dummy placeholder)
export const refreshToken = async (): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) return false; // nothing to refresh

  // Here you can call backend /auth/refresh if available
  // For now, we just assume token is invalid if expired
  if (isTokenExpired()) {
    clearAuthData();
    return false;
  }
  return true;
};

// 🔹 Check and refresh token if needed
export const checkAndRefreshToken = async (): Promise<boolean> => {
  const refreshed = await refreshToken();
  return refreshed && isAuthenticated();
};
