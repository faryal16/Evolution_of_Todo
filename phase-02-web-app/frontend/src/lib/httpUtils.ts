// HTTP utilities with retry logic for the Todo Web App

// Configuration for retry logic
interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // in milliseconds
  maxDelay: number;  // in milliseconds
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

// Calculate delay with exponential backoff
const calculateDelay = (attempt: number, config: RetryConfig): number => {
  const { baseDelay, maxDelay, backoffMultiplier } = config;
  const delay = baseDelay * Math.pow(backoffMultiplier, attempt - 1);
  return Math.min(delay, maxDelay);
};

// Retry function with exponential backoff
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt >= config.maxRetries + 1) {
        break;
      }

      // Don't retry on certain error types (like 400, 401, 403, 404)
      if (error instanceof Error && error.message.includes('40')) {
        break;
      }

      const delay = calculateDelay(attempt, config);
      console.log(`Request failed, retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries + 1})`);

      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // If all retries failed, throw the last error
  throw lastError;
};

// Fetch with retry logic
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> => {
  return retryRequest(async () => {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }, retryConfig);
};

// Fetch JSON with retry logic
export const fetchJsonWithRetry = async <T>(
  url: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> => {
  const response = await fetchWithRetry(url, options, retryConfig);
  return response.json() as Promise<T>;
};

// Standardized error handling for API calls
export const handleApiCall = async <T>(
  apiCall: () => Promise<T>,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> => {
  try {
    return await retryRequest(apiCall, retryConfig);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};