import axios from 'axios';
import { Product, Cart, CartItem, Order } from '../types';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  // Cart
  async createCart(): Promise<Cart> {
    const response = await axios.post(`${API_URL}/cart`);
    return response.data;
  },

  async getCart(cartId: string): Promise<Cart> {
    const response = await axios.get(`${API_URL}/cart/${cartId}`);
    return response.data;
  },

  async addToCart(cartId: string, productId: string, quantity: number = 1): Promise<void> {
    await axios.post(`${API_URL}/cart/${cartId}/items`, {
      product_id: productId,
      quantity
    });
  },

  async updateCartItem(cartId: string, productId: string, quantity: number): Promise<void> {
    await axios.put(`${API_URL}/cart/${cartId}/items/${productId}?quantity=${quantity}`);
  },

  async removeFromCart(cartId: string, productId: string): Promise<void> {
    await axios.delete(`${API_URL}/cart/${cartId}/items/${productId}`);
  },

  // Orders
  async createOrder(orderData: {
    cart_id: string;
    customer_name: string;
    email: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
  }): Promise<Order> {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  }
};

export default api;