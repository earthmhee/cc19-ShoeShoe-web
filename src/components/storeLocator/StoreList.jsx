import React from 'react';

const StoreList = ({ stores, activeStore, onStoreClick }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="p-4 bg-gray-100 text-lg font-semibold border-b">
        {stores.length} Stores Found
      </h2>
      <div className="max-h-[500px] overflow-y-auto">
        {stores.map(store => (
          <div 
            key={store.id} 
            className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${activeStore?.id === store.id ? 'bg-blue-50' : ''}`}
            onClick={() => onStoreClick(store)}
          >
            <h3 className="font-bold text-lg">{store.name}</h3>
            <p className="text-gray-600 mt-1">{store.address}</p>
            <p className="text-gray-500 text-sm mt-1">{store.phone}</p>
          </div>
        ))}
        {stores.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No stores found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreList;