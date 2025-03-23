const adminStyles = {
    // Button styles
    button: {
      primary: "px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center",
      secondary: "px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 flex items-center",
      danger: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center",
      icon: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full",
    },
    
    // Card styles
    card: "bg-white rounded-lg shadow overflow-hidden",
    cardHeader: "px-6 py-4 border-b border-gray-200",
    cardTitle: "text-lg font-semibold text-gray-900",
    
    // Table styles
    table: "min-w-full divide-y divide-gray-200",
    tableHeader: "bg-gray-50",
    tableHeaderCell: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
    tableRow: "hover:bg-gray-50",
    tableCell: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
    
    // Pagination styles
    pagination: {
      container: "px-6 py-3 border-t flex justify-between items-center",
      text: "text-sm text-gray-500",
      button: "px-3 py-1 border text-sm font-medium",
      buttonActive: "px-3 py-1 border bg-black text-white",
      buttonDisabled: "px-3 py-1 border bg-gray-100 text-gray-400 cursor-not-allowed",
    }
  };
  
  export default adminStyles;