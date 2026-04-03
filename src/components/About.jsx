import { asset } from '../utils/assetUrl'

export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl shadow-rose-lg overflow-hidden">
              <img
                src={asset('/about-board.png')}
                alt="Picnic Social charcuterie close-up"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-100 rounded-2xl -z-10" />
          </div>

          <div>
            <p className="text-rose-400 font-medium uppercase tracking-widest text-sm mb-3">
              Our Story
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-warm-dark mb-6">
              Made with Love in Windsor
            </h2>
            <div className="space-y-4 text-warm-gray leading-relaxed text-lg">
              <p>
                Picnic Social was born from a simple idea: food brings people
                together. We believe that every gathering deserves something
                special — something that makes people pause, smile, and reach in
                for more.
              </p>
              <p>
                Each charcuterie box we create is a labor of love. We hand-select
                premium artisan cheeses, cured meats, fresh fruits, and
                thoughtful accompaniments to create an experience that&apos;s as
                visually stunning as it is delicious.
              </p>
              <p>
                Based in Windsor, Ontario, we&apos;re proud to serve our local
                community with beautiful, delicious, and communal food
                experiences.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-8">
              <div>
                <p className="font-display text-3xl font-bold text-rose-500">
                  2,500+
                </p>
                <p className="text-warm-gray text-sm">Boxes Delivered</p>
              </div>
              <div className="w-px h-12 bg-rose-200" />
              <div>
                <p className="font-display text-3xl font-bold text-rose-500">
                  5.0
                </p>
                <p className="text-warm-gray text-sm">Average Rating</p>
              </div>
              <div className="w-px h-12 bg-rose-200" />
              <div>
                <p className="font-display text-3xl font-bold text-rose-500">
                  100%
                </p>
                <p className="text-warm-gray text-sm">Made Fresh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
