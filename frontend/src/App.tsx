import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutPage from './pages/AboutPage';
import { Product, Cart } from './types';
import api from './services/api';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);

  // Load cart ID from localStorage or create a new cart
  useEffect(() => {
    const storedCartId = localStorage.getItem('ecoflow_cart_id');
    
    const initializeCart = async () => {
      try {
        if (storedCartId) {
          try {
            const cartData = await api.getCart(storedCartId);
            setCart(cartData);
            setCartId(storedCartId);
          } catch (error) {
            console.error('Error loading existing cart, creating new cart:', error);
            const newCart = await api.createCart();
            setCart(newCart);
            setCartId(newCart.id);
            localStorage.setItem('ecoflow_cart_id', newCart.id);
          }
        } else {
          const newCart = await api.createCart();
          setCart(newCart);
          setCartId(newCart.id);
          localStorage.setItem('ecoflow_cart_id', newCart.id);
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
      }
    };
    
    initializeCart();
  }, []);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Function to add an item to the cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!cartId) return;
    
    try {
      await api.addToCart(cartId, productId, quantity);
      // Refresh cart data
      const updatedCart = await api.getCart(cartId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Function to update an item in the cart
  const updateCartItem = async (productId: string, quantity: number) => {
    if (!cartId) return;
    
    try {
      await api.updateCartItem(cartId, productId, quantity);
      // Refresh cart data
      const updatedCart = await api.getCart(cartId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (productId: string) => {
    if (!cartId) return;
    
    try {
      await api.removeFromCart(cartId, productId);
      // Refresh cart data
      const updatedCart = await api.getCart(cartId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Function to clear cart after order is placed
  const clearCart = async () => {
    if (!cartId) return;
    
    try {
      // Create new cart
      const newCart = await api.createCart();
      setCart(newCart);
      setCartId(newCart.id);
      localStorage.setItem('ecoflow_cart_id', newCart.id);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar cartItemCount={cart?.items.length || 0} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={products} addToCart={addToCart} />} />
            <Route path="/products" element={<ProductsPage products={products} addToCart={addToCart} />} />
            <Route path="/products/:id" element={<ProductDetailPage products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateCartItem={updateCartItem} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;