import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductDetailPageProps {
  products: Product[];
  addToCart: (productId: string, quantity: number) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ products, addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Find the product by ID
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct || null);
    setIsLoading(false);
  }, [id, products]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you are looking for does not exist.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full rounded-lg shadow-md"
          />
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2 md:pl-8">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6">
            {product.sale_price ? (
              <div className="flex items-center">
                <span className="text-gray-400 line-through text-xl mr-3">${product.price.toFixed(2)}</span>
                <span className="text-red-600 text-3xl font-bold">${product.sale_price.toFixed(2)}</span>
                <span className="ml-3 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                  {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mb-8">
            <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
              Quantity
            </label>
            <div className="flex w-1/3">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="bg-gray-200 px-3 py-2 rounded-l hover:bg-gray-300"
              >
                -
              </button>
              <input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={handleQuantityChange}
                className="border text-center w-full"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-3 py-2 rounded-r hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Category: {product.category}</li>
              <li>Premium quality materials</li>
              <li>Easy installation</li>
              <li>Long-lasting filtration</li>
              <li>Removes contaminants and impurities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;