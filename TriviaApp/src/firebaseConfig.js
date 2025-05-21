// src/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCdhlk4Iq6gFU6-95E18zjum1x9EdOiP6Y",
  authDomain: "triviapp-a333f.firebaseapp.com",
  projectId: "triviapp-a333f",
  storageBucket: "triviapp-a333f.appspot.com",
  messagingSenderId: "293992371838",
  appId: "1:293992371838:web:cc79d0e2f2adf05d7c6a2f",
  measurementId: "G-XZJFNL36PB"
};

const app = initializeApp(firebaseConfig);

export default app;
