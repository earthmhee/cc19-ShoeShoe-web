// import React, { useState, useEffect } from 'react';
// import { Search, Filter, Edit, Trash2, UserCog, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
// import axios from 'axios'
// import AdminLayout from '../../layouts/AdminLayout';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterOptions, setFilterOptions] = useState({
//     role: 'all',
//     status: 'all',
//   });
//   const [sortOption, setSortOption] = useState({ field: 'id', direction: 'asc' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const usersPerPage = 10;
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     firstname: '',
//     lastname: '',
//     phone: '',
//     role: 'Customer'
//   });

//   // Fetch users on component mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);

//       // In a real implementation, you would use your actual API
//       // const response = await axios.get('http://localhost:8001/api/admin/users');

//       // For now, using mock data
//       const mockUsers = [
//         {
//           id: 1,
//           clerkID: 'user_1abc123',
//           username: 'johndoe',
//           firstname: 'John',
//           lastname: 'Doe',
//           email: 'john@example.com',
//           phone: '+66874121234',
//           role: 'Customer',
//           status: 'Active',
//           created_at: '2025-01-15T10:30:00Z'
//         },
//         {
//           id: 2,
//           clerkID: 'user_2def456',
//           username: 'janedoe',
//           firstname: 'Jane',
//           lastname: 'Doe',
//           email: 'jane@example.com',
//           phone: '+66812345678',
//           role: 'Customer',
//           status: 'Active',
//           created_at: '2025-02-02T14:45:00Z'
//         },
//         {
//           id: 3,
//           clerkID: 'user_3ghi789',
//           username: 'adminuser',
//           firstname: 'Admin',
//           lastname: 'User',
//           email: 'admin@example.com',
//           phone: '+66898765432',
//           role: 'Admin',
//           status: 'Active',
//           created_at: '2024-12-05T09:15:00Z'
//         },
//         {
//           id: 4,
//           clerkID: 'user_4jkl012',
//           username: 'someuser',
//           firstname: 'Some',
//           lastname: 'User',
//           email: 'some@example.com',
//           phone: '+66823456789',
//           role: 'Customer',
//           status: 'Inactive',
//           created_at: '2025-01-20T11:20:00Z'
//         },
//         {
//           id: 5,
//           clerkID: 'user_5mno345',
//           username: 'testuser',
//           firstname: 'Test',
//           lastname: 'User',
//           email: 'test@example.com',
//           phone: '+66898901234',
//           role: 'Customer',
//           status: 'Active',
//           created_at: '2025-02-15T16:30:00Z'
//         }
//       ];

//       setUsers(mockUsers);
//       setFilteredUsers(mockUsers);
//       setTotalPages(Math.ceil(mockUsers.length / usersPerPage));
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter and sort users when criteria change
//   useEffect(() => {
//     let result = [...users];

