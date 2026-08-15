import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './index.css'
import { AdminAppProvider } from './contexts/AdminAppContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ui/ToastContext'
import AppErrorBoundary from './components/AppErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <AdminAppProvider>
              <App />
            </AdminAppProvider>
          </ToastProvider>
        </AuthProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
