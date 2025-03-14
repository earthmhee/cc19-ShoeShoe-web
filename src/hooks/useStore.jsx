import { useState, useMemo } from 'react';

const storeData = [
  {
    id: 1,
    name: 'Central World',
    address: '999/9 Rama I Rd, Pathum Wan, Bangkok 10330',
    phone: '+66 2 100 9999',
    hours: 'Mon-Sun: 10:00 AM - 09:00 PM',
    coordinates: [13.7466, 100.5393],
    image: 'https://res.cloudinary.com/dfmqmyop1/image/upload/v1741787433/store-img_2x2_e4xi5a.png',
  },
  {
    id: 2,
    name: 'Siam Paragon',
    address: '991/1 Rama I Rd, Pathum Wan, Bangkok 10330',
    phone: '+66 2 610 8000',
    hours: 'Mon-Sun: 10:00 AM - 09:00 PM',
    coordinates: [13.7466, 100.5345],
    image: 'https://res.cloudinary.com/dfmqmyop1/image/upload/v1741787558/_mg_0794_bjfoqt.jpg',
  },
  {
    id: 3,
    name: 'EmQuartier',
    address: '689 Sukhumvit Rd, Khlong Tan Nuea, Watthana, Bangkok 10110',
    phone: '+66 2 269 1000',
    hours: 'Mon-Sun: 10:00 AM - 09:00 PM',
    coordinates: [13.7307, 100.5690],
    image: 'https://res.cloudinary.com/dfmqmyop1/image/upload/v1741787669/CNB-0045_g6gzxi.jpg',
  },
  {
    id: 4,
    name: 'Terminal 21',
    address: '88 Sukhumvit Road, Khlong Toei, Bangkok 10110',
    phone: '+66 2 663 6000',
    hours: 'Mon-Sun: 10:00 AM - 09:00 PM',
    coordinates: [13.7374, 100.5606],
    image: 'https://res.cloudinary.com/dfmqmyop1/image/upload/v1741925359/b_730_e8878c6e-5cb5-4bff-8a07-0e1d4b1d94df_t6otqf.jpg',
  },
  {
    id: 5,
    name: 'MBK Center',
    address: '444 Phayathai Road, Wang Mai, Pathum Wan, Bangkok 10330',
    phone: '+66 2 620 9000',
    hours: 'Mon-Sun: 10:00 AM - 09:00 PM',
    coordinates: [13.7464, 100.5296],
    image: 'https://res.cloudinary.com/dfmqmyop1/image/upload/v1741787558/_mg_0794_bjfoqt.jpg',
  }
];

export default function useStores() {
  const [stores, setStores] = useState(storeData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStore, setActiveStore] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.7563, 100.5018]); // Bangkok center
  const [mapZoom, setMapZoom] = useState(12);
  
  // Filter stores based on search term
  const filteredStores = useMemo(() => {
    return stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  // Handle store selection
  const handleStoreSelect = (store) => {
    setActiveStore(store);
    setMapCenter(store.coordinates);
    setMapZoom(15);
  };

  return {
    stores,
    filteredStores,
    searchTerm,
    setSearchTerm,
    activeStore,
    setActiveStore,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    handleStoreSelect
  };
}