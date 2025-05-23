import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartItemCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemCount }) => {
  return (
    <nav className="navbar bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">EcoFlow</Link>
        
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          <Link to="/products" className="hover:text-blue-300">Products</Link>
          <Link to="/about" className="hover:text-blue-300">About</Link>
          <Link to="/cart" className="hover:text-blue-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
              {cartItemCount}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;