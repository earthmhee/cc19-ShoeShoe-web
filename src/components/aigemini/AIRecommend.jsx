// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// const AIChatModal = () => {
//   const [search, setSearch] = useState("");
//   const [aiResponse, setAiResponse] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [promptOptions, setPromptOptions] = useState([]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     if (isOpen) {
//       fetchPromptOptions();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [aiResponse]);

//   const fetchPromptOptions = async () => {
//     try {
//       const response = await axios.post("http://localhost:8001/api/ai/search", {});
//       if (response.data.options) {
//         setPromptOptions(response.data.options);
//       }
//     } catch (error) {
//       console.error("Prompt Options Error:", error);
//     }
//   };

//   const handleSelectPrompt = (selectedPrompt) => {
//     setSearch(selectedPrompt);
//     handleSearch(selectedPrompt);
//   };

//   const handleSearch = async (query) => {
//     if (!query.trim()) return;
//     setLoading(true);
    
//     setAiResponse((prev) => [...prev, { type: "user", text: query }]);

//     try {
//       const response = await axios.post("http://localhost:8001/api/ai/search", {
//         prompt: query,
//       });
//       const aiText = response.data.response || "AI ไม่สามารถให้คำแนะนำได้";
      
//       setAiResponse((prev) => [...prev, { type: "ai", text: aiText }]);
//     } catch (error) {
//       console.error("AI Error:", error);
//       setAiResponse((prev) => [...prev, { type: "ai", text: "เกิดข้อผิดพลาด กรุณาลองใหม่" }]);
//     }

//     setSearch("");
//     setLoading(false);
//   };

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch(search);
//     }
//   };

//   return (
//     <div className="text-center mt-1">
//       <button
//         onClick={() => setIsOpen(true)}
//         className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition hover:cursor-pointer"
//       >
//         AI Shoe Advisor
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
//           <div className="bg-white w-96 md:w-[500px] lg:w-[600px] rounded-2xl shadow-xl p-5">
//             <div className="flex justify-between items-center border-b pb-2">
//               <h3 className="text-lg font-bold">AI recommends shoes</h3>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-black hover:cursor-pointer text-xl"
//               >
//                 X
//               </button>
//             </div>

