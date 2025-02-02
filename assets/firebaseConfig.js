// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCGSY-CKYrlV_ukEtMs9pqMj4uIAbIb2lo",
  authDomain: "the-86-gang.firebaseapp.com",
  databaseURL: "https://the-86-gang-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "the-86-gang",
  storageBucket: "the-86-gang.firebasestorage.app",
  messagingSenderId: "420976488314",
  appId: "1:420976488314:web:34570c0b3a8baaf55cb0c3",
  measurementId: "G-H50V831HW4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { database, analytics };