import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AnnouncementBar from './components/AnnouncementBar'
import Home from './pages/Home'
import OrderPage from './pages/OrderPage'
import Confirmed from './pages/Confirmed'

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<OrderPage key={location.key} />} />
        <Route path="/confirmed" element={<Confirmed />} />
      </Routes>
      <Footer />
    </>
  )
}
