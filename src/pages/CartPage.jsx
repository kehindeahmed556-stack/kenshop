import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { CATEGORIES } from '../lib/constants'
import EmptyState from '../components/ui/EmptyState'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCart()
  const { display } = useCurrency()
  const navigate = useNavigate()

  const subtotal = items.reduce((sum, i) => sum + i.listing.price * i.qty, 0)
  const currency = items[0]?.listing.currency || 'USD'

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-20 animate-fade-in">
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Browse listings and add items to your cart."
        action={<Link to="/browse" className="btn-primary">Browse Listings</Link>}
      />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ listing, qty }) => {
            const cover = listing.listing_images?.[0]?.url
            const cat = CATEGORIES.find(c => c.id === listing.category)
            return (
              <div key={listing.id} className="card p-4 flex items-center gap-4">
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {cover ? (
                    <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">{cat?.icon || '📦'}</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/listing/${listing.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 truncate block">
                    {listing.title}
                  </Link>
                  <p className="text-brand-600 dark:text-brand-400 font-bold mt-0.5">
                    {display(listing.price, listing.currency)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(listing.id, qty - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => updateQty(listing.id, qty + 1)}
                      disabled={qty >= listing.quantity}
                      className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="text-xs text-gray-400 ml-1">{listing.quantity} available</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {display(listing.price * qty, listing.currency)}
                  </span>
                  <button
                    onClick={() => removeItem(listing.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    aria-label={`Remove ${listing.title} from cart`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4">
              {items.map(({ listing, qty }) => (
                <div key={listing.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="truncate mr-2">{listing.title} ×{qty}</span>
                  <span className="flex-shrink-0">{display(listing.price * qty, listing.currency)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mb-5">
              <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Subtotal</span>
                <span>{display(subtotal, currency)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Shipping & taxes calculated at checkout</p>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full justify-center gap-2 py-3"
            >
              <ShoppingBag size={18} /> Proceed to Checkout
            </button>
            <Link to="/browse" className="btn-ghost w-full justify-center mt-2 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
