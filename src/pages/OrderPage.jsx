import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
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
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  User,
  Check,
  ArrowLeft,
  Truck,
  Store,
  Loader2,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react'
import { APPS_SCRIPT_URL } from '../config'

const BOX_OPTIONS = [
  { id: 'personal', name: 'Petite Box', serves: '1', price: '$35', numericPrice: 35, icon: Heart, gradient: 'from-cream-dark to-rose-100' },
  { id: 'duo', name: 'Duo Box', serves: '2', price: '$55', numericPrice: 55, icon: Users, gradient: 'from-rose-100 to-cream-dark' },
  { id: 'classic', name: 'Classic Box', serves: '3', price: '$70', numericPrice: 70, icon: UsersRound, gradient: 'from-cream-dark to-rose-200' },
  { id: 'grand', name: 'Grand Box', serves: '4–5', price: '$95', numericPrice: 95, icon: Crown, gradient: 'from-rose-100 to-rose-200' },
  { id: 'party', name: 'Party Box', serves: '6', price: '$115', numericPrice: 115, icon: PartyPopper, gradient: 'from-rose-200 to-rose-300' },
  { id: 'custom', name: 'Custom Board', serves: '10+', price: 'From $200', numericPrice: 200, icon: Sparkles, gradient: 'from-gold-light to-gold' },
  { id: 'fruit', name: 'Fruit Platter', serves: null, price: 'From $65', numericPrice: 65, icon: Citrus, gradient: 'from-cream-dark to-gold-light' },
  { id: 'celebration', name: 'Celebration Tray', serves: null, price: '$140', numericPrice: 140, icon: Gift, gradient: 'from-rose-100 to-rose-200' },
  { id: 'watermelon', name: 'Watermelon Cake & Platter', serves: null, price: '$250', numericPrice: 250, icon: Cake, gradient: 'from-rose-200 to-rose-300' },
  { id: 'bloom', name: 'Bloom Bundle', serves: null, price: 'From $95', numericPrice: 95, icon: Heart, gradient: 'from-rose-300 to-rose-500', seasonal: true },
]

const TIME_SLOTS = [
  { id: '9-11', label: '9:00 AM – 11:00 AM' },
  { id: '11-1', label: '11:00 AM – 1:00 PM' },
  { id: '1-3', label: '1:00 PM – 3:00 PM' },
  { id: '3-5', label: '3:00 PM – 5:00 PM' },
  { id: '5-7', label: '5:00 PM – 7:00 PM' },
]

const STEPS = ['Select Box', 'Date & Time', 'Your Details', 'Review']

function Calendar({ selected, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + 2)

  const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  const [viewDate, setViewDate] = useState(startMonth)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const monthName = viewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const canGoPrev =
    year > startMonth.getFullYear() ||
    (year === startMonth.getFullYear() && month > startMonth.getMonth())

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1)
    if (prev >= startMonth) setViewDate(prev)
  }
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))

  const isSelected = (date) => {
    if (!date || !selected) return false
    return date.toDateString() === selected.toDateString()
  }

  const isDisabled = (date) => {
    if (!date) return true
    return date < minDate
  }

  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-full hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-warm-dark" />
        </button>
        <h3 className="font-display text-lg font-semibold">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-rose-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-warm-dark" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-warm-light py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => (
          <button
            key={i}
            disabled={isDisabled(date)}
            onClick={() => date && !isDisabled(date) && onSelect(date)}
            className={`
              aspect-square rounded-full flex items-center justify-center text-sm transition-all
              ${!date ? 'invisible' : ''}
              ${isDisabled(date) ? 'text-warm-light/40 cursor-not-allowed' : 'hover:bg-rose-100 cursor-pointer'}
              ${isSelected(date) ? 'bg-rose-500 text-white hover:bg-rose-600 font-semibold' : ''}
            `}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>

      <p className="text-xs text-warm-light mt-4 text-center">
        Orders require at least 48 hours advance notice.
      </p>
    </div>
  )
}

