import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { asset } from '../utils/assetUrl'

export default function Hero() {
  return (
    <section className="relative min-h-screen md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={asset('/hero-board.png')}
        alt="Picnic basket on a sunny day"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-28 md:pt-12 pb-16 md:pb-12">
        <img
          src={asset('/logo-badge.png')}
          alt="Picnic Social badge"
          className="w-16 md:w-32 mx-auto mb-5 md:mb-6 brightness-0 invert drop-shadow-lg"
        />
        <h1 className="font-display text-4xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1] md:leading-[0.95] mb-4 md:mb-5">
          Beautiful.
          <br />
          <span className="italic text-gold-light">Delicious.</span>
          <br />
          Experience.
        </h1>
        <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto mb-6 font-light leading-relaxed">
          Let us create an unforgettable food experience for you. Stunning
          charcuterie boxes crafted with care, delivered straight to your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <Link to="/order" className="btn-primary text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4 group">
            Order Your Box
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() =>
              document
                .getElementById('menu')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-secondary border-white/40 text-white hover:bg-white/10 text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4"
          >
            View Menu
          </button>
        </div>
      </div>

    </section>
  )
}
