import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-base leading-none">K</span>
              </div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                Ken<span className="text-brand-500">shop</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Buy and sell anything — new, used, or vintage. Your marketplace for everything.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Marketplace</h3>
            <ul className="space-y-2">
              {[['Browse', '/browse'], ['Sell an Item', '/sell'], ['Categories', '/browse']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account</h3>
            <ul className="space-y-2">
              {[['Login', '/login'], ['Sign Up', '/signup'], ['My Listings', '/my-listings'], ['Orders', '/orders']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Support</h3>
            <ul className="space-y-2">
              {['Help Center', 'Safety Tips', 'Privacy Policy', 'Terms of Service'].map(label => (
                <li key={label}>
                  <span className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-brand-500 transition-colors">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} Kenshop. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
            Made with <Heart size={12} className="text-brand-400" aria-hidden="true" /> for buyers &amp; sellers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
