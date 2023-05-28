import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { setupData } from './loader.js';
import './index.scss';

setupData().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
