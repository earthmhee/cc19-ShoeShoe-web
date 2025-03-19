// src/services/firebase-auth.js
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  setDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
} from 'firebase/auth';
import { 
  getFunctions, 
} from 'firebase/functions';

// Your existing Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvKFM_jj4eLoWIQyFfJLcguzveUt-imfE",
  authDomain: "shoeshoe-chat.firebaseapp.com",
  projectId: "shoeshoe-chat",
  storageBucket: "shoeshoe-chat.firebasestorage.app",
  messagingSenderId: "850512936129",
  appId: "1:850512936129:web:ec1425b332649328f56840",
  measurementId: "G-MJ5WST3Q19"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  app = getApps()[0];
}

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Temporarily use a workaround for Clerk integration
// This will work until you implement the Firebase Cloud Functions
export const integrateClerkWithFirebase = async (getToken) => {
  try {
    // For now, just verify if the user is authenticated with Clerk
    const sessionToken = await getToken();
    
    // This is a temporary solution that allows the app to work
    // without the Firebase functions being deployed yet
    console.log("Successfully checked Clerk token: ", !!sessionToken);
    
    // Return true to indicate that authentication was successful
    // This will allow the app to work without the Firebase functions for now
    return true;
  } catch (error) {
    console.error("Firebase authentication error:", error);
    return false;
  }
};

/**
 * Checks if a user is an admin directly from Firestore
 * This is a temporary solution until the Cloud Functions are implemented
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} - Whether the user is an admin
 */
export const isUserAdmin = async (userId) => {
  try {
    // IMPORTANT: 
    // This will only work if your Firestore rules allow reading the admins collection
    // You will need to temporarily make this collection readable by anyone for testing
    const adminDocRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminDocRef);
    return adminDoc.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    
    // For development/testing, return true to allow admin access
    // REMOVE THIS IN PRODUCTION
    console.log("⚠️ Development mode: Allowing admin access without verification");
    return true;  // Temporary for testing
  }
};

/**
 * Sets a user as admin (temporary solution for testing)
 * @param {string} userId - The user ID to set as admin
 * @param {boolean} isAdmin - Whether to set or unset as admin
 * @returns {Promise<void>}
 */
export const setUserAsAdmin = async (userId, isAdmin = true) => {
  try {
    const adminDocRef = doc(db, 'admins', userId);
    
    if (isAdmin) {
      await setDoc(adminDocRef, { 
        userId, 
        role: 'admin',
        createdAt: new Date()
      });
      console.log(`User ${userId} set as admin`);
    } else {
      // Implement logic to remove admin if needed
    }
  } catch (error) {
    console.error("Error setting admin status:", error);
    throw error;
  }
};

export { db, auth };