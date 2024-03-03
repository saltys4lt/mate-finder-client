import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCFuPlrInzpJ8cuH1nJtHYnfBjkTYsLcPI',
  authDomain: 'squad-link-bd8c4.firebaseapp.com',
  databaseURL: 'https://squad-link-bd8c4-default-rtdb.firebaseio.com',
  projectId: 'squad-link-bd8c4',
  storageBucket: 'squad-link-bd8c4.appspot.com',
  messagingSenderId: '125818653376',
  appId: '1:125818653376:web:ca97bf3d565979478e7b25',
  measurementId: 'G-RGJGRQJN8Y',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
