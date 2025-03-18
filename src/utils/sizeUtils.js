export const sizeMap = [
    { id: 1, us_size: 7, gender: 'Men' },
    { id: 2, us_size: 8, gender: 'Men' },
    { id: 3, us_size: 9, gender: 'Men' },
    { id: 4, us_size: 10, gender: 'Men' },
    { id: 5, us_size: 11, gender: 'Men' },
    { id: 6, us_size: 12, gender: 'Men' },
    { id: 7, us_size: 13, gender: 'Men' },
    { id: 8, us_size: 6, gender: 'Women' },
    { id: 9, us_size: 7, gender: 'Women' },
    { id: 10, us_size: 8, gender: 'Women' },
    { id: 11, us_size: 9, gender: 'Women' },
    { id: 12, us_size: 10, gender: 'Women' },
    { id: 13, us_size: 11, gender: 'Women' },
  ];
  
  export const getSizeById = (sizeId) => {
    return sizeMap.find(size => size.id === sizeId) || null;
  };
  
  export const getSizesByGender = (gender) => {
    if (gender.toLowerCase() === 'unisex') {
      return sizeMap;
    }
    return sizeMap.filter(size => size.gender === gender);
  };