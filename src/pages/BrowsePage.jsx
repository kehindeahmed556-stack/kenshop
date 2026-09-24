import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingGrid from '../components/listings/ListingGrid'
import ListingFilters from '../components/listings/ListingFilters'
import Pagination from '../components/ui/Pagination'
import { useListings } from '../hooks/useListings'
import { supabaseConfigured } from '../lib/supabase'

// Demo listings for when Supabase isn't connected
const DEMO_LISTINGS = [
  { id: 'd1',  title: 'Vintage Leather Jacket',          price: 85,   currency: 'USD', condition: 'used',     category: 'fashion',     location: 'New York, US',   status: 'active', listing_images: [] },
  { id: 'd2',  title: 'Sony WH-1000XM5 Headphones',      price: 220,  currency: 'USD', condition: 'like_new', category: 'electronics', location: 'London, UK',     status: 'active', listing_images: [] },
  { id: 'd3',  title: 'Handmade Ceramic Vase Set',        price: 45,   currency: 'USD', condition: 'new',      category: 'home',        location: 'Paris, FR',      status: 'active', listing_images: [] },
  { id: 'd4',  title: 'Trek Marlin 7 Mountain Bike',      price: 650,  currency: 'USD', condition: 'used',     category: 'sports',      location: 'Berlin, DE',     status: 'active', listing_images: [] },
  { id: 'd5',  title: 'The Design of Everyday Things',    price: 12,   currency: 'USD', condition: 'like_new', category: 'books',       location: 'Toronto, CA',    status: 'active', listing_images: [] },
  { id: 'd6',  title: 'Vintage Rolex Datejust',           price: 4200, currency: 'USD', condition: 'used',     category: 'jewelry',     location: 'Dubai, AE',      status: 'active', listing_images: [] },
  { id: 'd7',  title: 'iPad Pro 12.9" M2 — 256GB',       price: 780,  currency: 'USD', condition: 'like_new', category: 'electronics', location: 'Sydney, AU',     status: 'active', listing_images: [] },
  { id: 'd8',  title: 'LEGO Technic Bugatti Chiron',      price: 130,  currency: 'USD', condition: 'new',      category: 'toys',        location: 'Amsterdam, NL',  status: 'active', listing_images: [] },
  { id: 'd9',  title: 'Yamaha FG800 Acoustic Guitar',     price: 180,  currency: 'USD', condition: 'used',     category: 'music',       location: 'Lagos, NG',      status: 'active', listing_images: [] },
  { id: 'd10', title: 'Nike Air Jordan 1 Retro High OG',  price: 310,  currency: 'USD', condition: 'new',      category: 'fashion',     location: 'Tokyo, JP',      status: 'active', listing_images: [] },
  { id: 'd11', title: 'Canon EOS R6 Mark II Body',        price: 2200, currency: 'USD', condition: 'like_new', category: 'electronics', location: 'Seoul, KR',      status: 'active', listing_images: [] },
  { id: 'd12', title: 'Wicker Garden Chair Set (×2)',     price: 95,   currency: 'USD', condition: 'used',     category: 'home',        location: 'Barcelona, ES',  status: 'active', listing_images: [] },
  { id: 'd13', title: 'Harry Potter Complete Box Set',    price: 55,   currency: 'USD', condition: 'like_new', category: 'books',       location: 'Manchester, UK', status: 'active', listing_images: [] },
  { id: 'd14', title: 'Adidas Ultraboost 22 — Size 10',  price: 95,   currency: 'USD', condition: 'like_new', category: 'fashion',     location: 'Chicago, US',    status: 'active', listing_images: [] },
  { id: 'd15', title: 'PS5 Console + 2 Controllers',     price: 480,  currency: 'USD', condition: 'used',     category: 'electronics', location: 'Mumbai, IN',     status: 'active', listing_images: [] },
  { id: 'd16', title: 'Organic Beeswax Candle Set',       price: 28,   currency: 'USD', condition: 'new',      category: 'home',        location: 'Melbourne, AU',  status: 'active', listing_images: [] },
  { id: 'd17', title: 'Fender Stratocaster Electric Guitar', price: 750, currency: 'USD', condition: 'used',  category: 'music',       location: 'Nashville, US',  status: 'active', listing_images: [] },
  { id: 'd18', title: 'Louis Vuitton Neverfull MM Tote',  price: 890,  currency: 'USD', condition: 'used',     category: 'fashion',     location: 'Milan, IT',      status: 'active', listing_images: [] },
  { id: 'd19', title: 'Weber Spirit E-315 Gas Grill',     price: 420,  currency: 'USD', condition: 'like_new', category: 'home',        location: 'Dallas, US',     status: 'active', listing_images: [] },
  { id: 'd20', title: 'Pokémon Card Collection Binder',   price: 340,  currency: 'USD', condition: 'like_new', category: 'toys',        location: 'Osaka, JP',      status: 'active', listing_images: [] },
]

function DemoBrowse({ filters }) {
  const q   = (filters.q || '').toLowerCase()
  const cat = filters.category
  const cond = filters.condition

  let results = DEMO_LISTINGS.filter(l => {
    if (q && !l.title.toLowerCase().includes(q) && !l.location.toLowerCase().includes(q)) return false
    if (cat && l.category !== cat) return false
    if (cond && l.condition !== cond) return false
    if (filters.minPrice && l.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && l.price > Number(filters.maxPrice)) return false
    return true
  })

  if (filters.sort === 'price_asc')  results = [...results].sort((a, b) => a.price - b.price)
  if (filters.sort === 'price_desc') results = [...results].sort((a, b) => b.price - a.price)

  return (
    <div className="mt-6">
      <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mb-4">
        Showing demo listings — connect Supabase to see real listings.
      </p>
      <ListingGrid listings={results} loading={false} error={null} />
    </div>
  )
}

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    q:         searchParams.get('q')        || '',
    category:  searchParams.get('category') || '',
    condition: searchParams.get('condition')|| '',
    minPrice:  searchParams.get('minPrice') || '',
    maxPrice:  searchParams.get('maxPrice') || '',
    currency:  searchParams.get('currency') || 'USD',
    location:  searchParams.get('location') || '',
    sort:      searchParams.get('sort')     || 'newest',
  })

  useEffect(() => {
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params, { replace: true })
  }, [filters]) // eslint-disable-line

  const { listings, loading, error, total, page, totalPages, goToPage } = useListings(
    supabaseConfigured ? filters : { q: '__skip__' } // skip DB query when not configured
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Browse Listings</h1>
        {supabaseConfigured && !loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total.toLocaleString()} {total === 1 ? 'listing' : 'listings'} found
          </p>
        )}
      </div>

      <ListingFilters filters={filters} onChange={setFilters} />

      {supabaseConfigured ? (
        <div className="mt-6">
          <ListingGrid listings={listings} loading={loading} error={error} />
          <Pagination page={page} totalPages={totalPages} onPage={goToPage} />
        </div>
      ) : (
        <DemoBrowse filters={filters} />
      )}
    </div>
  )
}
