import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useListing } from '../hooks/useListings'
import { supabase } from '../lib/supabase'
import ListingForm from '../components/listings/ListingForm'
import Spinner from '../components/ui/Spinner'

async function uploadImages(files, listingId) {
  const urls = []
  for (let i = 0; i < files.length; i++) {
    const { file } = files[i]
    const ext = file.name.split('.').pop()
    const path = `listings/${listingId}/${Date.now()}_${i}.${ext}`
    const { error } = await supabase.storage
      .from('listing-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from('listing-images').getPublicUrl(path)
    urls.push({ url: data.publicUrl, sort_order: i })
  }
  return urls
}

export default function EditListingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { listing, loading } = useListing(id)
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  if (!listing || listing.seller_id !== user?.id) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Listing not found or access denied</p>
      <Link to="/my-listings" className="btn-primary">My Listings</Link>
    </div>
  )

  const initialValues = {
    title:       listing.title,
    description: listing.description || '',
    category:    listing.category || '',
    condition:   listing.condition || 'used',
    price:       listing.price,
    currency:    listing.currency || 'USD',
    quantity:    listing.quantity || 1,
    location:    listing.location || '',
    tags:        listing.tags || '',
    status:      listing.status || 'active',
    existingImages: listing.listing_images || [],
  }

  async function handleSubmit({ values, newFiles, images }) {
    setSaving(true)
    try {
      // Update listing row
      const { error: listErr } = await supabase
        .from('listings')
        .update({
          title:       values.title.trim(),
          description: values.description.trim(),
          category:    values.category,
          condition:   values.condition,
          price:       Number(values.price),
          currency:    values.currency,
          quantity:    Number(values.quantity),
          location:    values.location.trim(),
          tags:        values.tags.trim(),
          status:      values.status,
          updated_at:  new Date().toISOString(),
        })
        .eq('id', id)
      if (listErr) throw listErr

      // Delete removed images (those not in the current `images` array)
      const keepUrls = new Set(images.map(img => img.url))
      const removed = (listing.listing_images || []).filter(img => !keepUrls.has(img.url))
      if (removed.length) {
        await supabase.from('listing_images').delete().in('url', removed.map(r => r.url))
      }

      // Upload new images
      if (newFiles.length > 0) {
        const existingCount = images.length
        const imageRows = await uploadImages(newFiles, id)
        const { error: imgErr } = await supabase
          .from('listing_images')
          .insert(imageRows.map((r, i) => ({ ...r, listing_id: id, sort_order: existingCount + i })))
        if (imgErr) throw imgErr
      }

      toast.success('Listing updated!')
      navigate(`/listing/${id}`)
    } catch (e) {
      toast.error(e.message || 'Failed to update listing')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <Link to={`/listing/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-500 mb-6">
        <ChevronLeft size={16} /> Back to listing
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Listing</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Update your listing details.</p>
      <div className="card p-6">
        <ListingForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Update Listing"
        />
      </div>
    </div>
  )
}
