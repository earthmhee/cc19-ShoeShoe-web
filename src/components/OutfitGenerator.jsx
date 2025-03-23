import React, { useState, useEffect } from 'react';

const OutfitGenerator = ({ product }) => {
  const [outfits, setOutfits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOutfit, setExpandedOutfit] = useState(null);
  
  useEffect(() => {
    // Skip if no product
    if (!product?.id) return;
    
    const fetchOutfits = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Attempting to fetch from:', `/api/outfits/recommendations/${product.id}`);
        
        const response = await fetch(`/api/outfits/recommendations/${product.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to get outfit recommendations: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON format. Check your API endpoint.');
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        // Handle the response format
        if (data.data && data.data.outfits) {
          // This is the expected format for the production API
          setOutfits(data.data.outfits);
        } else if (data.outfits) {
          // Alternative format
          setOutfits(data.outfits);
        } else if (data.success) {
          // Create a fallback outfit when we have a success response but no outfits
          console.log('Creating fallback outfit from success response');
          setOutfits([
            {
              name: "Casual Weekend",
              style: "casual",
              description: `A versatile outfit that pairs well with your ${product.productname}`,
              matchScore: 85,
              items: [
                {
                  type: "top",
                  name: "Cotton T-shirt",
                  brand: "Uniqlo",
                  description: "A comfortable and stylish top"
                },
                {
                  type: "bottom",
                  name: "Slim-fit jeans",
                  brand: "Levi's",
                  description: "Classic jeans that match everything"
                },
                {
                  type: "accessory",
                  name: product.gender === 'Men' ? "Watch" : "Earrings",
                  brand: "Accessories",
                  description: "Complete your look with this accessory"
                }
              ]
            }
          ]);
        } else {
          // No recognizable format
          throw new Error('Unexpected API response format');
        }
      } catch (err) {
        console.error('Error fetching outfit recommendations:', err);
        setError('Could not load outfit recommendations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOutfits();
  }, [product]);
  
  // Function to filter outfits by style
  const getFilteredOutfits = () => {
    if (activeTab === 'all') return outfits;
    return outfits.filter(outfit => outfit.style.toLowerCase() === activeTab.toLowerCase());
  };
  
  // Toggle outfit expansion
  const toggleOutfit = (outfitId) => {
    setExpandedOutfit(expandedOutfit === outfitId ? null : outfitId);
  };
  
  // Function to get emoji for item type
  const getItemEmoji = (itemType, itemName) => {
    // Convert to lowercase for easier comparison
    const itemTypeLower = itemType.toLowerCase();
    const itemNameLower = itemName.toLowerCase();
    
    // For tops
    if (itemTypeLower === 'top') {
      if (itemNameLower.includes('t-shirt') || itemNameLower.includes('tee')) return '👕';
      if (itemNameLower.includes('shirt')) return '👔';
      if (itemNameLower.includes('blouse')) return '👚';
      if (itemNameLower.includes('sweater') || itemNameLower.includes('hoodie')) return '🧥';
      if (itemNameLower.includes('jacket')) return '🧥';
      return '👚';
    }
    
    // For bottoms
    if (itemTypeLower === 'bottom') {
      if (itemNameLower.includes('jeans') || itemNameLower.includes('pants') || itemNameLower.includes('trousers')) return '👖';
      if (itemNameLower.includes('shorts')) return '🩳';
      if (itemNameLower.includes('skirt')) return '👗';
      return '👖';
    }
    
    // For accessories
    if (itemTypeLower === 'accessory') {
      if (itemNameLower.includes('watch')) return '⌚';
      if (itemNameLower.includes('hat') || itemNameLower.includes('cap')) return '🧢';
      if (itemNameLower.includes('necklace')) return '📿';
      if (itemNameLower.includes('earring')) return '🔔';
      if (itemNameLower.includes('belt')) return '🧶';
      if (itemNameLower.includes('sunglasses') || itemNameLower.includes('glasses')) return '👓';
      if (itemNameLower.includes('bag') || itemNameLower.includes('backpack')) return '🎒';
      return '💼';
    }
    
    // Default emoji for unknown item types
    return '🛍️';
  };
  
  // No outfit recommendations found
  if (!isLoading && !error && outfits.length === 0) {
    return null; // Don't show the component if there are no recommendations
  }
  
  return (
    <div className="mt-8 bg-white border rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold">Complete Your Look</h2>
        <p className="text-sm text-gray-300">AI-powered outfit recommendations for your selected shoes</p>
      </div>
      
      {/* Style filter tabs */}
      {outfits.length > 0 && (
        <div className="bg-gray-100 p-2 flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Styles
          </button>
          
          {/* Create unique style tabs based on available outfits */}
          {[...new Set(outfits.map(outfit => outfit.style))].map(style => (
            <button
              key={style}
              onClick={() => setActiveTab(style)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === style ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      <div className="p-4">
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <div className="w-10 h-10 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {getFilteredOutfits().map((outfit, index) => (
              <div 
                key={index} 
                className="border rounded-lg overflow-hidden transition-all"
              >
                {/* Outfit header/summary */}
                <div 
                  className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleOutfit(index)}
                >
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-bold text-lg">{outfit.name}</h3>
                      <div className="ml-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {outfit.matchScore}% Match
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{outfit.description}</p>
                  </div>
                  <div className="text-xl">
                    {expandedOutfit === index ? '▼' : '▶'}
                  </div>
                </div>
                
                {/* Expanded outfit details */}
                {expandedOutfit === index && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-4">Outfit Items</h4>
                        <ul className="space-y-4">
                          {/* Current product (the shoes) */}
                          <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-3xl">👟</div>
                            <div>
                              <div className="font-medium">Shoes</div>
                              <div className="text-sm">{product.productname}</div>
                              <div className="text-xs text-gray-500">Your selected footwear</div>
                            </div>
                          </li>
                          
                          {/* Outfit items */}
                          {outfit.items.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="text-3xl">{getItemEmoji(item.type, item.name)}</div>
                              <div>
                                <div className="font-medium">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                                <div className="text-sm">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  {item.brand}
                                  {item.description && <span className="block mt-1">{item.description}</span>}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitGenerator;