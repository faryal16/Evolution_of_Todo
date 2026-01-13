import { User, AuthSession } from '@/types';

// Authentication service for handling user authentication state

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const EXPIRES_KEY = 'expiresAt'; // store backend expiration

// Store authentication token, user data, and expiration
export const setAuthData = (token: string, user: User, expiresAt: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  }
};

// Get authentication token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Get user data
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Get token expiration
export const getTokenExpiration = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(EXPIRES_KEY);
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getUser();
  if (!token || !user) return false;
  return !isTokenExpired();
};

// Clear authentication data
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  }
};

// Get session information
export const getAuthSession = (): AuthSession | null => {
  const token = getAuthToken();
  const user = getUser();
  const expiresAt = getTokenExpiration();

  if (token && user && expiresAt) {
    return { token, user, expiresAt };
  }

  return null;
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
  const session = getAuthSession();
  if (!session) return true;

  const expirationTime = new Date(session.expiresAt).getTime();
  return Date.now() > expirationTime;
};

// Refresh token (placeholder)
export const refreshToken = async (): Promise<boolean> => {
  // Implement backend refresh logic if available
  return true;
};

// Check and refresh token if needed
export const checkAndRefreshToken = async (): Promise<boolean> => {
  if (isTokenExpired()) {
    clearAuthData(); // remove expired token
    return await refreshToken();
  }
  return true;
};
