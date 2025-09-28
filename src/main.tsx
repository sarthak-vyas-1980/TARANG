// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import './glassmorphism.css';
import 'leaflet/dist/leaflet.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  
    <App />
  
);
