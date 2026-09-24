import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Tag, ShoppingCart, Zap, MessageCircle, Share2, Edit, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useListing } from '../hooks/useListings'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { ConditionBadge, StatusBadge } from '../components/ui/Badge'
import { CATEGORIES } from '../lib/constants'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import { supabase } from '../lib/supabase'

export default function ListingDetailPage() {
  const { id } = useParams()
  const { listing, loading, error, setListing } = useListing(id)
  const { user } = useAuth()
  const { addItem } = useCart()
  const { display } = useCurrency()
  const navigate = useNavigate()
  const [imgIdx, setImgIdx] = useState(0)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  if (error || !listing) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">🔍</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Listing not found</h2>
      <Link to="/browse" className="btn-primary mt-4">Browse Listings</Link>
    </div>
  )

  const images = listing.listing_images || []
  const isOwner = user?.id === listing.seller_id
  const isSold = listing.status === 'sold'
  const seller = listing.profiles
  const category = CATEGORIES.find(c => c.id === listing.category)
  const tags = listing.tags ? listing.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  async function handleDelete() {
    setDeleting(true)
    try {
      const { error: err } = await supabase.from('listings').delete().eq('id', id)
      if (err) throw err
      toast.success('Listing deleted')
      navigate('/my-listings')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  function handleAddToCart() {
    addItem(listing)
    toast.success('Added to cart!')
  }

  function handleBuyNow() {
    addItem(listing)
    navigate('/checkout')
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: listing.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  function prevImg() { setImgIdx(i => (i === 0 ? images.length - 1 : i - 1)) }
  function nextImg() { setImgIdx(i => (i === images.length - 1 ? 0 : i + 1)) }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-500">Home</Link>
        <span>/</span>
        <Link to="/browse" className="hover:text-brand-500">Browse</Link>
        {category && <><span>/</span><Link to={`/browse?category=${category.id}`} className="hover:text-brand-500">{category.label}</Link></>}
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={images[imgIdx]?.url}
                  alt={`${listing.title} — photo ${imgIdx + 1}`}
                  className="w-full h-full object-contain"
                />
                {images.length > 1 && (
                  <>
                    <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-gray-900/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors" aria-label="Previous photo">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-gray-900/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors" aria-label="Next photo">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setImgIdx(i)} aria-label={`Photo ${i + 1}`} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-brand-500' : 'bg-white/60'}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                {category?.icon || '📦'}
              </div>
            )}
            {isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <span className="text-white font-extrabold text-3xl border-4 border-white px-6 py-2 rounded-lg rotate-[-8deg]">SOLD</span>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-brand-500' : 'border-transparent'}`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Title & badges */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
                {listing.title}
              </h1>
              <button onClick={handleShare} className="btn-ghost p-2 flex-shrink-0" aria-label="Share listing">
                <Share2 size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <ConditionBadge condition={listing.condition} />
              <StatusBadge status={listing.status} />
              {category && (
                <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {category.icon} {category.label}
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
              {display(listing.price, listing.currency)}
            </span>
            {listing.currency !== 'USD' && (
              <span className="text-sm text-gray-400">{listing.currency} {Number(listing.price).toFixed(2)}</span>
            )}
          </div>

          {/* Meta */}
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            {listing.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" aria-hidden="true" />
                <span>{listing.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" aria-hidden="true" />
              <span>Listed {format(new Date(listing.created_at), 'MMM d, yyyy')}</span>
            </div>
            {listing.quantity > 1 && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{listing.quantity} available</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!isOwner && !isSold && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleAddToCart} className="btn-secondary flex-1 gap-2">
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="btn-primary flex-1 gap-2">
                <Zap size={18} /> Buy Now
              </button>
            </div>
          )}
          {!isOwner && (
            <Link
              to={`/messages/${listing.id}/${listing.seller_id}`}
              className="btn-ghost w-full justify-center gap-2 border border-gray-200 dark:border-gray-700"
            >
              <MessageCircle size={18} /> Message Seller
            </Link>
          )}

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-3 pt-2">
              <Link to={`/listing/${id}/edit`} className="btn-secondary flex-1 gap-2">
                <Edit size={16} /> Edit Listing
              </Link>
              <button onClick={() => setDeleteOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-500 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium text-sm">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}

          {/* Seller info */}
          {seller && (
            <Link
              to={`/profile/${seller.id}`}
              className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-brand-300 transition-colors"
              aria-label={`View ${seller.full_name}'s profile`}
            >
              {seller.avatar_url ? (
                <img src={seller.avatar_url} alt={seller.full_name} className="w-11 h-11 rounded-full object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <User size={20} className="text-brand-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{seller.full_name || 'Seller'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Member since {format(new Date(seller.created_at), 'MMM yyyy')}
                  {seller.location && ` · ${seller.location}`}
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
            </Link>
          )}

          {/* Description */}
          {listing.description && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <Tag size={14} className="text-gray-400" aria-hidden="true" />
              {tags.map(t => (
                <Link key={t} to={`/browse?q=${encodeURIComponent(t)}`}
                  className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 hover:bg-brand-100 transition-colors">
                  {t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete listing?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          This will permanently delete <strong>"{listing.title}"</strong> and cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-primary bg-red-500 hover:bg-red-600">
            {deleting ? <Spinner size="sm" /> : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
