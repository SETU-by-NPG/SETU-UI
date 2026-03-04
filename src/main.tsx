import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from 'sonner'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'font-sans text-sm',
          success: 'border-l-4 border-green-500',
          error: 'border-l-4 border-red-500',
          warning: 'border-l-4 border-amber-500',
          info: 'border-l-4 border-blue-500',
        },
      }}
      richColors
      closeButton
    />
  </React.StrictMode>,
)
