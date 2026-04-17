import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Flower2, ArrowRight } from 'lucide-react'
import { asset } from '../utils/assetUrl'

const slides = [
  { src: '/bloom-slide-1.png', alt: 'Grand Bloom Bundle — Mother\'s Day Collection' },
  { src: '/bloom-slide-2.png', alt: 'The Bloom Bundle — Mother\'s Day Collection' },
]

export default function BloomBundles() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-cream to-rose-50/50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-rose-lg">
            <div className="relative w-full">
              {slides.map((slide, i) => (
                <img
                  key={i}
                  src={asset(slide.src)}
                  alt={slide.alt}
                  className={`w-full h-auto transition-opacity duration-700 ease-in-out ${
                    i === current ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                  }`}
                />
              ))}
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-rose-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Limited Quantities
            </div>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-rose-400 mb-3">
              <Flower2 className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Mother&apos;s Day Collection
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-warm-dark mb-4 leading-tight">
              The Bloom Bundles
            </h2>
            <p className="text-warm-gray text-lg leading-relaxed mb-3">
              Curated grazing paired with fresh tulips — the perfect gift for
              the special woman in your life. A beautiful combination of our
              handcrafted charcuterie and seasonal blooms.
            </p>
            <p className="text-warm-dark font-medium mb-1">
              Starting at <span className="font-display text-2xl font-bold text-rose-500">$95</span>
            </p>
            <p className="text-rose-500 text-sm font-medium mb-6">
              Limited Mother&apos;s Day release — Order by May 8th
            </p>
            <Link
              to="/order"
              className="btn-primary text-lg px-8 py-3.5 group inline-flex"
            >
              Pre-Order Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
