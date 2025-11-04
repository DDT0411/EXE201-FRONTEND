import axiosInstance from '../axios';
import {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
} from '../types/api';

// Base API service class
export class ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  // Generic GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await axiosInstance.get(`${this.baseUrl}${endpoint}`, { params });
    return response.data;
  }

  // Generic POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  // Generic PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await axiosInstance.put(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  // Generic PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await axiosInstance.patch(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await axiosInstance.delete(`${this.baseUrl}${endpoint}`);
    return response.data;
  }

  // Paginated GET request
  async getPaginated<T>(
    endpoint: string,
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const response = await axiosInstance.get(`${this.baseUrl}${endpoint}`, {
      params: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        sort: pagination.sort,
        order: pagination.order || 'desc',
      },
    });
    return response.data;
  }

  // Upload file
  async uploadFile<T>(endpoint: string, file: File, fieldName: string = 'file'): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await axiosInstance.post(`${this.baseUrl}${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Download file
  async downloadFile(endpoint: string, filename?: string): Promise<void> {
    const response = await axiosInstance.get(`${this.baseUrl}${endpoint}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'download');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
