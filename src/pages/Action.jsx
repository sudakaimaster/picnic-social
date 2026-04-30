import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { APPS_SCRIPT_URL } from '../config'

export default function Action() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const ranRef = useRef(false)
  const [errorMsg, setErrorMsg] = useState('')

  const action = params.get('action') || ''
  const order = params.get('order') || ''
  const token = params.get('token') || ''

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    if (!action || !order || !token) {
      navigate(`/confirmed?status=error&order=${encodeURIComponent(order)}&message=${encodeURIComponent('Missing parameters.')}`, { replace: true })
      return
    }

    const run = async () => {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            type: 'action',
            action,
            order,
            token,
          }),
        })

        // With no-cors we can't read the body, so we optimistically trust the call succeeded.
        // The script performs the action server-side and sends emails.
        void res

        const status = action === 'approve' ? 'approved' : 'declined'
        navigate(
          `/confirmed?status=${status}&order=${encodeURIComponent(order)}`,
          { replace: true }
        )
      } catch (err) {
        setErrorMsg(err.message || 'Something went wrong.')
        setTimeout(() => {
          navigate(
            `/confirmed?status=error&order=${encodeURIComponent(order)}&message=${encodeURIComponent(err.message || 'Something went wrong.')}`,
            { replace: true }
          )
        }, 1500)
      }
    }

    run()
  }, [action, order, token, navigate])

  return (
    <main className="min-h-screen pt-28 pb-20 bg-cream">
      <div className="container-custom max-w-xl">
        <div className="rounded-3xl p-8 md:p-12 text-center border-2 border-rose-200 bg-rose-50/60">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
          </div>
          <h1 className="font-display text-3xl font-bold text-warm-dark mb-3">
            {action === 'approve' ? 'Approving order...' : action === 'decline' ? 'Declining order...' : 'Processing...'}
          </h1>
          {order && (
            <p className="text-sm text-warm-light mb-3 tracking-wide">
              Order # <span className="font-semibold text-warm-dark">{order}</span>
            </p>
          )}
          <p className="text-warm-gray">
            {errorMsg || 'Please wait a moment while we confirm the action.'}
          </p>
        </div>
      </div>
    </main>
  )
}
