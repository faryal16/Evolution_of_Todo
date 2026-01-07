// Type definitions for the Todo Web App

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt: string; // ISO date string
  lastLoginAt?: string; // ISO date string
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string; // ISO date string
  refreshToken?: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface AuthRequest {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string; // ISO date string
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}