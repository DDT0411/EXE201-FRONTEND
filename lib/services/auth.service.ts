import { ApiService } from './api.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ApiResponse,
} from '../types/api';

export class AuthService extends ApiService {
  constructor() {
    super('/auth');
  }

  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/login', credentials);
    
    // Store token in localStorage if login successful
    if (response.success && response.data.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
      }
    }
    
    return response;
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/register', userData);
    
    // Store token in localStorage if registration successful
    if (response.success && response.data.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
      }
    }
    
    return response;
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return this.get<User>('/profile');
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>('/profile', userData);
  }

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.put<{ message: string }>('/change-password', data);
  }

  // Logout user
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await this.post<{ message: string }>('/logout');
    
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
    
    return response;
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.post<{ token: string }>('/refresh', { refreshToken });
    
    // Update token in localStorage
    if (response.success && response.data.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }
    }
    
    return response;
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/forgot-password', { email });
  }

  // Reset password
  async resetPassword(data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/reset-password', data);
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/verify-email', { token });
  }

  // Resend verification email
  async resendVerification(): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/resend-verification');
  }
}
