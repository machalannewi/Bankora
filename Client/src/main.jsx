import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TransactionProvider } from '@/contexts/TransactionContext';

createRoot(document.getElementById('root')).render(

  <NotificationProvider>
    <BrowserRouter>
      <TransactionProvider>
        <App />
      </TransactionProvider>
    </BrowserRouter>
  </NotificationProvider>
)
