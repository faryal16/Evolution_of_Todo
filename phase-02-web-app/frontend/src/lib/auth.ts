import { User, AuthSession } from '@/types';

// Authentication service for handling user authentication state

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

// Store authentication token and user data
export const setAuthData = (token: string, user: User, expiresAt: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
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

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  // Check if token is expired
  const user = getUser();
  if (!user) {
    return false;
  }

  // In a real implementation, we would decode the JWT and check the exp claim
  // For now, we'll just check if the token exists
  return true;
};

// Clear authentication data
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Get session information
export const getAuthSession = (): AuthSession | null => {
  const token = getAuthToken();
  const user = getUser();

  if (token && user) {
    // In a real implementation, we would decode the JWT to get the expiration time
    // For now, we'll return a mock session
    return {
      token,
      user,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    };
  }

  return null;
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
  const session = getAuthSession();
  if (!session) {
    return true;
  }

  const expirationTime = new Date(session.expiresAt).getTime();
  const currentTime = new Date().getTime();

  return currentTime > expirationTime;
};

// Refresh token (placeholder implementation)
export const refreshToken = async (): Promise<boolean> => {
  // In a real implementation, we would make a request to refresh the token
  // For now, we'll just return true to indicate success
  return true;
};

// Check and refresh token if needed
export const checkAndRefreshToken = async (): Promise<boolean> => {
  if (isTokenExpired()) {
    return await refreshToken();
  }
  return true;
};