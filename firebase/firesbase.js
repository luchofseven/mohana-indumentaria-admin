import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  onSnapshot,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqVSpn9ZPsDfPRdxWQRmZ8Lg2AoCPv_2o",
  authDomain: "mohana-8f0d5.firebaseapp.com",
  projectId: "mohana-8f0d5",
  storageBucket: "mohana-8f0d5.appspot.com",
  messagingSenderId: "337831298949",
  appId: "1:337831298949:web:72f89095da381d2d5566ec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Firestore

const db = getFirestore();

export const onGetProducts = (callback) =>
  onSnapshot(collection(db, "products"), callback);

export const getProduct = (id) => getDoc(doc(db, "products", id));

export const saveProduct = (name, price, img, stock) =>
  addDoc(collection(db, "products"), { name, price, img, stock });

export const deleteProduct = (id) => deleteDoc(doc(db, "products", id));

export const updateProduct = (id, newFields) =>
  updateDoc(doc(db, "products", id), newFields);

//Authentication
const auth = getAuth();

export const getUserAuth = async (email, password) => {
  let userAuth = await signInWithEmailAndPassword(auth, email, password);
  return userAuth;
};

export const userSingOut = () => {
  let userSingOut = signOut(auth);
  return userSingOut;
};
