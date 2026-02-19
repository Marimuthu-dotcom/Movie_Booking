import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import "bootstrap-icons/font/bootstrap-icons.css";
import {MoviesProvider} from './context/MoviesProvider';// ✅ import context

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoviesProvider>
      <App />
    </MoviesProvider>
  </StrictMode>,
);
