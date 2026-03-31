import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { asset } from '../utils/assetUrl'

export default function Footer() {
  return (
    <footer className="bg-warm-dark text-white/80">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <img
              src={asset('/logo-script.png')}
              alt="Picnic Social"
              className="h-10 w-auto brightness-0 invert mb-4"
            />
            <p className="text-sm leading-relaxed mb-6">
              The Art of Charcuterie. Creating beautiful, delicious experiences
              for Windsor and beyond.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/ps.picnic_social/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                           hover:bg-rose-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/ps.picnic.social/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                           hover:bg-rose-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-rose-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#menu"
                  className="hover:text-rose-300 transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="hover:text-rose-300 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/#gallery"
                  className="hover:text-rose-300 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/order"
                  className="hover:text-rose-300 transition-colors"
                >
                  Order Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-rose-400 flex-shrink-0" />
                <span>Windsor, ON Canada</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a
                  href="tel:5199844174"
                  className="hover:text-rose-300 transition-colors"
                >
                  (519) 984-4174
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a
                  href="mailto:ps.picnic.social@gmail.com"
                  className="hover:text-rose-300 transition-colors"
                >
                  ps.picnic.social@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Service Area
            </h4>
            <p className="text-sm leading-relaxed mb-4">
              Proudly serving the Windsor area with delivery and pickup options.
            </p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5
                         rounded-full text-sm font-medium hover:bg-rose-600 transition-colors"
            >
              Order Now
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Picnic Social. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
