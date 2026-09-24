import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 20

export function useListings(filters = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)

  const fetchListings = useCallback(async (p = 1) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('listings')
        .select('*, listing_images(url, sort_order)', { count: 'exact' })
        .eq('status', 'active')
        .range((p - 1) * PAGE_SIZE, p * PAGE_SIZE - 1)

      if (filters.q) query = query.ilike('title', `%${filters.q}%`)
      if (filters.category) query = query.eq('category', filters.category)
      if (filters.condition) query = query.eq('condition', filters.condition)
      if (filters.location) query = query.ilike('location', `%${filters.location}%`)
      if (filters.minPrice) query = query.gte('price', Number(filters.minPrice))
      if (filters.maxPrice) query = query.lte('price', Number(filters.maxPrice))

      switch (filters.sort || 'newest') {
        case 'price_asc':  query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'oldest':     query = query.order('created_at', { ascending: true }); break
        default:           query = query.order('created_at', { ascending: false }); break
      }

      const { data, error: err, count } = await query
      if (err) throw err

      // Sort listing_images by sort_order
      const normalized = (data || []).map(l => ({
        ...l,
        listing_images: [...(l.listing_images || [])].sort((a, b) => a.sort_order - b.sort_order),
      }))

      setListings(normalized)
      setTotal(count || 0)
      setPage(p)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [
    filters.q, filters.category, filters.condition, filters.location,
    filters.minPrice, filters.maxPrice, filters.sort,
  ])

  useEffect(() => {
    fetchListings(1)
  }, [fetchListings])

  return { listings, loading, error, total, page, totalPages: Math.ceil(total / PAGE_SIZE), goToPage: fetchListings, refetch: () => fetchListings(page) }
}

export function useListing(id) {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    async function fetch() {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('listings')
        .select(`*, listing_images(url, sort_order), profiles(id, full_name, avatar_url, location, created_at)`)
        .eq('id', id)
        .single()
      if (err) setError(err.message)
      else {
        const sorted = { ...data, listing_images: [...(data.listing_images || [])].sort((a, b) => a.sort_order - b.sort_order) }
        setListing(sorted)
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  return { listing, loading, error, setListing }
}

export function useMyListings(userId) {
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!userId) return
    async function fetch() {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('listings')
        .select('*, listing_images(url, sort_order)')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })
      if (err) setError(err.message)
      else {
        const normalized = (data || []).map(l => ({
          ...l,
          listing_images: [...(l.listing_images || [])].sort((a, b) => a.sort_order - b.sort_order),
        }))
        setListings(normalized)
      }
      setLoading(false)
    }
    fetch()
  }, [userId])

  return { listings, loading, error, setListings }
}
