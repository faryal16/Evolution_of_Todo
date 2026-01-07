// Error handling utilities for the Todo Web App

// Custom error class for API errors
export class APIError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// Error handler function
export const handleAPIError = (error: any): APIError => {
  if (error instanceof APIError) {
    return error;
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new APIError('Network error. Please check your connection.', 0);
  }

  // Handle other errors
  return new APIError(error.message || 'An unknown error occurred', 0);
};

// Format error message for display
export const formatErrorMessage = (error: any): string => {
  if (error instanceof APIError) {
    if (error.status === 0) {
      return 'Network error. Please check your connection.';
    }
    return error.message;
  }

  return error.message || 'An unknown error occurred';
};

// Log error with context
export const logError = (error: any, context: string): void => {
  console.error(`[${context}] Error:`, error);
  // In a real app, you would send this to an error tracking service
};

// Handle validation errors from API responses
export const handleValidationErrors = (error: any): string[] => {
  if (error && error.details && Array.isArray(error.details)) {
    return error.details;
  }
  return [error.message || 'Validation error occurred'];
};