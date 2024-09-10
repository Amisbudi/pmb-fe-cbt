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
import PackageQuestions from './pages/PackageQuestions.jsx'

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
    path: "/packagequestions",
    element: <PackageQuestions />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
