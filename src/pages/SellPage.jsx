import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ListingForm from '../components/listings/ListingForm'

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

export default function SellPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit({ values, newFiles }) {
    setLoading(true)
    try {
      // 1. Create listing
      const { data: listing, error: listErr } = await supabase
        .from('listings')
        .insert({
          seller_id: user.id,
          title:       values.title.trim(),
          description: values.description.trim(),
          category:    values.category,
          condition:   values.condition,
          price:       Number(values.price),
          currency:    values.currency,
          quantity:    Number(values.quantity),
          location:    values.location.trim(),
          tags:        values.tags.trim(),
          status:      'active',
        })
        .select()
        .single()
      if (listErr) throw listErr

      // 2. Upload images
      if (newFiles.length > 0) {
        const imageRows = await uploadImages(newFiles, listing.id)
        const { error: imgErr } = await supabase
          .from('listing_images')
          .insert(imageRows.map(r => ({ ...r, listing_id: listing.id })))
        if (imgErr) throw imgErr
      }

      toast.success('Listing published!')
      navigate(`/listing/${listing.id}`)
    } catch (e) {
      toast.error(e.message || 'Failed to publish listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">List an Item for Sale</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Fill in the details below to publish your listing.</p>
      <div className="card p-6">
        <ListingForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Listing" />
      </div>
    </div>
  )
}