//             {promptOptions.length > 0 && (
//               <div className="mt-3 space-y-2">
//                 <p className="text-sm font-semibold text-gray-600">
//                   กรุณาเลือกคำถามที่ต้องการถาม:
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {promptOptions.map((option, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleSelectPrompt(option)}
//                       className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 transition text-sm"
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="h-80 overflow-y-auto mt-3 bg-gray-100 p-3 rounded space-y-2">
//               {aiResponse.length === 0 ? (
//                 <p className="text-gray-500 text-center">Type to start chat...</p>
//               ) : (
//                 aiResponse.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`p-3 rounded-lg w-fit max-w-[80%] ${
//                       msg.type === "user"
//                         ? "bg-blue-200 self-end ml-auto text-right"
//                         : "bg-gray-200 self-start text-left"
//                     }`}
//                   >
//                     {msg.text.split("\n").map((line, i) => (
//                       <p key={i} className="mb-1">{line}</p>
//                     ))}
//                   </div>
//                 ))
//               )}
//               <div ref={chatEndRef} />
//             </div>

//             <div className="mt-3 flex">
//               <input
//                 type="text"
//                 placeholder="Type the name of the shoe..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="w-full p-2 border rounded-l-lg"
//               />
//               <button
//                 onClick={() => handleSearch(search)}
//                 className="bg-black text-white px-3 rounded-r-lg hover:opacity-80 transition hover:cursor-pointer"
//                 disabled={loading}
//               >
//                 {loading ? "⏳" : "📤"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AIChatModal = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [aiResponse, setAiResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [promptOptions, setPromptOptions] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchPromptOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [aiResponse, productSuggestions]);

  const fetchPromptOptions = async () => {
    try {
      const response = await axios.post("http://localhost:8001/api/ai/search", {});
      if (response.data.options) {
        setPromptOptions(response.data.options);
      }
    } catch (error) {
      console.error("Prompt Options Error:", error);
    }
  };

  const handleSelectPrompt = (selectedPrompt) => {
    setSearch(selectedPrompt);
    handleSearch(selectedPrompt);
  };

  // Function to convert product names in text to clickable links
  // Returns both the processed text and the list of mentioned products
  const createProductLinks = (text, products) => {
    if (!products || products.length === 0) return { processedText: text, mentionedProducts: [] };

    let processedText = text;
    
    // Sort products by name length (descending) to avoid partial matches
    // For example, match "Nike Air Max 270" before "Nike Air"
    const sortedProducts = [...products].sort((a, b) => 
      b.name.length - a.name.length
    );

    // Create a map to track which parts have been replaced
    const replacedParts = new Map();
    // Track which products were actually mentioned in the text
    const mentionedProducts = new Set();

    sortedProducts.forEach(product => {
      // Create regex that searches for the product name, case insensitive
      const regex = new RegExp(`(${escapeRegExp(product.name)})`, 'gi');
      
      // Check if the product is mentioned in the text
      if (text.match(regex)) {
        mentionedProducts.add(product);
      }
      
      // Use a function for replacement to avoid replacing parts that have already been replaced
      processedText = processedText.replace(regex, (match, p1, offset) => {
        // Check if this part of the string has already been replaced
        for (let [start, end] of replacedParts.values()) {
          if (offset >= start && offset < end) {
            return match; // This part is already replaced, keep it as is
          }
        }
        
        // Mark this part as replaced
        replacedParts.set(match, [offset, offset + match.length]);
        
        // Return HTML with link
        return `<a href="/product/${product.id}" style="color: #3B82F6; text-decoration: underline;">${match}</a>`;
      });
    });

    return { 
      processedText, 
      mentionedProducts: Array.from(mentionedProducts)
    };
  };

  // Helper function to escape special regex characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    
    setAiResponse((prev) => [...prev, { type: "user", text: query }]);
    setProductSuggestions([]); // Clear previous product suggestions

    try {
      const response = await axios.post("http://localhost:8001/api/ai/search", {
        prompt: query,
      });
      
      const aiText = response.data.response || "AI ไม่สามารถให้คำแนะนำได้";
      const products = response.data.products || [];
      
      // Process text to add product links and get mentioned products
      const { processedText, mentionedProducts } = createProductLinks(aiText, products);
      
      setAiResponse((prev) => [...prev, { 
        type: "ai", 
        text: aiText,
        html: processedText,
        hasProducts: mentionedProducts.length > 0
      }]);
      
      // Only show products that were actually mentioned in the AI's response
      if (mentionedProducts.length > 0) {
        setProductSuggestions(mentionedProducts);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse((prev) => [...prev, { type: "ai", text: "เกิดข้อผิดพลาด กรุณาลองใหม่" }]);
    }

    setSearch("");
    setLoading(false);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(search);
    }
  };

  const handleProductClick = (productId) => {
    setIsOpen(false); // Close the modal
    navigate(`/product/${productId}`); // Navigate to product page
  };

  return (
    <div className="text-center mt-1">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition hover:cursor-pointer"
      >
        AI Shoe Advisor
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden" style={{ width: '800px', maxWidth: '90vw', height: '600px', maxHeight: '90vh' }}>
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4 bg-gray-50">
              <h3 className="text-xl font-bold">AI recommends shoes</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col h-[calc(100%-64px)]">
              {/* Prompt selector */}
              <div className="p-4 border-b">
                <div className="relative">
                  <select 
                    className="w-full py-3 px-4 pr-10 bg-gray-100 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSelectPrompt(e.target.value);
                        // Reset selection after using it
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>กรุณาเลือกคำถามที่ต้องการถาม...</option>
                    {promptOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Chat area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-100" style={{ height: 'calc(100% - 150px)' }}>
                {aiResponse.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-center">เลือกตัวอย่างคำถามหรือพิมพ์คำถามของคุณเพื่อเริ่มสนทนา</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiResponse.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg shadow-sm ${
                          msg.type === "user"
                            ? "bg-blue-100 ml-auto text-right max-w-[80%]"
                            : "bg-white text-left max-w-[80%]"
                        }`}
                      >
                        {msg.type === "ai" && msg.html ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: msg.html }}
                            onClick={(e) => {
                              // Handle clicks on product links
                              if (e.target.tagName === 'A') {
                                e.preventDefault();
                                const href = e.target.getAttribute('href');
                                const productId = href.split('/').pop();
                                handleProductClick(productId);
                              }
                            }}
                            className="text-sm md:text-base leading-relaxed"
                          />
                        ) : (
                          <div className="text-sm md:text-base">
                            {msg.text.split("\n").map((line, i) => (
                              <p key={i} className="mb-1">{line}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Product suggestions */}
                {productSuggestions.length > 0 && (
                  <div className="mt-6 bg-white p-4 rounded-lg border shadow-sm">
                    <h4 className="font-medium text-sm mb-3 text-gray-700">สินค้าแนะนำ:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {productSuggestions.map((product) => (
                        <div 
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition flex flex-col"
                        >
                          <div className="h-24 bg-gray-100 flex-shrink-0 overflow-hidden rounded-lg mb-2 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span>No img</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                            {product.hasDiscount ? (
                              <div>
                                <p className="text-xs font-semibold text-red-600">฿{product.price.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 line-through">฿{product.originalPrice.toLocaleString()}</p>
                              </div>
                            ) : (
                              <p className="text-xs font-semibold">฿{product.price.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              <div className="p-4 border-t bg-white">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="พิมพ์คำถามของคุณที่นี่..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSearch(search)}
                    className="bg-black text-white px-6 py-3 rounded-r-lg hover:opacity-80 transition hover:cursor-pointer flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <span>ส่ง</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatModal;