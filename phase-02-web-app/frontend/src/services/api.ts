import { Task, TaskRequest, UpdateTaskRequest, AuthRequest, AuthResponse } from '@/types';

const API_BASE_URL = ''; // Using relative paths to work with Next.js rewrites
const AUTH_BASE_URL = ''; // Using relative paths for auth endpoints too

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to get user ID from the stored user data or token
const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Backend uses email as user ID
        return user.id || user.userId || user.email;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
  }
  return null;
};

// Helper function to include auth token in headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Authentication API functions
export const authAPI = {
  signup: async (userData: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Try to parse error response as JSON, fallback to text if it fails
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.detail || 'Signup failed');
      }

      const data = await response.json();
      const authData = data.data; // Extract the actual auth data from the response

      // Store token and user info in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }

      return {
        token: authData.token,
        user: {
          ...authData.user,
          // Map backend field names to frontend field names
          id: authData.user.id,
          createdAt: authData.user.created_at || authData.user.createdAt
        },
        expiresAt: authData.expires_at || authData.expiresAt
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Try to parse error response as JSON, fallback to text if it fails
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const authData = data.data; // Extract the actual auth data from the response

      // Store token and user info in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }

      return {
        token: authData.token,
        user: {
          ...authData.user,
          // Map backend field names to frontend field names
          id: authData.user.id,
          createdAt: authData.user.created_at || authData.user.createdAt
        },
        expiresAt: authData.expires_at || authData.expiresAt
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) {
        // If no token, just clear local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
        return;
      }

      const response = await fetch(`${AUTH_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.error('Logout API error:', 'Logout failed');
        // Even if API call fails, still clear local storage
      } else {
        // If the API call was successful, process the response
        await response.json(); // Process the response to ensure it's consumed
      }

      // Clear local storage regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if there's an error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  },
};

// Task API functions
export const taskAPI = {
  getTasks: async (status?: 'all' | 'pending' | 'completed', sort?: string): Promise<Task[]> => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      let url = `/api/${userId}/tasks`;
      const params = new URLSearchParams();

      if (status && status !== 'all') {
        params.append('status', status);
      }
      if (sort) {
        params.append('sort', sort);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          throw new Error('Authentication required');
        }
        // Try to parse error response as JSON, fallback to text if it fails
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.detail || 'Failed to fetch tasks');
      }

      const data = await response.json();
      const tasks = data.data?.tasks || [];
      // Map backend field names to frontend field names
      return tasks.map((task: any) => ({
        ...task,
        id: task.id?.toString() || '',
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  createTask: async (taskData: TaskRequest): Promise<Task> => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/${userId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          throw new Error('Authentication required');
        }
        // Try to parse error response as JSON, fallback to text if it fails
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.detail || 'Failed to create task');
      }

      const data = await response.json();
      const task = data.data;
      // Map backend field names to frontend field names
      return {
        ...task,
        id: task.id?.toString() || '',
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      };
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/${userId}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          throw new Error('Authentication required');
        }
        // Try to parse error response as JSON, fallback to text if it fails
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.detail || 'Failed to update task');
      }

      const data = await response.json();
      const task = data.data;
      // Map backend field names to frontend field names
      return {
        ...task,
        id: task.id?.toString() || '',
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      };
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  toggleTaskCompletion: async (id: string, completed: boolean): Promise<Task> => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/${userId}/tasks/${id}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          throw new Error('Authentication required');
        }
        // Try to parse error response as JSON, fallback to text if it fails
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.detail || 'Failed to toggle task completion');
      }

      const data = await response.json();
      const task = data.data;
      // Map backend field names to frontend field names
      return {
        ...task,
        id: task.id?.toString() || '',
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      };
    } catch (error) {
      console.error('Toggle task completion error:', error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/${userId}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          throw new Error('Authentication required');
        }
        // Try to parse error response as JSON, fallback to text if it fails
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.detail || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },
};

// Main API object
const API = {
  auth: authAPI,
  tasks: taskAPI,
};

export default API;