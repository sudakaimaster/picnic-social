import Hero from '../components/Hero'
import Products from '../components/Products'
import HowItWorks from '../components/HowItWorks'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Gallery from '../components/Gallery'

export default function Home() {
  return (
    <main>
      <Hero />
      <Products />
      <HowItWorks />
      <About />
      <Testimonials />
      <Gallery />
    </main>
  )
}
