import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { asset } from '../utils/assetUrl'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navBg =
    scrolled || !isHome || mobileOpen
      ? 'bg-white/95 backdrop-blur-md shadow-sm'
      : 'bg-transparent'

  const textColor =
    scrolled || !isHome || mobileOpen ? 'text-warm-dark' : 'text-white'

  const showDarkLogo = scrolled || !isHome || mobileOpen

  const scrollToSection = (id) => {
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-8 opacity-100'
        } ${isHome ? 'bg-transparent' : 'bg-warm-dark'}`}
      >
        <div className="container-custom flex items-center justify-end gap-5 h-8 text-xs">
          <a
            href="tel:5199844174"
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">(519) 984-4174</span>
          </a>
          <a
            href="mailto:ps.picnic.social@gmail.com"
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span className="hidden sm:inline">ps.picnic.social@gmail.com</span>
          </a>
        </div>
      </div>
      <nav className={`transition-all duration-300 ${navBg}`}>
        <div className="container-custom flex items-center justify-between h-20">
        <Link to="/" className="flex-shrink-0">
          <img
            src={asset('/logo-script.png')}
            alt="Picnic Social"
            className={`h-14 md:h-12 w-auto transition-all duration-300 ${
              showDarkLogo ? '' : 'brightness-0 invert'
            }`}
          />
        </Link>

        <div className={`hidden md:flex items-center gap-8 ${textColor}`}>
          <button
            onClick={() => scrollToSection('menu')}
            className="hover:text-rose-400 transition-colors font-medium"
          >
            Menu
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-rose-400 transition-colors font-medium"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="hover:text-rose-400 transition-colors font-medium"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="hover:text-rose-400 transition-colors font-medium"
          >
            Gallery
          </button>
          <Link to="/order" className="btn-primary">
            Order Now
          </Link>
        </div>

        <button
          className={`md:hidden ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-rose-100 px-6 pb-6 pt-2">
          <button
            onClick={() => scrollToSection('menu')}
            className="block w-full text-left py-3 text-warm-dark hover:text-rose-500 font-medium"
          >
            Menu
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-3 text-warm-dark hover:text-rose-500 font-medium"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left py-3 text-warm-dark hover:text-rose-500 font-medium"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="block w-full text-left py-3 text-warm-dark hover:text-rose-500 font-medium"
          >
            Gallery
          </button>
          <Link to="/order" className="btn-primary w-full mt-4">
            Order Now
          </Link>
        </div>
      )}
      </nav>
    </div>
  )
}
