import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDkZMtn_4_iaKH6YcBtpFI_CkdBrmpIvsQ",
    authDomain: "coloc-aae6f.firebaseapp.com",
    projectId: "coloc-aae6f",
    storageBucket: "coloc-aae6f.appspot.com",
    messagingSenderId: "706317549668",
    appId: "1:706317549668:web:16eac75fb6368e909c1f71"
};

export const COLOCATION_COLLECTION = 'colocations';
export const TODO_COLLECTION = 'todos';
export const USERS_COLLECTION = 'profiles';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

// Initialize Storage
export const storage = getStorage(app);

