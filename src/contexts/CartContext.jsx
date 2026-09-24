import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kenshop-cart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('kenshop-cart', JSON.stringify(items))
  }, [items])

  function addItem(listing, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.listing.id === listing.id)
      if (existing) {
        return prev.map(i =>
          i.listing.id === listing.id
            ? { ...i, qty: Math.min(i.qty + qty, listing.quantity) }
            : i
        )
      }
      return [...prev, { listing, qty }]
    })
  }

  function removeItem(listingId) {
    setItems(prev => prev.filter(i => i.listing.id !== listingId))
  }

  function updateQty(listingId, qty) {
    if (qty <= 0) { removeItem(listingId); return }
    setItems(prev =>
      prev.map(i => i.listing.id === listingId ? { ...i, qty } : i)
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
