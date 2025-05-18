export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  category: string;
  description?: string;
  image: string;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
  customer_name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}