import { Task, TaskRequest, UpdateTaskRequest, AuthRequest, AuthResponse } from '@/types';

const API_BASE_URL = ''; // Relative paths for Next.js rewrites
const AUTH_BASE_URL = ''; // Relative paths for auth endpoints

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to include auth token in headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Authentication API
export const authAPI = {
  signup: async (userData: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Signup failed! status: ${response.status}`);
      }

      const data = await response.json();
      const authData = data.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }

      return {
        token: authData.token,
        user: { ...authData.user, id: authData.user.id, createdAt: authData.user.created_at || authData.user.createdAt },
        expiresAt: authData.expires_at || authData.expiresAt,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Login failed! status: ${response.status}`);
      }

      const data = await response.json();
      const authData = data.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }

      return {
        token: authData.token,
        user: { ...authData.user, id: authData.user.id, createdAt: authData.user.created_at || authData.user.createdAt },
        expiresAt: authData.expires_at || authData.expiresAt,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = getAuthToken();
      if (token) {
        await fetch(`${AUTH_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  },
};

// Task API
export const taskAPI = {
  getTasks: async (status?: 'all' | 'pending' | 'completed', sort?: string): Promise<Task[]> => {
    try {
      let url = `/api/tasks`;
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (sort) params.append('sort', sort);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`Failed to fetch tasks. Status: ${response.status}`);

      const data = await response.json();
      return (data.data?.tasks || []).map((task: any) => ({
        ...task,
        id: task.id?.toString() || '',
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }));
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  createTask: async (taskData: TaskRequest): Promise<Task> => {
    try {
      const response = await fetch(`/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error(`Failed to create task. Status: ${response.status}`);

      const data = await response.json();
      const task = data.data;
      return { ...task, id: task.id?.toString() || '', userId: task.user_id, createdAt: task.created_at, updatedAt: task.updated_at };
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error(`Failed to update task. Status: ${response.status}`);

      const data = await response.json();
      const task = data.data;
      return { ...task, id: task.id?.toString() || '', userId: task.user_id, createdAt: task.created_at, updatedAt: task.updated_at };
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  toggleTaskCompletion: async (id: string, completed: boolean): Promise<Task> => {
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(id)}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error(`Failed to toggle task completion. Status: ${response.status}`);

      const data = await response.json();
      const task = data.data;
      return { ...task, id: task.id?.toString() || '', userId: task.user_id, createdAt: task.created_at, updatedAt: task.updated_at };
    } catch (error) {
      console.error('Toggle task completion error:', error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`Failed to delete task. Status: ${response.status}`);
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },
};

// Export API
const API = { auth: authAPI, tasks: taskAPI };
export default API;
