import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  addToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  salePrice,
  image,
  addToCart
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(id);
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/products/${id}`}>
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover object-center"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center mt-2">
            {salePrice ? (
              <>
                <span className="text-gray-400 line-through mr-2">${price.toFixed(2)}</span>
                <span className="text-red-600 font-bold">${salePrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">${price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;