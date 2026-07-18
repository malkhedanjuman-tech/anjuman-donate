```javascript
// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7-NsTWDQbBBMfEeetmNn1nKCMQfXqDW4",
  authDomain: "anjuman-donate.firebaseapp.com",
  projectId: "anjuman-donate",
  storageBucket: "anjuman-donate.firebasestorage.app",
  messagingSenderId: "254676611895",
  appId: "1:254676611895:web:97bb48de5f2a5d0b5b20b2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy
};
