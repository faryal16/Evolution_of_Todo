import { Task, TaskRequest, UpdateTaskRequest, AuthRequest, AuthResponse } from '@/types';

// 🔹 Backend URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://faryal16-todo-app-backend.hf.space';

// 🔹 Helper: Get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') return localStorage.getItem('authToken');
  return null;
};

// 🔹 Helper: Build headers (always send token if exists)
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// 🔹 Auth API
export const authAPI = {
  signup: async (userData: AuthRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) throw new Error(`Signup failed! Status: ${res.status}`);
    const data = await res.json();
    const authData = data.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }

    return {
      token: authData.token,
      user: { ...authData.user, id: authData.user.id },
      expiresAt: authData.expires_at,
    };
  },

  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) throw new Error(`Login failed! Status: ${res.status}`);
    const data = await res.json();
    const authData = data.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }

    return {
      token: authData.token,
      user: { ...authData.user, id: authData.user.id },
      expiresAt: authData.expires_at,
    };
  },

  logout: async (): Promise<void> => {
    try {
      const token = getAuthToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  },
};

// 🔹 Task API
export const taskAPI = {
  getTasks: async (status?: 'all' | 'pending' | 'completed', sort?: string): Promise<Task[]> => {
    let url = `${API_BASE_URL}/api/tasks`;
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (sort) params.append('sort', sort);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch tasks. Status: ${res.status}`);
    const data = await res.json();
    return (data.data?.tasks || []).map((task: any) => ({
      ...task,
      id: task.id?.toString() || '',
      userId: task.user_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));
  },

  createTask: async (taskData: TaskRequest): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error(`Failed to create task. Status: ${res.status}`);
    const data = await res.json();
    const task = data.data;
    return { ...task, id: task.id?.toString() || '', userId: task.user_id, createdAt: task.created_at, updatedAt: task.updated_at };
  },

  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error(`Failed to update task. Status: ${res.status}`);
    const data = await res.json();
    const task = data.data;
    return { ...task, id: task.id?.toString() || '', userId: task.user_id, createdAt: task.created_at, updatedAt: task.updated_at };
  },

  toggleTaskCompletion: async (id: string, completed: boolean): Promise<Task> => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${encodeURIComponent(id)}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error(`Failed to toggle task completion. Status: ${res.status}`);
    const data = await res.json();
    const task = data.data;
    return { ...task, id: task.id?.toString() || '', userId: task.user_id, createdAt: task.created_at, updatedAt: task.updated_at };
  },

  deleteTask: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete task. Status: ${res.status}`);
  },
};

// 🔹 Export all APIs
const API = { auth: authAPI, tasks: taskAPI };
export default API;
