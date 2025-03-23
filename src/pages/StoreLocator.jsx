import React from 'react';
import { Link } from 'react-router';
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
    <div className='container px-8 text-sm p-3 mb-20'>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumbs text-sm mb-5">
        <ul>
          <li className='text-gray-400 hover:text-black'>
            <Link to={"/"}>HOME</Link>
          </li>
          <li>STORE LOCATION</li>
        </ul>
      </div>

      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Store Locations</h1>
      
      {/* Main layout using CSS Grid with explicit template areas */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(250px, 300px) 1fr',
          gridTemplateAreas: '"sidebar map" "sidebar details"',
          columnGap: '20px',
          rowGap: '20px'
        }}
        className="hidden md:grid" // Hide on mobile, show on desktop
      >
        {/* Sidebar area */}
        <div style={{ gridArea: 'sidebar', position: 'relative', zIndex: 10 }}>
          <StoreSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <div className="mt-4">
            <StoreList
              stores={filteredStores}
              activeStore={activeStore}
              onStoreClick={handleStoreSelect}
            />
          </div>
        </div>
        
        {/* Map area */}
        <div style={{ gridArea: 'map', position: 'relative', zIndex: 5, height: '400px' }}>
          <div className="w-full h-full rounded-lg overflow-hidden">
            <StoreMap
              stores={filteredStores}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>
        
        {/* Details area */}
        <div style={{ gridArea: 'details', position: 'relative', zIndex: 10 }}>
          <StoreDetails store={activeStore} />
        </div>
      </div>
      
      {/* Mobile layout - stacked vertically */}
      <div className="md:hidden flex flex-col space-y-6">
        {/* Mobile search and list */}
        <div>
          <StoreSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <div className="mt-4">
            <StoreList
              stores={filteredStores}
              activeStore={activeStore}
              onStoreClick={handleStoreSelect}
            />
          </div>
        </div>
        
        {/* Mobile map */}
        <div className="h-[350px] w-full rounded-lg overflow-hidden">
          <StoreMap
            stores={filteredStores}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            onMarkerClick={handleMarkerClick}
          />
        </div>
        
        {/* Mobile details */}
        <div>
          <StoreDetails store={activeStore} />
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;