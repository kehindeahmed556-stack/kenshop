import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/** Returns all unique conversations for a user (grouped by listing + other party) */
export function useConversations(userId) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: err } = await supabase
      .from('messages')
      .select(`
        id, listing_id, sender_id, receiver_id, content, created_at,
        listings(id, title, listing_images(url, sort_order)),
        sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (err) { setError(err.message); setLoading(false); return }

    // Group into conversations: unique (listing_id, other_party_id)
    const seen = new Map()
    for (const msg of data || []) {
      const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
      const key = `${msg.listing_id}__${otherId}`
      if (!seen.has(key)) {
        seen.set(key, {
          key,
          listingId: msg.listing_id,
          listing: msg.listings,
          otherId,
          other: msg.sender_id === userId ? msg.receiver : msg.sender,
          lastMessage: msg.content,
          lastAt: msg.created_at,
        })
      }
    }
    setConversations(Array.from(seen.values()))
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  return { conversations, loading, error, refetch: fetch }
}

/** Returns messages for a specific listing + pair of users, with realtime subscription */
export function useMessages(listingId, userId, otherId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!listingId || !userId || !otherId) return

    async function fetchMessages() {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('messages')
        .select(`
          id, listing_id, sender_id, receiver_id, content, created_at,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
        `)
        .eq('listing_id', listingId)
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`
        )
        .order('created_at', { ascending: true })

      if (err) setError(err.message)
      else setMessages(data || [])
      setLoading(false)
    }

    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel(`messages:${listingId}:${userId}:${otherId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `listing_id=eq.${listingId}`,
      }, async (payload) => {
        const newMsg = payload.new
        if (
          (newMsg.sender_id === userId && newMsg.receiver_id === otherId) ||
          (newMsg.sender_id === otherId && newMsg.receiver_id === userId)
        ) {
          // Fetch sender profile for the new message
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', newMsg.sender_id)
            .single()
          setMessages(prev => [...prev, { ...newMsg, sender: senderData }])
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [listingId, userId, otherId])

  async function sendMessage(content) {
    if (!content.trim()) return
    const { error: err } = await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: userId,
      receiver_id: otherId,
      content: content.trim(),
    })
    if (err) throw err
  }

  return { messages, loading, error, sendMessage }
}
