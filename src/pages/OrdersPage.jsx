import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Package, ShoppingBag } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../hooks/useOrders'
import { useCurrency } from '../contexts/CurrencyContext'
import { StatusBadge } from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const { user } = useAuth()
  const { purchases, sales, loading, error } = useOrders(user?.id)
  const { display } = useCurrency()
  const [tab, setTab] = useState('purchases')

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const { error: err } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
      if (err) throw err
      toast.success(`Order marked as ${newStatus}`)
      window.location.reload()
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>

  const orders = tab === 'purchases' ? purchases : sales

  function OrderRow({ order, isSale }) {
    const listing = order.listings
    const cover = listing?.listing_images?.find?.((_, i) => i === 0)?.url || listing?.listing_images?.[0]?.url
    const otherParty = isSale ? order.profiles : order.profiles

    return (
      <div className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Listing thumb */}
        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {cover ? (
            <img src={cover} alt={listing?.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link to={`/listing/${order.listing_id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 truncate block">
            {listing?.title || 'Listing'}
          </Link>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{format(new Date(order.created_at), 'MMM d, yyyy')}</span>
            <span>Qty: {order.quantity}</span>
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {display(order.total_price, order.currency || 'USD')}
            </span>
          </div>
          {otherParty && (
            <p className="text-xs text-gray-400 mt-0.5">
              {isSale ? 'Buyer' : 'Seller'}: {otherParty.full_name || 'Unknown'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {isSale && order.status === 'confirmed' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'shipped')}
              className="text-xs px-2.5 py-1 rounded-lg border border-brand-300 text-brand-600 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/10 font-medium transition-colors"
            >
              Mark Shipped
            </button>
          )}
          {isSale && order.status === 'shipped' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'delivered')}
              className="text-xs px-2.5 py-1 rounded-lg border border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/10 font-medium transition-colors"
            >
              Mark Delivered
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Orders</h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-6">
        {[
          { id: 'purchases', label: 'My Purchases', icon: <ShoppingBag size={15} />, count: purchases.length },
          { id: 'sales',     label: 'My Sales',     icon: <Package size={15} />,     count: sales.length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.icon}
            {t.label}
            {t.count > 0 && (
              <span className="bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {t.count > 99 ? '99+' : t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={tab === 'purchases' ? '🛍️' : '📦'}
          title={tab === 'purchases' ? 'No purchases yet' : 'No sales yet'}
          description={tab === 'purchases' ? 'Browse listings and make your first purchase.' : 'List items for sale to get started.'}
          action={
            <Link to={tab === 'purchases' ? '/browse' : '/sell'} className="btn-primary">
              {tab === 'purchases' ? 'Browse Listings' : 'List an Item'}
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderRow key={order.id} order={order} isSale={tab === 'sales'} />
          ))}
        </div>
      )}
    </div>
  )
}
