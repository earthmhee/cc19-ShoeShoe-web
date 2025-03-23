import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

//Initialize Firebase only if it hasn't been initialized yet
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

// Initialize Firestore
const db = getFirestore(app);

// Test Firestore connectivity
const testFirestoreConnection = async () => {
  try {
    console.log("Attempting to disable network...");
    await disableNetwork(db);
    console.log("Network disabled successfully");
    
    console.log("Attempting to enable network...");
    await enableNetwork(db);
    console.log("Network enabled successfully - Firestore connection works");
  } catch (error) {
    console.error("Firestore connection test failed:", error);
    console.error("Error details:", error.message, error.code);
  }
};

// Run the test
testFirestoreConnection();

export { db };
