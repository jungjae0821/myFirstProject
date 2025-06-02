// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import RNStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp4VY6efrHlKZr8Mlc0s1qoqeC7ZfOGPc",
  authDomain: "myfirstproject-6a90e.firebaseapp.com",
  projectId: "myfirstproject-6a90e",
  storageBucket: "myfirstproject-6a90e.firebasestorage.app",
  messagingSenderId: "493140559999",
  appId: "1:493140559999:web:528ab59753229403b4574a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication (인증관련)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(RNStorage),
});
// Firebase의 DB인 Firestore 초기화
export const firestore = getFirestore(app);

// Firebase의 대용량 미디어파일 Storage 초기화 및 가져오기
export const storage = getStorage(app);
