import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { supabase } from '../lib/supabase'
import { COUNTRIES } from '../lib/constants'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const { display } = useCurrency()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '', email: user?.email || '', phone: '',
    address: '', city: '', country: '', postalCode: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.listing.price * i.qty, 0)
  const currency = items[0]?.listing.currency || 'USD'

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.country) e.country = 'Required'
    // Card (mock)
    if (!form.cardName.trim()) e.cardName = 'Required'
    if (!form.cardNumber.trim()) e.cardNumber = 'Required'
    if (!form.expiry.trim()) e.expiry = 'Required'
    if (!form.cvv.trim()) e.cvv = 'Required'
    return e
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // Create order rows (one per cart item)
      const orderRows = items.map(({ listing, qty }) => ({
        buyer_id:    user.id,
        seller_id:   listing.seller_id,
        listing_id:  listing.id,
        quantity:    qty,
        total_price: listing.price * qty,
        currency:    listing.currency,
        status:      'confirmed',
        shipping_address: JSON.stringify({
          fullName: form.fullName, address: form.address,
          city: form.city, country: form.country, postalCode: form.postalCode,
        }),
      }))
      const { error: ordErr } = await supabase.from('orders').insert(orderRows)
      if (ordErr) throw ordErr

      clearCart()
      setSuccess(true)
    } catch (e) {
      toast.error(e.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length && !success) return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <EmptyState
        icon="🛒"
        title="Nothing to checkout"
        description="Add items to your cart first."
        action={<Link to="/browse" className="btn-primary">Browse Listings</Link>}
      />
    </div>
  )

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Your order has been placed. The seller will be in touch soon.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="btn-primary">View Orders</Link>
        <Link to="/browse" className="btn-secondary">Keep Shopping</Link>
      </div>
    </div>
  )

  const field = (id, label, placeholder, type = 'text', opts = {}) => (
    <div className={opts.half ? '' : 'col-span-2 sm:col-span-1'}>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id} type={type} value={form[id]}
        onChange={e => set(id, e.target.value)}
        placeholder={placeholder}
        className={`input ${errors[id] ? 'border-red-400' : ''}`}
        aria-invalid={!!errors[id]}
        {...(opts.maxLength ? { maxLength: opts.maxLength } : {})}
      />
      {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8">
          {/* Shipping */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('fullName', 'Full Name', 'Jane Doe')}
              {field('email', 'Email', 'jane@example.com', 'email')}
              {field('phone', 'Phone (optional)', '+1 555 0100', 'tel')}
              <div className="col-span-1 sm:col-span-2">
                {field('address', 'Street Address', '123 Main St')}
              </div>
              {field('city', 'City', 'New York')}
              {field('postalCode', 'Postal Code', '10001')}
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="country" className="label">Country</label>
                <select id="country" value={form.country} onChange={e => set('country', e.target.value)} className={`input ${errors.country ? 'border-red-400' : ''}`}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Payment (mock) */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-brand-500" />
              <h2 className="font-bold text-gray-900 dark:text-white">Payment</h2>
              <span className="ml-auto badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">
                Demo — no real charge
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2">
                {field('cardName', 'Name on Card', 'Jane Doe')}
              </div>
              <div className="col-span-1 sm:col-span-2">
                {field('cardNumber', 'Card Number', '4242 4242 4242 4242', 'text', { maxLength: 19 })}
              </div>
              {field('expiry', 'Expiry', 'MM/YY', 'text', { maxLength: 5 })}
              {field('cvv', 'CVV', '123', 'text', { maxLength: 4 })}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
              <Lock size={12} />
              Payment processing will be handled by Stripe (not yet integrated — this is a demo).
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base gap-2">
            {loading ? <Spinner size="sm" /> : <><Lock size={16} /> Place Order — {display(subtotal, currency)}</>}
          </button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(({ listing, qty }) => (
                <div key={listing.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {listing.listing_images?.[0]?.url ? (
                      <img src={listing.listing_images[0].url} alt={listing.title} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{listing.title}</p>
                    <p className="text-xs text-gray-500">×{qty}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {display(listing.price * qty, listing.currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span><span>{display(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span><span>TBD</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span><span>{display(subtotal, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
