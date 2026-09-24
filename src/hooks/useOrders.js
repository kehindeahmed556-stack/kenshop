import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useOrders(userId) {
  const [purchases, setPurchases] = useState([])
  const [sales, setSales]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!userId) return
    async function fetch() {
      setLoading(true)
      const [buyRes, sellRes] = await Promise.all([
        supabase.from('orders')
          .select('*, listings(title, price, currency, listing_images(url, sort_order)), profiles!orders_seller_id_fkey(full_name, avatar_url)')
          .eq('buyer_id', userId)
          .order('created_at', { ascending: false }),
        supabase.from('orders')
          .select('*, listings(title, price, currency, listing_images(url, sort_order)), profiles!orders_buyer_id_fkey(full_name, avatar_url)')
          .eq('seller_id', userId)
          .order('created_at', { ascending: false }),
      ])
      if (buyRes.error) setError(buyRes.error.message)
      else setPurchases(buyRes.data || [])
      if (sellRes.error) setError(sellRes.error.message)
      else setSales(sellRes.data || [])
      setLoading(false)
    }
    fetch()
  }, [userId])

  return { purchases, sales, loading, error }
}
