import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Studio from './pages/Studio.jsx'
import Result from './pages/Result.jsx'
import History from './pages/History.jsx'
import Pricing from './pages/Pricing.jsx'
import './index.css'

function AppRoutes() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const shop = params.get('shop')
  if (shop) localStorage.setItem('vc_shop', shop)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/studio/:productId" element={<Studio />} />
      <Route path="/result" element={<Result />} />
      <Route path="/history" element={<History />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
