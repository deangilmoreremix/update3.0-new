import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';

// API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// API error interface
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

// Request interceptor type
export type RequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

// Response interceptor type
export type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;

// Error interceptor type
export type ErrorInterceptor = (error: AxiosError) => Promise<AxiosError>;

// API client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  defaultHeaders?: Record<string, string>;
  onError?: (error: ApiError) => void;
  onUnauthorized?: () => void;
  onServerError?: () => void;
}

// Request retry configuration
interface RetryConfig {
  attempts: number;
  delay: number;
  maxDelay: number;
  backoffFactor: number;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private retryConfig: RetryConfig;
  private readonly config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.retryConfig = {
      attempts: config.retryAttempts || 3,
      delay: config.retryDelay || 1000,
      maxDelay: 10000,
      backoffFactor: 2
    };

    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for adding auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Add tenant context if available
        const tenantId = this.getTenantId();
        if (tenantId) {
          config.headers = config.headers || {};
          config.headers['X-Tenant-ID'] = tenantId;
        }

        // Add request timestamp
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = this.generateRequestId();
        config.headers['X-Timestamp'] = new Date().toISOString();

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling common responses
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Transform response to standard format
        return {
          ...response,
          data: this.transformResponse(response.data)
        };
      },
      async (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  private async handleResponseError(error: AxiosError): Promise<never> {
    const { response, config } = error;
    
    if (!response) {
      // Network error
      throw this.createApiError('NETWORK_ERROR', 'Network connection failed');
    }

    const { status, data } = response;

    // Handle specific status codes
    switch (status) {
      case 401:
        this.config.onUnauthorized?.();
        throw this.createApiError('UNAUTHORIZED', 'Authentication required');

      case 403:
        throw this.createApiError('FORBIDDEN', 'Access denied');

      case 404:
        throw this.createApiError('NOT_FOUND', 'Resource not found');

      case 422:
        const validationErrors = this.extractValidationErrors(data);
        throw this.createApiError('VALIDATION_ERROR', 'Validation failed', validationErrors);

      case 429:
        // Rate limiting - implement retry with backoff
        if (this.shouldRetry(config)) {
          await this.delay(this.calculateRetryDelay(config));
          return this.axiosInstance.request(config);
        }
        throw this.createApiError('RATE_LIMITED', 'Too many requests');

      case 500:
      case 502:
      case 503:
      case 504:
        this.config.onServerError?.();
        
        // Retry server errors
        if (this.shouldRetry(config)) {
          await this.delay(this.calculateRetryDelay(config));
          return this.axiosInstance.request(config);
        }
        
        throw this.createApiError('SERVER_ERROR', 'Internal server error');

      default:
        throw this.createApiError('UNKNOWN_ERROR', `HTTP ${status}: ${error.message}`);
    }
  }

  private shouldRetry(config: any): boolean {
    const retryCount = config.__retryCount || 0;
    return retryCount < this.retryConfig.attempts;
  }

  private calculateRetryDelay(config: any): number {
    const retryCount = config.__retryCount || 0;
    config.__retryCount = retryCount + 1;
    
    const delay = Math.min(
      this.retryConfig.delay * Math.pow(this.retryConfig.backoffFactor, retryCount),
      this.retryConfig.maxDelay
    );
    
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private transformResponse(data: any): ApiResponse {
    // If already in correct format, return as-is
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    // Transform to standard format
    return {
      data,
      success: true
    };
  }

  private extractValidationErrors(data: any): ApiError[] {
    if (Array.isArray(data?.errors)) {
      return data.errors.map((error: any) => ({
        code: 'VALIDATION_ERROR',
        message: error.message || error,
        field: error.field
      }));
    }

    if (typeof data?.message === 'string') {
      return [{
        code: 'VALIDATION_ERROR',
        message: data.message
      }];
    }

    return [];
  }

  private createApiError(code: string, message: string, details?: any): ApiError {
    const error: ApiError = { code, message, details };
    this.config.onError?.(error);
    return error;
  }

  private getAuthToken(): string | null {
    // Try to get token from localStorage, sessionStorage, or other storage
    return localStorage.getItem('auth_token') || 
           sessionStorage.getItem('auth_token') || 
           null;
  }

  private getTenantId(): string | null {
    return localStorage.getItem('tenant_id') || null;
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // File upload with progress
  async upload<T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.axiosInstance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      }
    });

    return response.data;
  }

  // Batch requests
  async batch<T = any>(requests: Array<{
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    url: string;
    data?: any;
    config?: AxiosRequestConfig;
  }>): Promise<ApiResponse<T[]>> {
    const promises = requests.map(request => {
      switch (request.method) {
        case 'get':
          return this.get(request.url, request.config);
        case 'post':
          return this.post(request.url, request.data, request.config);
        case 'put':
          return this.put(request.url, request.data, request.config);
        case 'patch':
          return this.patch(request.url, request.data, request.config);
        case 'delete':
          return this.delete(request.url, request.config);
        default:
          throw new Error(`Unsupported method: ${request.method}`);
      }
    });

    try {
      const results = await Promise.allSettled(promises);
      const data = results.map(result => 
        result.status === 'fulfilled' ? result.value.data : null
      );

      return {
        data,
        success: true
      };
    } catch (error) {
      throw this.createApiError('BATCH_ERROR', 'Batch request failed');
    }
  }

  // Add custom interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): number {
    return this.axiosInstance.interceptors.request.use(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): number {
    return this.axiosInstance.interceptors.response.use(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): number {
    return this.axiosInstance.interceptors.response.use(undefined, interceptor);
  }

  // Remove interceptors
  removeRequestInterceptor(id: number): void {
    this.axiosInstance.interceptors.request.eject(id);
  }

  removeResponseInterceptor(id: number): void {
    this.axiosInstance.interceptors.response.eject(id);
  }

  // Update configuration
  updateConfig(newConfig: Partial<ApiClientConfig>): void {
    Object.assign(this.config, newConfig);
    
    if (newConfig.baseURL) {
      this.axiosInstance.defaults.baseURL = newConfig.baseURL;
    }
    
    if (newConfig.timeout) {
      this.axiosInstance.defaults.timeout = newConfig.timeout;
    }
  }

  // Get raw axios instance for advanced usage
  getRawInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create default API client instance
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};

// Default configuration for the Smart CRM API
export const defaultApiClient = createApiClient({
  baseURL: process.env.VITE_API_URL || '/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  onError: (error) => {
    console.error('API Error:', error);
  },
  onUnauthorized: () => {
    // Redirect to login or refresh token
    window.location.href = '/login';
  },
  onServerError: () => {
    // Show global error notification
    console.error('Server error occurred');
  }
});
