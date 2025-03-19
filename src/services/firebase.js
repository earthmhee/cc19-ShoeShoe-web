import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvKFM_jj4eLoWIQyFfJLcguzveUt-imfE",
  authDomain: "shoeshoe-chat.firebaseapp.com",
  projectId: "shoeshoe-chat",
  storageBucket: "shoeshoe-chat.firebasestorage.app",
  messagingSenderId: "850512936129",
  appId: "1:850512936129:web:ec1425b332649328f56840",
  measurementId: "G-MJ5WST3Q19"
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
