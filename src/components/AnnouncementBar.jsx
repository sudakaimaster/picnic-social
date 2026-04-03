import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Flower2 } from 'lucide-react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500 text-white text-center text-sm py-2.5 px-4 relative">
      <Link
        to="/order"
        className="inline-flex items-center gap-2 hover:underline font-medium"
      >
        <Flower2 className="w-4 h-4" />
        <span>
          Mother&apos;s Day Collection — <strong>The Bloom Bundles</strong> — Limited
          Quantities! Order by May 8th
        </span>
        <span className="hidden sm:inline">→</span>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); setVisible(false) }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
