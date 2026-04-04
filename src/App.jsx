import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AnnouncementBar from './components/AnnouncementBar'
import Home from './pages/Home'
import OrderPage from './pages/OrderPage'

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
      </Routes>
      <Footer />
    </>
  )
}
