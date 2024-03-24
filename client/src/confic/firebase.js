import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAlQ9uU11c8TvdXzEIdvpj2sDUd5FRJFjE",
  authDomain: "tictactoe-350c4.firebaseapp.com",
  projectId: "tictactoe-350c4",
  storageBucket: "tictactoe-350c4.appspot.com",
  messagingSenderId: "249792316326",
  appId: "1:249792316326:web:f19476a03106f9a10bc567",
  measurementId: "G-45YCY4Y6CB",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
