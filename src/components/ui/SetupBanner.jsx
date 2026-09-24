import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { supabaseConfigured } from '../../lib/supabase'

export default function SetupBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (supabaseConfigured || dismissed) return null

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
        <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        <p className="text-sm text-yellow-800 dark:text-yellow-300 flex-1">
          <span className="font-semibold">Supabase not connected.</span>{' '}
          Create a <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded text-xs">.env</code> file
          with <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded text-xs">VITE_SUPABASE_URL</code> and{' '}
          <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded text-xs">VITE_SUPABASE_ANON_KEY</code> to enable data features.
          {' '}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-200"
          >
            Get your keys →
          </a>
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
