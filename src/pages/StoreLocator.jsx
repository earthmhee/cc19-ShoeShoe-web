import React from 'react';
import useStores from '../hooks/useStore';
import StoreSearch from '../components/storeLocator/StoreSeach';
import StoreList from '../components/storeLocator/StoreList';
import StoreMap from '../components/storeLocator/StoreMap';
import StoreDetails from '../components/storeLocator/StoreDetails';

const StoreLocator = () => {
  const { 
    filteredStores, 
    searchTerm, 
    setSearchTerm, 
    activeStore, 
    setActiveStore,
    mapCenter,
    mapZoom,
    handleStoreSelect
  } = useStores();

  const handleMarkerClick = (store) => {
    setActiveStore(store);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header>
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-800">Store Location</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar: Search & Store List */}
          <div className="w-full lg:w-1/3">
            {/* Search Box */}
            <StoreSearch 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />

            {/* Store List */}
            <StoreList 
              stores={filteredStores} 
              activeStore={activeStore} 
              onStoreClick={handleStoreSelect} 
            />
          </div>

          {/* Right side: Map and store details */}
          <div className="w-full lg:w-2/3">
            {/* Map Container */}
            <StoreMap 
              stores={filteredStores} 
              mapCenter={mapCenter} 
              mapZoom={mapZoom} 
              onMarkerClick={handleMarkerClick} 
            />

            {/* Store Details */}
            <div className="mt-6">
              <StoreDetails store={activeStore} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreLocator;