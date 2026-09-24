import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, PlusCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useMyListings } from '../hooks/useListings'
import { useCurrency } from '../contexts/CurrencyContext'
import { ConditionBadge, StatusBadge } from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/constants'

export default function MyListingsPage() {
  const { user } = useAuth()
  const { listings, loading, error, setListings } = useMyListings(user?.id)
  const { display } = useCurrency()
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error: err } = await supabase.from('listings').delete().eq('id', deleteTarget.id)
      if (err) throw err
      setListings(prev => prev.filter(l => l.id !== deleteTarget.id))
      toast.success('Listing deleted')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  async function handleMarkSold(listing) {
    try {
      const { error: err } = await supabase
        .from('listings')
        .update({ status: listing.status === 'sold' ? 'active' : 'sold' })
        .eq('id', listing.id)
      if (err) throw err
      setListings(prev => prev.map(l => l.id === listing.id ? { ...l, status: l.status === 'sold' ? 'active' : 'sold' } : l))
      toast.success(listing.status === 'sold' ? 'Marked as active' : 'Marked as sold')
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/sell" className="btn-primary gap-2">
          <PlusCircle size={16} /> New Listing
        </Link>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {!listings.length ? (
        <EmptyState
          icon="📦"
          title="No listings yet"
          description="Start selling today — list your first item in minutes."
          action={<Link to="/sell" className="btn-primary">Create a Listing</Link>}
        />
      ) : (
        <div className="space-y-3">
          {listings.map(listing => {
            const cover = listing.listing_images?.[0]?.url
            const cat = CATEGORIES.find(c => c.id === listing.category)
            return (
              <div key={listing.id} className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {cover ? (
                    <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{cat?.icon || '📦'}</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{listing.title}</p>
                    <StatusBadge status={listing.status} />
                    <ConditionBadge condition={listing.condition} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-brand-600 dark:text-brand-400 text-sm">
                      {display(listing.price, listing.currency)}
                    </span>
                    <span>{format(new Date(listing.created_at), 'MMM d, yyyy')}</span>
                    {cat && <span>{cat.icon} {cat.label}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link to={`/listing/${listing.id}`} className="btn-ghost p-2" aria-label="View listing">
                    <Eye size={16} />
                  </Link>
                  <Link to={`/listing/${listing.id}/edit`} className="btn-ghost p-2" aria-label="Edit listing">
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleMarkSold(listing)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                      listing.status === 'sold'
                        ? 'border-green-300 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/10'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                    aria-label={listing.status === 'sold' ? 'Mark as active' : 'Mark as sold'}
                  >
                    {listing.status === 'sold' ? 'Relist' : 'Mark Sold'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(listing)}
                    className="btn-ghost p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                    aria-label="Delete listing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete listing?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Permanently delete <strong>"{deleteTarget?.title}"</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-primary bg-red-500 hover:bg-red-600 focus:ring-red-400">
            {deleting ? <Spinner size="sm" /> : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
