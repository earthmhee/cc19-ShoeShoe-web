import React from 'react';

const AccountDashboard = ({ userData }) => {
  // Default user data if none is provided
  const defaultUserData = {
    name: 'John Doe',
    email: 'JohnD@gmail.com',
    gender: 'Male',
    birthday: '25/8/1965',
    phone: '+66874557776',
    subscribedToNewsletter: false,
  };

  // Use provided userData or default if not available
  const user = userData || defaultUserData;

  return (
    <div className="w-full max-w-4xl">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Account Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user.name.split(' ')[0]}!</p>
      </div>

      {/* Account Overview Section */}
      <div className="border border-gray-200 rounded p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">My Account Information</h2>
          <button className="text-teal-500 hover:text-teal-700 font-medium">
            EDIT
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <p className="text-gray-500 text-sm">Name-Surname</p>
            <p className="text-gray-800">{user.name}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-gray-800">{user.email}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Gender</p>
            <p className="text-gray-800">{user.gender}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Birthday</p>
            <p className="text-gray-800">{user.birthday}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Phone Number</p>
            <p className="text-gray-800">{user.phone}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center">
          <input 
            type="checkbox" 
            id="newsletter" 
            className="h-4 w-4 text-teal-600 border-gray-300 rounded"
            checked={user.subscribedToNewsletter}
            readOnly
          />
          <label htmlFor="newsletter" className="ml-2 text-gray-700">
            Subscribe to the newsletter.
          </label>
        </div>
      </div>
      </div>
  );
};

export default AccountDashboard;