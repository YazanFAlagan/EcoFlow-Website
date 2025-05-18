import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About EcoFlow</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're dedicated to providing clean, healthy water for families around the world through innovative filtration technology.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img 
                src="/Assets/AboutScre/Aboutus.jpg" 
                alt="EcoFlow Team" 
                className="rounded-lg shadow-md w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, EcoFlow began with a simple mission: to make clean, healthy water accessible to everyone. Our founder, Dr. James Chen, a chemical engineer with a passion for environmental sustainability, recognized the growing problem of water contamination affecting communities worldwide.
              </p>
              <p className="text-gray-700 mb-4">
                After years of research and development, Dr. Chen created a revolutionary filtration system that was not only more effective than existing solutions but also more affordable and easier to use. This breakthrough technology became the foundation of EcoFlow.
              </p>
              <p className="text-gray-700">
                Today, EcoFlow has grown from a small startup to an international company, but our mission remains the same. We continue to innovate and improve our products, driven by our commitment to providing clean water solutions that make a positive impact on people's lives and the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of water filtration technology to create more effective, efficient, and user-friendly solutions.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to environmentally responsible practices in our manufacturing processes and product designs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600">
                We believe in giving back to communities by providing access to clean water through charitable initiatives and educational programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <img 
                src="/Assets/AboutScre/Team.jpg" 
                alt="Dr. James Chen" 
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold">Dr. James Chen</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/Assets/AboutScre/Team.jpg" 
                alt="Sarah Johnson" 
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold">Sarah Johnson</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/Assets/AboutScre/Team.jpg" 
                alt="Michael Torres" 
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold">Michael Torres</h3>
              <p className="text-gray-600">Head of Product Development</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/Assets/AboutScre/Team.jpg" 
                alt="Lisa Wang" 
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold">Lisa Wang</h3>
              <p className="text-gray-600">Chief Marketing Officer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the EcoFlow Family</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience the difference clean, filtered water can make in your daily life.
          </p>
          <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
            Explore Our Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;