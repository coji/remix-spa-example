// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCTNcpaBcn8bzjDGhWVpaQ6YOnZzHECwUE',
  authDomain: 'remix-spa-example.firebaseapp.com',
  projectId: 'remix-spa-example',
  storageBucket: 'remix-spa-example.appspot.com',
  messagingSenderId: '555137498198',
  appId: '1:555137498198:web:380bd830ee347237890ff7',
}

export const app = initializeApp(firebaseConfig)