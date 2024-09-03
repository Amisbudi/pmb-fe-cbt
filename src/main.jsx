import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './App.jsx'
import Camera from './Camera.jsx'
import Login from './auth/Login.jsx'
import './index.css'
import Assesment from './pages/Assesment.jsx'

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
    path: "/camera",
    element: <Camera />
  },
  {
    path: "/assesment",
    element: <Assesment />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
