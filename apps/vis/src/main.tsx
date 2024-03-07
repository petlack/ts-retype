import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { setupData } from './loader.js';
import './index.css';

setupData().then(
    () => ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    ),
);
