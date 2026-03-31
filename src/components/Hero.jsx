import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src="/hero-board.png"
        alt="Picnic basket on a sunny day"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pb-12">
        <img
          src="/logo-badge.png"
          alt="Picnic Social badge"
          className="w-24 md:w-32 mx-auto mb-6 brightness-0 invert drop-shadow-lg"
        />
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-[0.95] mb-5">
          Beautiful.
          <br />
          <span className="italic text-gold-light">Delicious.</span>
          <br />
          Communal.
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-6 font-light leading-relaxed">
          Let us create an unforgettable food experience for you. Stunning
          charcuterie boxes crafted with care, delivered straight to your door.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/order" className="btn-primary text-lg px-10 py-4 group">
            Order Your Box
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() =>
              document
                .getElementById('menu')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-secondary border-white/40 text-white hover:bg-white/10 text-lg px-10 py-4"
          >
            View Menu
          </button>
        </div>
      </div>

    </section>
  )
}
