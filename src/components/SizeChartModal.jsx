import React from 'react';

const SizeChartModal = ({ isOpen, onClose, gender }) => {
  // Size conversion data
  const sizeConversions = {
    US: [6, 7, 8, 9, 10, 11, 12, 13],
    UK: [5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5],
    EU: [39, 40, 41, 42, 43, 44, 45, 46],
    CM: [24, 25, 26, 27, 28, 29, 30, 31],
  };

  if (!isOpen) return null;

  const getRelevantSizes = () => {
    if (gender.toLowerCase() === 'women') {
      // Adjust size ranges for women
      return {
        US: [6, 7, 8, 9, 10, 11],
        UK: [4, 5, 6, 7, 8, 9],
        EU: [36, 37, 38, 39, 40, 41],
        CM: [22.5, 23.5, 24.5, 25.5, 26.5, 27.5],
      };
    }
    return sizeConversions;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Size Chart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left">Region</th>
                {getRelevantSizes().US.map((size, index) => (
                  <th key={index} className="px-4 py-3 text-center">
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(getRelevantSizes()).map(([region, sizes]) => (
                <tr key={region} className="border-b">
                  <td className="px-4 py-3 font-medium">{region}</td>
                  {sizes.map((size, index) => (
                    <td key={index} className="px-4 py-3 text-center">
                      {size}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-2">How to Measure</h3>
            <p>
              1. Stand on a flat surface with your heel against a wall.<br />
              2. Measure from the heel to the tip of your longest toe.<br />
              3. Use this measurement to find your size in the chart above.
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-2">Tips for the Perfect Fit</h3>
            <p>
              • Measure your feet in the afternoon as feet tend to swell during the day.<br />
              • If you're between sizes, go for the larger size.<br />
              • Consider the socks you'll be wearing with the shoes.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;