import React from 'react';

const StoreDetails = ({ store }) => {
  if (!store) return null;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img 
            src={store.image} 
            alt={store.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p>{store.address}</p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <p>{store.phone}</p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>{store.hours}</p>
            </div>
          </div>
          <div className="mt-6">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${store.coordinates[0]},${store.coordinates[1]}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;