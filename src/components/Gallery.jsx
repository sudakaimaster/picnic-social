import { asset } from '../utils/assetUrl'

const images = [
  { src: '/gallery-1.png', alt: 'Charcuterie board with pansies and white chocolate' },
  { src: '/gallery-2.png', alt: 'Charcuterie boxes with edible flowers and salami roses' },
  { src: '/gallery-3.png', alt: 'Exotic fruit platter with dragon fruit' },
  { src: '/gallery-10.png', alt: 'Live edge board with grapes and salami roses' },
  { src: '/gallery-5.png', alt: 'Personal charcuterie box with honey' },
  { src: '/gallery-6.png', alt: 'Overhead charcuterie board with salami roses' },
  { src: '/gallery-7.png', alt: 'Close-up charcuterie with cucumber flower' },
  { src: '/gallery-9.png', alt: 'Colorful charcuterie board with salami roses and vegetables' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-rose-400 font-medium uppercase tracking-widest text-sm mb-3">
            Gallery
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-warm-dark mb-4">
            Our Creations
          </h2>
          <p className="text-warm-gray text-lg">
            Every box is a work of art. Here&apos;s a glimpse of what we&apos;ve
            crafted.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {images.map((img, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden group cursor-pointer
                         hover:shadow-rose-lg transition-all duration-500"
            >
              <div className="relative w-full aspect-square">
                <img
                  src={asset(img.src)}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/ps.picnic_social/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-500 font-medium hover:text-rose-700 transition-colors"
          >
            Follow us on Instagram for more &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
