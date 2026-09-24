import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ShoppingCart, MessageCircle, User, Sun, Moon, Menu, X,
  Package, LogOut, Settings, PlusCircle, List, ShoppingBag
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useCart } from '../../contexts/CartContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { totalCount } = useCart()
  const { currency, changeCurrency, CURRENCIES } = useCurrency()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    try {
      await signOut()
      toast.success('Signed out')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    }
    setProfileOpen(false)
    setMenuOpen(false)
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-colors hover:text-brand-500 ${
        location.pathname === to ? 'text-brand-500' : 'text-gray-600 dark:text-gray-400'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Kenshop home">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-lg leading-none">K</span>
            </div>
            <span className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">
              Ken<span className="text-brand-500">shop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLink('/browse', 'Browse')}
            {user && navLink('/my-listings', 'My Listings')}
            {user && navLink('/orders', 'Orders')}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Currency selector */}
            <select
              value={currency}
              onChange={e => changeCurrency(e.target.value)}
              className="hidden sm:block text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-400 cursor-pointer"
              aria-label="Select currency"
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="btn-ghost p-2 relative" aria-label={`Cart, ${totalCount} items`}>
              <ShoppingCart size={18} />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalCount > 9 ? '9+' : totalCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {/* Messages */}
                <Link to="/messages" className="btn-ghost p-2 hidden sm:flex" aria-label="Messages">
                  <MessageCircle size={18} />
                </Link>

                {/* Sell button */}
                <Link to="/sell" className="btn-primary py-1.5 px-3 text-sm hidden sm:flex">
                  <PlusCircle size={16} />
                  Sell
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Profile menu"
                    aria-expanded={profileOpen}
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                        <User size={14} className="text-brand-600 dark:text-brand-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-[100px] truncate">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 card shadow-lg z-50 py-1 animate-slide-up">
                        <Link to={`/profile/${user.id}`} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <User size={15} /> My Profile
                        </Link>
                        <Link to="/my-listings" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <List size={15} /> My Listings
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <ShoppingBag size={15} /> Orders
                        </Link>
                        <Link to="/messages" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <MessageCircle size={15} /> Messages
                        </Link>
                        <Link to="/settings" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <Settings size={15} /> Settings
                        </Link>
                        <hr className="my-1 border-gray-100 dark:border-gray-800" />
                        <button onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-1.5 px-3">Log In</Link>
                <Link to="/signup" className="btn-primary text-sm py-1.5 px-3">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden btn-ghost p-2"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-3 space-y-1 animate-slide-up">
            <Link to="/browse" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Browse</Link>
            {user && <Link to="/sell" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10">+ Sell an Item</Link>}
            {user && <Link to="/messages" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Messages</Link>}
            {user && <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Orders</Link>}
            {!user && <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Log In</Link>}
            {!user && <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50">Sign Up</Link>}
            <div className="px-3 pt-2">
              <select
                value={currency}
                onChange={e => changeCurrency(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-400 focus:outline-none"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
