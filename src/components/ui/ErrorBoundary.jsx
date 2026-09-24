import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[Kenshop ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            {this.state.error?.message?.includes('supabase') ||
             this.state.error?.message?.includes('URL') ? (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-left text-sm">
                <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                  Missing Supabase configuration
                </p>
                <p className="text-yellow-700 dark:text-yellow-400">
                  Create a <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">.env</code> file
                  in the project root with:
                </p>
                <pre className="mt-2 text-xs bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </div>
            ) : null}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
