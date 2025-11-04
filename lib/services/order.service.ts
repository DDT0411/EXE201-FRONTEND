import { ApiService } from './api.service';
import {
  Order,
  OrderItem,
  PaginationParams,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  ApiResponse,
} from '../types/api';

export class OrderService extends ApiService {
  constructor() {
    super('/orders');
  }

  // Get all orders for current user
  async getOrders(pagination?: PaginationParams): Promise<ApiResponse<Order[]>> {
    return this.getPaginated<Order>('', pagination);
  }

  // Get order by ID
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`/${id}`);
  }

  // Create new order
  async createOrder(orderData: {
    items: OrderItem[];
    deliveryAddress?: string;
    notes?: string;
    paymentMethod: 'cash' | 'card' | 'online';
  }): Promise<CreateResponse<Order>> {
    return this.post<Order>('', orderData);
  }

  // Update order status (admin only)
  async updateOrderStatus(id: string, status: Order['status']): Promise<UpdateResponse<Order>> {
    return this.patch<Order>(`/${id}/status`, { status });
  }

  // Cancel order
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return this.patch<Order>(`/${id}/cancel`, { reason });
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status'], pagination?: PaginationParams): Promise<ApiResponse<Order[]>> {
    return this.getPaginated<Order>(`/status/${status}`, pagination);
  }

  // Get user's order history
  async getOrderHistory(userId: string, pagination?: PaginationParams): Promise<ApiResponse<Order[]>> {
    return this.getPaginated<Order>(`/user/${userId}`, pagination);
  }

  // Calculate order total
  async calculateTotal(items: OrderItem[]): Promise<ApiResponse<{ total: number; breakdown: any }>> {
    return this.post<{ total: number; breakdown: any }>('/calculate-total', { items });
  }

  // Apply discount code
  async applyDiscount(orderId: string, discountCode: string): Promise<ApiResponse<{ discount: number; newTotal: number }>> {
    return this.post<{ discount: number; newTotal: number }>(`/${orderId}/discount`, { discountCode });
  }

  // Get order tracking info
  async getOrderTracking(id: string): Promise<ApiResponse<{
    status: Order['status'];
    estimatedDelivery?: string;
    trackingNumber?: string;
    updates: Array<{
      status: string;
      timestamp: string;
      message: string;
    }>;
  }>> {
    return this.get<any>(`/${id}/tracking`);
  }

  // Rate order
  async rateOrder(orderId: string, rating: {
    foodRating: number;
    deliveryRating: number;
    comment?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>(`/${orderId}/rate`, rating);
  }

  // Get order analytics (admin only)
  async getOrderAnalytics(dateRange?: {
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topFoods: Array<{ foodId: string; name: string; quantity: number }>;
  }>> {
    const params = dateRange ? { ...dateRange } : {};
    return this.get<any>('/analytics', params);
  }

  // Reorder previous order
  async reorder(orderId: string): Promise<CreateResponse<Order>> {
    return this.post<Order>(`/${orderId}/reorder`);
  }

  // Get delivery estimate
  async getDeliveryEstimate(address: string): Promise<ApiResponse<{
    estimatedTime: number; // in minutes
    deliveryFee: number;
  }>> {
    return this.post<{ estimatedTime: number; deliveryFee: number }>('/delivery-estimate', { address });
  }
}
