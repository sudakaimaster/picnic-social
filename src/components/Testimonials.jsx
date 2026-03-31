import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Tess',
    text: "I'll never buy flowers again! You can't eat flowers! Beautiful work. Great service and fast!",
  },
  {
    name: 'Kristine',
    text: "I ordered a charcuterie box for my mom for Mother's Day and it was amazing! She loved it — not only was it delicious — but it was different from the usual flowers, cake, etc. Outstanding job!",
  },
  {
    name: 'Theresa',
    text: 'I cannot rave enough about the amazing charcuterie boxes I have received. They are done up beautifully, excellent quality and jammed pack. Must try the vanilla bean honey!',
  },
  {
    name: 'Rose',
    text: "Thank you again for making a personalized charcuterie board for my bf's bday!! Very affordable… He loved it!!",
  },
  {
    name: 'Kelly',
    text: "We've had quite a few orders from Picnic Social. Every time the experience has been a delight! I would highly recommend one of their charcuterie boxes to anyone!",
  },
  {
    name: 'Jasmine Muise-Mulder',
    text: 'Beautiful presentation! Vibrant array of colours and quality ingredients. Highly recommend!!!',
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-cream-dark/50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-rose-400 font-medium uppercase tracking-widest text-sm mb-3">
            Love Letters
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-warm-dark mb-4">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-rose-100 shadow-sm
                         hover:shadow-rose transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-rose-200 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-warm-gray leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="font-display font-semibold text-warm-dark">
                &mdash; {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
