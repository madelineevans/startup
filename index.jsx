import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Import global CSS files (should happen after react and bootstrap imports)
import './src/layouts/RootLayout.css';