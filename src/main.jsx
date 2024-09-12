import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './auth/Login.jsx'
import Assesment from './pages/Assesment.jsx'
import Dashboard from './Dashboard.jsx'
import Record from './pages/Record.jsx'
import Admin from './pages/Admin.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/assesment",
    element: <Assesment />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/record",
    element: <Record />
  },
  {
    path: "/admin",
    element: <Admin />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
