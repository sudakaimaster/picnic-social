import { Link } from 'react-router-dom'
import { asset } from '../utils/assetUrl'
import {
  Heart,
  Users,
  UsersRound,
  Crown,
  PartyPopper,
  Sparkles,
  Citrus,
  Gift,
  Cake,
} from 'lucide-react'

const charcuterieBoxes = [
  {
    id: 'personal',
    name: 'Petite Box',
    serves: '1',
    price: '$35',
    description:
      'A perfectly portioned personal charcuterie box — ideal for treating yourself or gifting someone special.',
    icon: Heart,
    image: '/box-personal.png',
    gradient: 'from-cream-dark to-rose-100',
  },
  {
    id: 'duo',
    name: 'Duo Box',
    serves: '2',
    price: '$55',
    description:
      'Made for two. Perfect for date night, a cozy evening in, or a thoughtful surprise for someone you love.',
    icon: Users,
    image: '/box-duo.png',
    gradient: 'from-rose-100 to-cream-dark',
  },
  {
    id: 'classic',
    name: 'Classic Box',
    serves: '3',
    price: '$70',
    description:
      'Our go-to box for small gatherings. A beautiful spread of artisan cheeses, cured meats, and accompaniments.',
    icon: UsersRound,
    image: '/box-classic.png',
    gradient: 'from-cream-dark to-rose-200',
  },
  {
    id: 'grand',
    name: 'Grand Box',
    serves: '4–5',
    price: '$95',
    description:
      "An abundant spread that's ideal for family dinners, girls' night, or casual entertaining.",
    icon: Crown,
    image: '/box-grand.png',
    gradient: 'from-rose-100 to-rose-200',
  },
  {
    id: 'party',
    name: 'Party Box',
    serves: '6',
    price: '$115',
    description:
      'The life of the party. A generous assortment to keep everyone grazing happily all evening.',
    icon: PartyPopper,
    image: '/box-party.png',
    gradient: 'from-rose-200 to-rose-300',
  },
  {
    id: 'custom',
    name: 'Custom Board',
    serves: '10+',
    price: 'From $200',
    description:
      "Planning something big? We'll create a custom board tailored to your event, taste, and guest count.",
    icon: Sparkles,
    image: '/box-custom.png',
    gradient: 'from-gold-light to-gold',
  },
]

const specialtyItems = [
  {
    id: 'fruit',
    name: 'Fruit Platter',
    price: 'From $65',
    description:
      'A vibrant, colorful arrangement of fresh seasonal fruits — a refreshing addition to any table.',
    icon: Citrus,
    image: '/platter-fruit.png',
    gradient: 'from-cream-dark to-gold-light',
  },
  {
    id: 'celebration',
    name: 'Celebration Tray',
    price: '$140',
    description:
      'Make any milestone memorable. A stunning tray designed for birthdays, showers, and special occasions.',
    icon: Gift,
    image: '/platter-celebration.png',
    gradient: 'from-rose-100 to-rose-200',
  },
  {
    id: 'watermelon',
    name: 'Watermelon Cake & Platter',
    price: '$250',
    description:
      'Our signature showstopper — a sculpted watermelon cake paired with a full platter. An unforgettable centerpiece.',
    icon: Cake,
    image: '/platter-watermelon.png',
    gradient: 'from-rose-200 to-rose-300',
  },
]

function ProductCard({ item }) {
  const Icon = item.icon
  return (
    <div
      className="group bg-cream rounded-2xl overflow-hidden border border-rose-100
                 hover:shadow-rose-lg transition-all duration-500 hover:-translate-y-1"
    >
      {item.image ? (
        <div className="h-64 sm:h-72 overflow-hidden">
          <img
            src={asset(item.image)}
            alt={item.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div
          className={`h-64 sm:h-72 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
        >
          <Icon className="w-14 h-14 text-white/80" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-semibold">{item.name}</h3>
          <span className="font-display text-lg font-bold text-rose-600 whitespace-nowrap">
            {item.price}
          </span>
        </div>
        {item.serves && (
          <p className="text-warm-light text-sm font-medium mb-3">
            Serves {item.serves}
          </p>
        )}
        <p className="text-warm-gray text-sm leading-relaxed mb-5">
          {item.description}
        </p>
        <Link
          to={`/order?box=${item.id}`}
          className="inline-flex items-center text-rose-500 font-medium text-sm
                     hover:text-rose-700 transition-colors group-hover:gap-2 gap-1"
        >
          Order Now
          <span className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  )
}

export default function Products() {
  return (
    <section id="menu" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-rose-400 font-medium uppercase tracking-widest text-sm mb-3">
            Our Menu
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-warm-dark mb-4">
            Choose Your Box
          </h2>
          <p className="text-warm-gray text-lg">
            Each box is handcrafted with premium ingredients and arranged to be
            as beautiful as it is delicious.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {charcuterieBoxes.map((box) => (
            <ProductCard key={box.id} item={box} />
          ))}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-rose-400 font-medium uppercase tracking-widest text-sm mb-3">
            Something Special
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-warm-dark mb-4">
            Specialty Platters
          </h2>
          <p className="text-warm-gray text-lg">
            Beyond the box — unique creations for celebrations and gatherings
            that deserve a little extra.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialtyItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
