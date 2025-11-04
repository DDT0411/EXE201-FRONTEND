import { ApiService } from './api.service';
import {
  Food,
  FoodCategory,
  PaginationParams,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  ApiResponse,
} from '../types/api';

export class FoodService extends ApiService {
  constructor() {
    super('/foods');
  }

  // Get all foods with pagination
  async getFoods(pagination?: PaginationParams): Promise<ApiResponse<Food[]>> {
    return this.getPaginated<Food>('', pagination);
  }

  // Get food by ID
  async getFoodById(id: string): Promise<ApiResponse<Food>> {
    return this.get<Food>(`/${id}`);
  }

  // Get foods by category
  async getFoodsByCategory(categoryId: string, pagination?: PaginationParams): Promise<ApiResponse<Food[]>> {
    return this.getPaginated<Food>(`/category/${categoryId}`, pagination);
  }

  // Search foods
  async searchFoods(query: string, pagination?: PaginationParams): Promise<ApiResponse<Food[]>> {
    return this.getPaginated<Food>(`/search?q=${encodeURIComponent(query)}`, pagination);
  }

  // Get food categories
  async getCategories(): Promise<ApiResponse<FoodCategory[]>> {
    return this.get<FoodCategory[]>('/categories');
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<ApiResponse<FoodCategory>> {
    return this.get<FoodCategory>(`/categories/${id}`);
  }

  // Create new food (admin only)
  async createFood(foodData: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreateResponse<Food>> {
    return this.post<Food>('', foodData);
  }

  // Update food (admin only)
  async updateFood(id: string, foodData: Partial<Food>): Promise<UpdateResponse<Food>> {
    return this.put<Food>(`/${id}`, foodData);
  }

  // Delete food (admin only)
  async deleteFood(id: string): Promise<DeleteResponse> {
    return this.delete<{ message: string }>(`/${id}`);
  }

  // Toggle food availability (admin only)
  async toggleAvailability(id: string): Promise<ApiResponse<Food>> {
    return this.patch<Food>(`/${id}/toggle-availability`);
  }

  // Get popular foods
  async getPopularFoods(limit: number = 10): Promise<ApiResponse<Food[]>> {
    return this.get<Food[]>(`/popular?limit=${limit}`);
  }

  // Get recommended foods for user
  async getRecommendedFoods(userId?: string): Promise<ApiResponse<Food[]>> {
    const endpoint = userId ? `/recommended?userId=${userId}` : '/recommended';
    return this.get<Food[]>(endpoint);
  }

  // Get foods by price range
  async getFoodsByPriceRange(
    minPrice: number,
    maxPrice: number,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Food[]>> {
    return this.getPaginated<Food>(`/price-range?min=${minPrice}&max=${maxPrice}`, pagination);
  }

  // Get foods by nutrition criteria
  async getFoodsByNutrition(
    criteria: {
      maxCalories?: number;
      minProtein?: number;
      maxCarbs?: number;
      maxFat?: number;
    },
    pagination?: PaginationParams
  ): Promise<ApiResponse<Food[]>> {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    return this.getPaginated<Food>(`/nutrition?${params.toString()}`, pagination);
  }

  // Upload food image
  async uploadFoodImage(foodId: string, image: File): Promise<ApiResponse<{ imageUrl: string }>> {
    return this.uploadFile<{ imageUrl: string }>(`/${foodId}/image`, image, 'image');
  }

  // Get food reviews/ratings
  async getFoodReviews(foodId: string, pagination?: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated<any>(`/${foodId}/reviews`, pagination);
  }

  // Add food review
  async addFoodReview(foodId: string, review: {
    rating: number;
    comment: string;
  }): Promise<ApiResponse<any>> {
    return this.post<any>(`/${foodId}/reviews`, review);
  }
}
