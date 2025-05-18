import React from 'react';
import { Link } from 'react-router-dom';
import { Cart } from '../types';

interface CartPageProps {
  cart: Cart | null;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, updateCartItem, removeFromCart }) => {
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cart Items */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart.items.map(item => {
                const product = item.product;
                const price = product.sale_price || product.price;
                
                return (
                  <tr key={item.product_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <img className="h-16 w-16 object-cover" src={product.image} alt={product.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${price.toFixed(2)}</div>
                      {product.sale_price && (
                        <div className="text-xs text-gray-500 line-through">${product.price.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateCartItem(item.product_id, item.quantity - 1)}
                          className="bg-gray-200 px-2 py-1 rounded-l hover:bg-gray-300"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 border-t border-b">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                          className="bg-gray-200 px-2 py-1 rounded-r hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Cart Summary */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Subtotal</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Shipping and taxes calculated at checkout</p>
        </div>
        
        {/* Checkout Button */}
        <div className="border-t border-gray-200 px-6 py-4">
          <Link
            to="/checkout"
            className="w-full block text-center bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </Link>
          <Link
            to="/products"
            className="w-full block text-center text-blue-600 py-3 mt-2 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;