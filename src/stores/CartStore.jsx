// import { createContext, useContext, useReducer, useEffect } from 'react';

// const CartContext = createContext();

// const initialState = {
//   items: [],
//   totalItems: 0,
//   totalPrice: 0
// };

// function cartReducer(state, action) {
//   switch (action.type) {
//     case 'ADD_TO_CART': {
//       const { product, size, quantity } = action.payload;
//       const existingItemIndex = state.items.findIndex(
//         item => item.productId === product.id && item.sizeId === size.id
//       );

//       let newItems;
//       if (existingItemIndex >= 0) {
//         // Update quantity if item already exists
//         newItems = [...state.items];
//         newItems[existingItemIndex].quantity += quantity;
//       } else {
//         // Add new item
//         newItems = [
//           ...state.items,
//           {
//             id: Date.now().toString(),
//             productId: product.id,
//             productName: product.productname,
//             brand: product.brand,
//             price: product.price,
//             discountedPrice: product.discount ? 
//               (product.discount < 1 ? 
//                 product.price - (product.price * product.discount) : 
//                 product.price - (product.price * (product.discount / 100))
//               ) : 
//               product.price,
//             image: Array.isArray(product.images) ? 
//               product.images[0] : 
//               (typeof product.images === 'string' ? 
//                 JSON.parse(product.images)[0] : 
//                 ''),
//             sizeId: size.id,
//             sizeUS: size.us_size,
//             sizeGender: size.gender,
//             quantity
//           }
//         ];
//       }

//       // Calculate totals
//       const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
//       const totalPrice = newItems.reduce(
//         (sum, item) => sum + (item.discountedPrice * item.quantity), 
//         0
//       );

//       // Save to localStorage
//       localStorage.setItem('cart', JSON.stringify({
//         items: newItems,
//         totalItems,
//         totalPrice
//       }));

//       return {
//         items: newItems,
//         totalItems,
//         totalPrice
//       };
//     }

//     case 'REMOVE_FROM_CART': {
//       const newItems = state.items.filter(item => item.id !== action.payload.itemId);
      
//       // Calculate totals
//       const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
//       const totalPrice = newItems.reduce(
//         (sum, item) => sum + (item.discountedPrice * item.quantity), 
//         0
//       );

//       // Save to localStorage
//       localStorage.setItem('cart', JSON.stringify({
//         items: newItems,
//         totalItems,
//         totalPrice
//       }));

//       return {
//         items: newItems,
//         totalItems,
//         totalPrice
//       };
//     }

//     case 'UPDATE_QUANTITY': {
//       const { itemId, quantity } = action.payload;
//       const newItems = state.items.map(item => 
//         item.id === itemId ? { ...item, quantity } : item
//       );

//       // Calculate totals
//       const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
//       const totalPrice = newItems.reduce(
//         (sum, item) => sum + (item.discountedPrice * item.quantity), 
//         0
//       );

//       // Save to localStorage
//       localStorage.setItem('cart', JSON.stringify({
//         items: newItems,
//         totalItems,
//         totalPrice
//       }));

//       return {
//         items: newItems,
//         totalItems,
//         totalPrice
//       };
//     }

//     case 'CLEAR_CART': {
//       localStorage.removeItem('cart');
//       return initialState;
//     }

//     case 'INITIALIZE_CART': {
//       return action.payload || initialState;
//     }

//     default:
//       return state;
//   }
// }

// export function CartProvider({ children }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   // Load cart from localStorage on initial render
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       dispatch({ 
//         type: 'INITIALIZE_CART', 
//         payload: JSON.parse(savedCart) 
//       });
//     }
//   }, []);

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }