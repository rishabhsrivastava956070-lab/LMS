import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "loginlms-4c85b",
  storageBucket: "loginlms-4c85b.appspot.com", // ✅ fixed
  messagingSenderId: "430136791296",
  appId: "1:430136791296:web:df151f15e1aa78c34ba3e5",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
