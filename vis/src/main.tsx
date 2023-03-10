import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { setupData } from './loader'
import './index.css'

setupData().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
});
