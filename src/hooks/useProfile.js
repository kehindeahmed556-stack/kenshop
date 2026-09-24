import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile(userId) {
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return
    async function fetch() {
      setLoading(true)
      const [profileRes, listingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('listings')
          .select('*, listing_images(url, sort_order)')
          .eq('seller_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(12),
      ])
      if (profileRes.error) setError(profileRes.error.message)
      else setProfile(profileRes.data)
      setListings((listingsRes.data || []).map(l => ({
        ...l,
        listing_images: [...(l.listing_images || [])].sort((a, b) => a.sort_order - b.sort_order),
      })))
      setLoading(false)
    }
    fetch()
  }, [userId])

  return { profile, listings, loading, error }
}

export async function updateProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop()
  const path = `avatars/${userId}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
