import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAK8ucCl_W1YH-tZAvUn1DXqNSme_KtwdU",
  authDomain: "house-app-5b7f0.firebaseapp.com",
  projectId: "house-app-5b7f0",
  storageBucket: "house-app-5b7f0.appspot.com",
  messagingSenderId: "284044607041",
  appId: "1:284044607041:web:7e137ac3f0255ebe4fd0c0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore()