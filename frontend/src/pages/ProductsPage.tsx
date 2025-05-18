import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface ProductsPageProps {
  products: Product[];
  addToCart: (productId: string) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products, addToCart }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const categories = ['all', ...new Set(products.map(product => product.category.toLowerCase()))];
  
  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category.toLowerCase() === categoryFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      {/* Filters */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-full ${
                categoryFilter === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.sale_price}
              image={product.image}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">No products found in this category.</p>
      )}
    </div>
  );
};

export default ProductsPage;