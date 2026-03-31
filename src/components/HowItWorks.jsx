import { ShoppingBag, CalendarDays, PartyPopper } from 'lucide-react'

const steps = [
  {
    icon: ShoppingBag,
    title: 'Choose Your Box',
    description:
      'Browse our curated selection of charcuterie boxes and pick the perfect one for your occasion.',
  },
  {
    icon: CalendarDays,
    title: 'Pick Date & Time',
    description:
      'Select your preferred delivery date and time slot. We offer flexible scheduling to fit your plans.',
  },
  {
    icon: PartyPopper,
    title: 'Enjoy!',
    description:
      'We deliver your beautifully crafted box right to your door. Unpack, share, and savor every bite.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-rose-400 font-medium uppercase tracking-widest text-sm mb-3">
            Simple & Easy
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-warm-dark mb-4">
            How It Works
          </h2>
          <p className="text-warm-gray text-lg">
            Ordering your perfect charcuterie box is as easy as 1-2-3.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="text-center group">
                <div className="relative mb-8">
                  <div
                    className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-rose-200
                                flex items-center justify-center group-hover:from-rose-200 group-hover:to-rose-300
                                transition-all duration-500 shadow-rose"
                  >
                    <Icon className="w-9 h-9 text-rose-500" />
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full
                               flex items-center justify-center text-sm font-bold
                               md:right-auto md:-left-2"
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-warm-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
