import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Lobby from './pages/Lobby.tsx';
import Personal from './pages/Personal.tsx';
import Wallet from './pages/Wallet.tsx';
import Dashboard from './pages/Dashboard.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Lobby />
      },
      {
        path: "personal",
        element: <Personal />
      },
      {
        path: "wallet",
        element: <Wallet />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
