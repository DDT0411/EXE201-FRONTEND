// Export all services
export { ApiService } from './api.service';
export { AuthService } from './auth.service';
export { FoodService } from './food.service';
export { OrderService } from './order.service';

// Create service instances
export const authService = new AuthService();
export const foodService = new FoodService();
export const orderService = new OrderService();
