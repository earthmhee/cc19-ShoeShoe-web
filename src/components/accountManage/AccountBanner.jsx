import React from 'react';

function AccountBanner({ userName = 'User', backgroundImage = '/path/to/default-banner.jpg' }) {
  return (
    <div className="w-full relative">

      <div 
        className="w-full h-32 bg-black relative overflow-hidden"
        style={{
          backgroundImage: `url("https://www.ajantashoes.com/pub/media/Mens_Shoes_Collection_Banner.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
 
        <div className="absolute inset-0 flex items-center px-14">
          <h1 className="text-white text-3xl font-bold tracking-wide uppercase">
            {userName}'s Account
          </h1>
        </div>
      </div>
    </div>
  );
}

export default AccountBanner;