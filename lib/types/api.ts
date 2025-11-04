// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common API error structure
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Food types (based on your project structure)
export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  foods: Food[];
}

// Order types
export interface OrderItem {
  foodId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'online';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Common response types for CRUD operations
export interface CreateResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UpdateResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