export default function OrderPage() {
  const [searchParams] = useSearchParams()
  const preselectedBox = searchParams.get('box')

  const [step, setStep] = useState(0)

  const initialCart = {}
  if (preselectedBox) initialCart[preselectedBox] = 1

  const [order, setOrder] = useState({
    cart: initialCart,
    date: null,
    timeslot: '',
    deliveryMethod: 'delivery',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Windsor',
    recipientName: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const updateOrder = (fields) =>
    setOrder((prev) => ({ ...prev, ...fields }))

  const updateCart = (itemId, delta) => {
    setOrder((prev) => {
      const newCart = { ...prev.cart }
      const current = newCart[itemId] || 0
      const next = current + delta
      if (next <= 0) {
        delete newCart[itemId]
      } else {
        newCart[itemId] = next
      }
      return { ...prev, cart: newCart }
    })
  }

  const cartItems = useMemo(() =>
    Object.entries(order.cart)
      .map(([id, qty]) => ({ ...BOX_OPTIONS.find((b) => b.id === id), qty }))
      .filter((item) => item.id),
    [order.cart]
  )

  const cartTotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.numericPrice * item.qty, 0),
    [cartItems]
  )

  const hasFromPrices = cartItems.some((item) => item.price.startsWith('From'))

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return cartItems.length > 0
      case 1:
        return !!order.date && !!order.timeslot
      case 2:
        return (
          order.name &&
          order.email &&
          order.phone &&
          (order.deliveryMethod === 'pickup' || order.address)
        )
      case 3:
        return true
      default:
        return false
    }
  }, [step, order, cartItems])

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')

    const selectedSlot = TIME_SLOTS.find((s) => s.id === order.timeslot)
    const num = `PS-${Date.now().toString(36).toUpperCase()}`
    setOrderNumber(num)

    const itemsSummary = cartItems
      .map((item) => `${item.name} x${item.qty} (${item.price} ea)`)
      .join(', ')

    const payload = {
      orderNumber: num,
      items: itemsSummary,
      total: `${hasFromPrices ? 'From ' : ''}$${cartTotal}`,
      date: order.date
        ? order.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '',
      timeslot: selectedSlot?.label || order.timeslot,
      deliveryMethod: order.deliveryMethod,
      name: order.name,
      recipientName: order.recipientName || '',
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      notes: order.notes,
    }

    if (!APPS_SCRIPT_URL) {
      console.warn('APPS_SCRIPT_URL not configured — skipping submission')
      setSubmitted(true)
      setSubmitting(false)
      return
    }

    try {
      const iframe = document.createElement('iframe')
      iframe.name = 'order-submit-frame'
      iframe.style.display = 'none'
      document.body.appendChild(iframe)

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = APPS_SCRIPT_URL
      form.target = 'order-submit-frame'
      form.style.display = 'none'

      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'payload'
      input.value = JSON.stringify(payload)
      form.appendChild(input)

      document.body.appendChild(form)
      form.submit()

      await new Promise((resolve) => {
        iframe.addEventListener('load', resolve)
        setTimeout(resolve, 4000)
      })

      document.body.removeChild(form)
      document.body.removeChild(iframe)
      setSubmitted(true)
    } catch {
      setSubmitError('Unable to submit your order. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedSlotData = TIME_SLOTS.find((s) => s.id === order.timeslot)

  if (submitted) {
    return (
      <main className="min-h-screen pt-28 pb-20">
        <div className="container-custom max-w-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-rose-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-warm-dark mb-4">
            Order Received!
          </h1>
          {orderNumber && (
            <p className="text-sm text-warm-light mb-3 tracking-wide">
              Order # <span className="font-semibold text-warm-dark">{orderNumber}</span>
            </p>
          )}
          <p className="text-warm-gray text-lg mb-2">
            Thank you, {order.name}! We&apos;ve received your order.
          </p>
          <p className="text-warm-gray mb-8">
            We&apos;ll be in touch at <strong>ps.picnic.social@gmail.com</strong> to
            confirm your order details.
          </p>
          <div className="bg-white rounded-2xl border border-rose-100 p-8 mb-8 text-left">
            <h3 className="font-display text-lg font-semibold mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm text-warm-gray">
              {cartItems.map((item) => (
                <p key={item.id}>
                  <span className="font-medium text-warm-dark">{item.name}</span>{' '}
                  x{item.qty} — {item.price} ea
                </p>
              ))}
              <p className="font-semibold text-warm-dark text-base pt-1">
                Total: {hasFromPrices ? 'From ' : ''}${cartTotal}
              </p>
              <p>
                <span className="font-medium text-warm-dark">Date:</span>{' '}
                {order.date?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p>
                <span className="font-medium text-warm-dark">Time:</span>{' '}
                {selectedSlotData?.label}
              </p>
              <p>
                <span className="font-medium text-warm-dark">Method:</span>{' '}
                {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
              </p>
              {order.deliveryMethod === 'delivery' && (
                <p>
                  <span className="font-medium text-warm-dark">Address:</span>{' '}
                  {order.address}, {order.city}
                </p>
              )}
              {order.notes && (
                <p>
                  <span className="font-medium text-warm-dark">Notes:</span>{' '}
                  {order.notes}
                </p>
              )}
            </div>
          </div>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-dark">
            Place Your Order
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="relative flex items-start justify-between mb-8 max-w-md mx-auto">
          {/* Connector lines */}
          <div className="absolute top-5 left-0 right-0 flex px-[10%]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded transition-colors duration-300 ${
                  i < step ? 'bg-rose-500' : 'bg-rose-100'
                }`}
              />
            ))}
          </div>
          {/* Step circles */}
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center z-10" style={{ width: '20%' }}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${i < step ? 'bg-rose-500 text-white' : ''}
                  ${i === step ? 'bg-rose-500 text-white ring-4 ring-rose-200' : ''}
                  ${i > step ? 'bg-rose-100 text-warm-light' : ''}`}
              >
                {i < step ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span
                className={`text-xs mt-2 font-medium text-center ${
                  i <= step ? 'text-rose-500' : 'text-warm-light'
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-5 md:p-8">
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">
                Build Your Order
              </h2>
              <p className="text-warm-gray mb-5">
                Add one or more items to your order.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BOX_OPTIONS.map((box) => {
                  const Icon = box.icon
                  const qty = order.cart[box.id] || 0
                  return (
                    <div
                      key={box.id}
                      className={`rounded-xl p-4 border-2 transition-all duration-300
                        ${
                          qty > 0
                            ? 'border-rose-500 bg-rose-50 shadow-rose'
                            : 'border-rose-100 bg-cream'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${box.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-sm font-semibold truncate">
                            {box.name}
                            {box.seasonal && (
                              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide bg-rose-500 text-white px-1.5 py-0.5 rounded-full align-middle">
                                Seasonal
                              </span>
                            )}
                          </h3>
                          <p className="text-warm-light text-xs">
                            {box.serves ? `Serves ${box.serves}` : box.seasonal ? 'Mother\'s Day · Order by May 8' : 'Specialty'}
                          </p>
                        </div>
                        <span className="font-display text-sm font-bold text-rose-600 whitespace-nowrap">
                          {box.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => updateCart(box.id, -1)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center
                                     hover:bg-rose-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4 text-rose-600" />
                        </button>
                        <span className="w-8 text-center font-semibold text-warm-dark">{qty}</span>
                        <button
                          onClick={() => updateCart(box.id, 1)}
                          className="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center
                                     hover:bg-rose-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {cartItems.length > 0 && (
                <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="w-4 h-4 text-rose-500" />
                    <span className="font-medium text-warm-dark text-sm">Your Order</span>
                  </div>
                  <div className="space-y-1 text-sm text-warm-gray">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.qty}</span>
                        <span className="font-medium text-warm-dark">
                          ${item.numericPrice * item.qty}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-rose-200 mt-2 pt-2 flex justify-between font-semibold text-warm-dark">
                    <span>{hasFromPrices ? 'Estimated Total' : 'Total'}</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">
                Pick Date & Time
              </h2>
              <p className="text-warm-gray mb-8">
                Choose when you&apos;d like your order.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-5 h-5 text-rose-400" />
                    <h3 className="font-display text-lg font-semibold">
                      Select Date
                    </h3>
                  </div>
                  <Calendar
                    selected={order.date}
                    onSelect={(date) => updateOrder({ date })}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-rose-400" />
                    <h3 className="font-display text-lg font-semibold">
                      Select Time Slot
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => updateOrder({ timeslot: slot.id })}
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300
                          ${
                            order.timeslot === slot.id
                              ? 'border-rose-500 bg-rose-50 shadow-rose'
                              : 'border-rose-100 hover:border-rose-300'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{slot.label}</span>
                          {order.timeslot === slot.id && (
                            <Check className="w-5 h-5 text-rose-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">
                Your Details
              </h2>
              <p className="text-warm-gray mb-8">
                Tell us where to deliver your box.
              </p>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => updateOrder({ deliveryMethod: 'delivery' })}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all
                    ${
                      order.deliveryMethod === 'delivery'
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-rose-100 hover:border-rose-300'
                    }`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="font-medium">Delivery</span>
                </button>
                <button
                  onClick={() => updateOrder({ deliveryMethod: 'pickup' })}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all
                    ${
                      order.deliveryMethod === 'pickup'
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-rose-100 hover:border-rose-300'
                    }`}
                >
                  <Store className="w-5 h-5" />
                  <span className="font-medium">Pickup</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-warm-dark mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={order.name}
                    onChange={(e) => updateOrder({ name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500
                             focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-cream"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-dark mb-1.5">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={order.recipientName}
                    onChange={(e) => updateOrder({ recipientName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500
                             focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-cream"
                    placeholder="Leave blank if same as above"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-dark mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={order.email}
                    onChange={(e) => updateOrder({ email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500
                             focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-cream"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-dark mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={order.phone}
                    onChange={(e) => updateOrder({ phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500
                             focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-cream"
                    placeholder="(519) 000-0000"
                  />
                </div>
                {order.deliveryMethod === 'delivery' && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-warm-dark mb-1.5">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        value={order.address}
                        onChange={(e) =>
                          updateOrder({ address: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500
                                 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-cream"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-dark mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={order.city}
                        onChange={(e) => updateOrder({ city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500
                                 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-cream"
                        placeholder="Windsor"
                      />
                    </div>
                  </>
                )}
                <div
                  className={
                    order.deliveryMethod === 'delivery' ? '' : 'sm:col-span-2'
                  }
                >
                  <label className="block text-sm font-medium text-warm-dark mb-1.5">
                    Special Instructions
                  </label>
                  <textarea
                    value={order.notes}
                    onChange={(e) => updateOrder({ notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500
                             focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-cream resize-none"
                    placeholder="Allergies, preferences, special requests..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-semibold mb-2">
                Review Your Order
              </h2>
              <p className="text-warm-gray mb-5">
                Please confirm everything looks right.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="flex items-center gap-2 text-rose-400 mb-3">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm font-medium">Items</span>
                  </div>
                  <div className="space-y-2">
                    {cartItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-warm-gray text-xs">Qty: {item.qty} &middot; {item.price} ea</p>
                          </div>
                          <span className="font-semibold text-warm-dark">
                            ${item.numericPrice * item.qty}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t border-rose-200 mt-3 pt-2 flex justify-between font-bold text-warm-dark">
                    <span>{hasFromPrices ? 'Estimated Total' : 'Total'}</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-2 text-rose-400 mb-2">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm font-medium">Date & Time</span>
                    </div>
                    <p className="font-medium">
                      {order.date?.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-warm-gray text-sm">
                      {selectedSlotData?.label}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-2 text-rose-400 mb-2">
                      {order.deliveryMethod === 'delivery' ? (
                        <Truck className="w-4 h-4" />
                      ) : (
                        <Store className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {order.deliveryMethod === 'delivery'
                          ? 'Delivery'
                          : 'Pickup'}
                      </span>
                    </div>
                    {order.deliveryMethod === 'delivery' ? (
                      <>
                        <p className="font-medium">{order.address}</p>
                        <p className="text-warm-gray text-sm">{order.city}</p>
                      </>
                    ) : (
                      <p className="font-medium">Curbside Pickup</p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-2 text-rose-400 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </div>
                  <p className="font-medium">{order.name}</p>
                  {order.recipientName && (
                    <p className="text-warm-gray text-sm">
                      Recipient: {order.recipientName}
                    </p>
                  )}
                  <p className="text-warm-gray text-sm">
                    {order.email} &middot; {order.phone}
                  </p>
                  {order.notes && (
                    <p className="text-warm-gray text-sm mt-2 italic">
                      &ldquo;{order.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-rose-100">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-warm-gray hover:text-warm-dark transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            ) : (
              <div />
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {submitError && (
                  <p className="text-red-600 text-sm text-right">{submitError}</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary bg-rose-800 hover:bg-rose-900 shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>Submitting… <Loader2 className="w-5 h-5 ml-1 animate-spin" /></>
                  ) : (
                    <>Confirm Order <Check className="w-5 h-5 ml-1" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
