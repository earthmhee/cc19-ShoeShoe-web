import React, { useState } from 'react';
import Shoecard from '../assets/Shoecard';

function Home() {
  const products = [
    {
      id: 1,
      name: "PUMA Speedcat Go 'For All Time' Red",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿3,500.00"
    },
    {
      id: 2,
      name: "NEW BALANCE 574 RAINIER GREY",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿4,000.00"
    },
    {
      id: 3,
      name: "MIZUNO WAVE RIDER 10 OG WHITE",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿5,500.00"
    },
    {
      id: 4,
      name: "REEBOK M CLUB C 85 WHITE",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿3,290.00"
    },
    {
      id: 5,
      name: "ON Cloudmonster Alloy | Lime",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿7,000.00"
    },
    {
      id: 6,
      name: "NIKE REACTX PEGASUS TRAIL 5 WHEAT",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿6,300.00"
    },
    {
      id: 7,
      name: "PUMA Speedcat Go 'Black'",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿3,500.00"
    },
    {
      id: 8,
      name: "MIZUNO WAVE RIDER 10 OG GREY",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿5,200.00"
    },
    {
      id: 9,
      name: "ON THE ROGER CLUBHOUSE WHITE",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿5,400.00"
    },
    {
      id: 10,
      name: "ON Cloudmonster Alloy | Red",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿7,000.00"
    },
    {
      id: 11,
      name: "ON Cloudmonster Alloy | Pink",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿7,000.00"
    },
    {
      id: 12,
      name: "NIKE REACTX PEGASUS TRAIL 5 OLIVE",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿6,300.00"
    }
  ];

  // State for the mobile carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Calculate how many products to show per mobile page (2 in this case)
  const productsPerPage = 2;
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Functions for mobile carousel navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  // Get visible products for mobile view
  const getVisibleProducts = () => {
    return products.slice(
      currentIndex * productsPerPage, 
      (currentIndex * productsPerPage) + productsPerPage
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <a href="/products" className="text-sm font-medium text-gray-600 hover:text-black underline">
            View All
          </a>
        </div>
      </div>

      {/* Desktop Grid - 6 items per row on larger screens */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {products.map(product => (
            <Shoecard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* Mobile Carousel */}
      <div className="md:hidden">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {getVisibleProducts().map(product => (
              <Shoecard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Carousel Navigation Buttons */}
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md focus:outline-none"
            aria-label="Previous"
          >
            <span className="text-lg font-bold" style={{ position: 'relative', top: '-1px' }}>&lsaquo;</span>
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md focus:outline-none"
            aria-label="Next"
          >
            <span className="text-lg font-bold" style={{ position: 'relative', top: '-1px' }}>&rsaquo;</span>
          </button>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-1">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? 'bg-black' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;