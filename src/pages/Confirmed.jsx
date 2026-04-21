import { useSearchParams, Link } from 'react-router-dom'
import { Check, X, AlertCircle, Info } from 'lucide-react'

const STATUS_CONFIG = {
  approved: {
    title: 'Order Approved!',
    icon: Check,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    defaultMessage: 'The customer has been notified with their confirmation email.',
  },
  declined: {
    title: 'Order Declined',
    icon: X,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    defaultMessage: 'The customer has been notified.',
  },
  already: {
    title: 'Already Processed',
    icon: Info,
    color: 'text-warm-gray',
    bg: 'bg-cream-dark',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100',
    defaultMessage: 'This order has already been processed.',
  },
  error: {
    title: 'Something Went Wrong',
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    defaultMessage: 'Please try again or contact support.',
  },
}

export default function Confirmed() {
  const [params] = useSearchParams()
  const status = params.get('status') || 'error'
  const orderNumber = params.get('order') || ''
  const message = params.get('message') || ''

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.error
  const Icon = config.icon

  return (
    <main className="min-h-screen pt-28 pb-20 bg-cream">
      <div className="container-custom max-w-xl">
        <div className={`rounded-3xl p-8 md:p-12 text-center border-2 ${config.border} ${config.bg}`}>
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${config.iconBg} flex items-center justify-center`}>
            <Icon className={`w-10 h-10 ${config.color}`} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-dark mb-3">
            {config.title}
          </h1>
          {orderNumber && (
            <p className="text-sm text-warm-light mb-3 tracking-wide">
              Order # <span className="font-semibold text-warm-dark">{orderNumber}</span>
            </p>
          )}
          <p className="text-warm-gray mb-8 leading-relaxed">
            {message || config.defaultMessage}
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
