import React, { useState } from 'react';
import Shoecard from '../assets/Shoecard';

function Home() {
  const products = [
    {
      id: 1,
      name: "NIKE AIR JORDAN 1",
      description: "If a dog chews shoes whose shoes does he choose?",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿3,700.00"
    },
    {
      id: 2,
      name: "NIKE FIELD GENARAL",
      description: "Classic comfort with modern style for everyday wear.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿3,700.00"
    },
    {
      id: 3,
      name: "SAUCONY Shadow 6000",
      description: "Lightweight design for optimal performance on any surface.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿4,590.00"
    },
    {
      id: 4,
      name: "PUMA x KIDSUPER Graphic",
      description: "Durable waterproof boots for all your outdoor adventures.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿2,000.00"
    },
    {
      id: 5,
      name: "GRAMICCI UNISEX",
      description: "Comfortable canvas shoes perfect for casual outings.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿3,250.00"
    },
    {
      id: 6,
      name: "GRAMICCI UNISEX TECH",
      description: "Premium leather boots that combine style and durability.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿5,450.00"
    },
    {
      id: 7,
      name: "Sandals Premium",
      description: "Breathable design perfect for warm weather and beaches.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿2,450.00"
    },
    {
      id: 8,
      name: "Slip-ons Comfort",
      description: "Easy to wear shoes for a relaxed and casual look.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿3,200.00"
    },
    {
      id: 9,
      name: "Sports Shoes Pro",
      description: "Designed for maximum performance during athletic activities.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿4,100.00"
    },
    {
      id: 10,
      name: "Formal Shoes Elite",
      description: "Elegant design for professional and formal occasions.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿6,750.00"
    },
    {
      id: 11,
      name: "Winter Boots Cozy",
      description: "Insulated boots to keep your feet warm in cold weather.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿5,900.00"
    },
    {
      id: 12,
      name: "Loafers Classic",
      description: "Comfortable slip-on shoes for a smart casual look.",
      image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      price: "฿4,800.00"
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
      {/* Section Header - New Addition */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">New Arrivals</h2>
          <a href="/products" className="text-sm font-medium text-gray-600 hover:text-black underline">
            View All
          </a>
        </div>
        <p className="mt-2 text-gray-500">Discover our latest collection</p>
      </div>

      {/* Desktop Grid - Similar to your existing grid but hidden on mobile */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Shoecard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* Mobile Carousel - New Addition */}
      <div className="md:hidden">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {getVisibleProducts().map(product => (
              <Shoecard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Carousel Navigation Buttons - Using standard HTML/CSS instead of lucide */}
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