//     // Apply search filter
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       result = result.filter(user =>
//         user.username.toLowerCase().includes(searchLower) ||
//         user.email.toLowerCase().includes(searchLower) ||
//         `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchLower) ||
//         (user.phone && user.phone.includes(searchTerm))
//       );
//     }

//     // Apply role filter
//     if (filterOptions.role !== 'all') {
//       result = result.filter(user => user.role === filterOptions.role);
//     }

//     // Apply status filter
//     if (filterOptions.status !== 'all') {
//       result = result.filter(user => user.status === filterOptions.status);
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       let valueA, valueB;

//       switch (sortOption.field) {
//         case 'username':
//           valueA = a.username.toLowerCase();
//           valueB = b.username.toLowerCase();
//           break;
//         case 'name':
//           valueA = `${a.firstname} ${a.lastname}`.toLowerCase();
//           valueB = `${b.firstname} ${b.lastname}`.toLowerCase();
//           break;
//         case 'email':
//           valueA = a.email.toLowerCase();
//           valueB = b.email.toLowerCase();
//           break;
//         case 'created':
//           valueA = new Date(a.created_at);
//           valueB = new Date(b.created_at);
//           break;
//         default: // id
//           valueA = a.id;
//           valueB = b.id;
//       }

//       if (sortOption.direction === 'asc') {
//         return valueA > valueB ? 1 : -1;
//       } else {
//         return valueA < valueB ? 1 : -1;
//       }
//     });

//     setFilteredUsers(result);
//     setTotalPages(Math.ceil(result.length / usersPerPage));
//   }, [users, searchTerm, filterOptions, sortOption]);

//   // Paginate users
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * usersPerPage,
//     currentPage * usersPerPage
//   );

//   const handleSort = (field) => {
//     setSortOption(prev => ({
//       field,
//       direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   const handleEditUser = (user) => {
//     setSelectedUser(user);
//     setFormData({
//       username: user.username,
//       email: user.email,
//       firstname: user.firstname || '',
//       lastname: user.lastname || '',
//       phone: user.phone || '',
//       role: user.role,
//       status: user.status
//     });
//     setShowUserModal(true);
//   };

//   const handleDeleteClick = (user) => {
//     setUserToDelete(user);
//     setShowConfirmModal(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       // In a real implementation, you would call your API
//       // await axios.delete(`http://localhost:8001/api/admin/users/${userToDelete.id}`);

//       // For now, update the local state
//       setUsers(users.filter(user => user.id !== userToDelete.id));
//       setShowConfirmModal(false);
//       setUserToDelete(null);
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // In a real implementation, you would call your API
//       // const response = await axios.put(`http://localhost:8001/api/admin/users/${selectedUser.id}`, formData);

//       // For now, update the local state
//       const updatedUsers = users.map(user => {
//         if (user.id === selectedUser.id) {
//           return { ...user, ...formData };
//         }
//         return user;
//       });

//       setUsers(updatedUsers);
//       setShowUserModal(false);
//       setSelectedUser(null);
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="flex justify-center items-center h-full">
//           <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
//         </div>
//       </AdminLayout>
//     );
//   };


//     return (
//       <AdminLayout>
//         <div className="mb-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">User Management</h1>
//             <p className="text-gray-600">View and manage user accounts</p>
//           </div>
//         </div>

//         {/* Search and filters */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search size={18} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                 placeholder="Search users by name, email, or phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* Filters */}
//             <div className="flex flex-wrap gap-2">
//               {/* Role filter */}
//               <div className="relative">
//                 <select
//                   value={filterOptions.role}
//                   onChange={(e) => setFilterOptions(prev => ({ ...prev, role: e.target.value }))}
//                   className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                 >
//                   <option value="all">All Roles</option>
//                   <option value="Customer">Customer</option>
//                   <option value="Admin">Admin</option>
//                 </select>
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Filter size={18} className="text-gray-400" />
//                 </div>
//               </div>

//               {/* Status filter */}
//               <div className="relative">
//                 <select
//                   value={filterOptions.status}
//                   onChange={(e) => setFilterOptions(prev => ({ ...prev, status: e.target.value }))}
//                   className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Filter size={18} className="text-gray-400" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Users table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('id')}
//                   >
//                     <div className="flex items-center">
//                       ID
//                       {sortOption.field === 'id' && (
//                         <span className="ml-1">
//                           {sortOption.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('username')}
//                   >
//                     <div className="flex items-center">
//                       Username
//                       {sortOption.field === 'username' && (
//                         <span className="ml-1">
//                           {sortOption.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('name')}
//                   >
//                     <div className="flex items-center">
//                       Name
//                       {sortOption.field === 'name' && (
//                         <span className="ml-1">
//                           {sortOption.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('email')}
//                   >
//                     <div className="flex items-center">
//                       Email
//                       {sortOption.field === 'email' && (
//                         <span className="ml-1">
//                           {sortOption.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('created')}
//                   >
//                     <div className="flex items-center">
//                       Created
//                       {sortOption.field === 'created' && (
//                         <span className="ml-1">
//                           {sortOption.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedUsers.length > 0 ? (
//                   paginatedUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         #{user.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {user.username}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {user.firstname} {user.lastname}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {user.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {user.phone || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin'
//                             ? 'bg-purple-100 text-purple-800'
//                             : 'bg-blue-100 text-blue-800'
//                           }`}>
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                           }`}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(user.created_at)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex items-center justify-end space-x-3">
//                           <button
//                             onClick={() => handleEditUser(user)}
//                             className="text-indigo-600 hover:text-indigo-900"
//                           >
//                             <Edit size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteClick(user)}
//                             className="text-red-600 hover:text-red-900"
//                             disabled={user.role === 'Admin'} // Prevent deleting admins
//                             title={user.role === 'Admin' ? "Cannot delete admin users" : "Delete user"}
//                           >
//                             <Trash2 size={18} className={user.role === 'Admin' ? "opacity-30" : ""} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
//                       No users found matching your criteria
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {filteredUsers.length > usersPerPage && (
//             <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{' '}
//                     <span className="font-medium">
//                       {Math.min(currentPage * usersPerPage, filteredUsers.length)}
//                     </span>{' '}
//                     of <span className="font-medium">{filteredUsers.length}</span> users
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//                     </button>

//                     {/* Page numbers would go here */}
//                     <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                       {currentPage} / {totalPages}
//                     </span>

//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                     >
//                       <span className="sr-only">Next</span>
//                       <ChevronRight className="h-5 w-5" aria-hidden="true" />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Confirmation Modal */}
//         {showConfirmModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//               <div className="text-center">
//                 <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//                 <h3 className="text-lg font-medium text-gray-900 mt-4">Delete User</h3>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Are you sure you want to delete the user "{userToDelete?.username}"? This action cannot be undone.
//                 </p>
//               </div>
//               <div className="mt-6 flex justify-center gap-4">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
//                   onClick={() => setShowConfirmModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700"
//                   onClick={confirmDelete}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit User Modal */}
//         {showUserModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Edit User: {selectedUser?.username}
//               </h3>

//               <form onSubmit={handleFormSubmit}>
//                 <div className="space-y-4">
//                   <div>
//                     <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       name="username"
//                       id="username"
//                       value={formData.username}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       id="email"
//                       value={formData.email}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         name="firstname"
//                         id="firstname"
//                         value={formData.firstname}
//                         onChange={handleFormChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                       />
//                     </div>

//                     <div>
//                       <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         name="lastname"
//                         id="lastname"
//                         value={formData.lastname}
//                         onChange={handleFormChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                       Phone
//                     </label>
//                     <input
//                       type="text"
//                       name="phone"
//                       id="phone"
//                       value={formData.phone}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                       Role
//                     </label>
//                     <select
//                       name="role"
//                       id="role"
//                       value={formData.role}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                     >
//                       <option value="Customer">Customer</option>
//                       <option value="Admin">Admin</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700">
//                       Status
//                     </label>
//                     <select
//                       name="status"
//                       id="status"
//                       value={formData.status}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//                     >
//                       <option value="Active">Active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end gap-4">
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
//                     onClick={() => setShowUserModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-black text-white rounded-md shadow-sm text-sm font-medium hover:bg-gray-800"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </AdminLayout>
//     )
//   }
//   export default UserManagement; 


// src/pages/admin/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import { 
  SearchIcon, 
  FilterIcon, 
  SlidersIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout'

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock customer data
        const mockCustomers = Array.from({ length: 25 }, (_, index) => {
          const id = index + 1;
          const registrationDate = new Date();
          registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 365));
          
          return {
            id,
            name: `Customer ${id}`,
            email: `customer${id}@example.com`,
            phone: `+66${Math.floor(Math.random() * 1000000000)}`,
            registrationDate: registrationDate.toISOString().split('T')[0],
            ordersCount: Math.floor(Math.random() * 10),
            totalSpent: Math.floor(Math.random() * 50000) + 1000
          };
        });
        
        setCustomers(mockCustomers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    return matchesSearch;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    if (typeof valueA === 'string') {
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }
  });

  // Pagination
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center"
              >
                <FilterIcon size={20} className="mr-2" />
                Filters
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="date" className="pl-10 pr-4 py-2 border rounded-md w-full" />
                  </div>
                  <span>to</span>
                  <div className="relative flex-1">
                    <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="date" className="pl-10 pr-4 py-2 border rounded-md w-full" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orders</label>
                <select className="border rounded-md px-4 py-2 w-full">
                  <option value="">All Customers</option>
                  <option value="has_orders">Has Orders</option>
                  <option value="no_orders">No Orders</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
                <div className="flex items-center space-x-2">
                  <input type="number" placeholder="Min" className="border rounded-md px-4 py-2 w-full" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="border rounded-md px-4 py-2 w-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('id')}
                        className="flex items-center"
                      >
                        ID
                        {sortField === 'id' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('name')}
                        className="flex items-center"
                      >
                        Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('email')}
                        className="flex items-center"
                      >
                        Email
                        {sortField === 'email' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('registrationDate')}
                        className="flex items-center"
                      >
                        Registered
                        {sortField === 'registrationDate' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('ordersCount')}
                        className="flex items-center"
                      >
                        Orders
                        {sortField === 'ordersCount' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('totalSpent')}
                        className="flex items-center"
                      >
                        Total Spent
                        {sortField === 'totalSpent' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{customer.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon size={20} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <MailIcon size={16} className="text-gray-400 mr-2" />
                          {customer.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <PhoneIcon size={16} className="text-gray-400 mr-2" />
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.registrationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.ordersCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, sortedCustomers.length)} of {sortedCustomers.length} customers
                </div>
                <div className="flex">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border-t border-b ${
                        currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default CustomerList;