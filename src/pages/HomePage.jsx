import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, TrendingUp, Shield, Globe, Star } from 'lucide-react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { CATEGORIES } from '../lib/constants'
import ListingCard from '../components/listings/ListingCard'
import Spinner from '../components/ui/Spinner'

// Demo listings shown when Supabase is not yet connected
const DEMO_LISTINGS = [
  { id: 'd1', title: 'Vintage Leather Jacket', price: 85, currency: 'USD', condition: 'used',     category: 'fashion',     location: 'New York, US',    listing_images: [] },
  { id: 'd2', title: 'Sony WH-1000XM5 Headphones', price: 220, currency: 'USD', condition: 'like_new', category: 'electronics', location: 'London, UK',   listing_images: [] },
  { id: 'd3', title: 'Handmade Ceramic Vase Set', price: 45,  currency: 'USD', condition: 'new',      category: 'home',        location: 'Paris, FR',    listing_images: [] },
  { id: 'd4', title: 'Mountain Bike — Trek Marlin 7', price: 650, currency: 'USD', condition: 'used',  category: 'sports',      location: 'Berlin, DE',   listing_images: [] },
  { id: 'd5', title: 'The Design of Everyday Things', price: 12, currency: 'USD', condition: 'like_new', category: 'books',    location: 'Toronto, CA',  listing_images: [] },
  { id: 'd6', title: 'Vintage Rolex Datejust', price: 4200, currency: 'USD', condition: 'used',    category: 'jewelry',     location: 'Dubai, AE',    listing_images: [] },
  { id: 'd7', title: 'iPad Pro 12.9" M2 — 256GB', price: 780, currency: 'USD', condition: 'like_new', category: 'electronics', location: 'Sydney, AU',  listing_images: [] },
  { id: 'd8', title: 'LEGO Technic Bugatti Chiron', price: 130, currency: 'USD', condition: 'new',   category: 'toys',        location: 'Amsterdam, NL', listing_images: [] },
  { id: 'd9', title: 'Acoustic Guitar — Yamaha FG800', price: 180, currency: 'USD', condition: 'used', category: 'music',     location: 'Lagos, NG',    listing_images: [] },
  { id: 'd10', title: 'Nike Air Jordan 1 Retro High OG', price: 310, currency: 'USD', condition: 'new', category: 'fashion',  location: 'Tokyo, JP',    listing_images: [] },
]

const STATS = [
  { label: 'Active Listings',  value: '2.4M+' },
  { label: 'Happy Buyers',     value: '850K+' },
  { label: 'Countries',        value: '120+' },
  { label: 'Categories',       value: '15' },
]

export default function HomePage() {
  const [searchQ, setSearchQ]   = useState('')
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabaseConfigured) {
      setListings(DEMO_LISTINGS)
      setLoading(false)
      return
    }
    async function fetchHome() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('listings')
          .select('*, listing_images(url, sort_order)')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(10)
        const normalized = (data || []).map(l => ({
          ...l,
          listing_images: [...(l.listing_images || [])].sort((a, b) => a.sort_order - b.sort_order),
        }))
        setListings(normalized.length ? normalized : DEMO_LISTINGS)
      } catch {
        setListings(DEMO_LISTINGS)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    navigate(searchQ.trim() ? `/browse?q=${encodeURIComponent(searchQ.trim())}` : '/browse')
  }

  return (
    <div className="animate-fade-in">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple text-white">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star size={14} className="text-yellow-300" aria-hidden="true" />
            The marketplace for everyone — buyers &amp; sellers
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            Buy &amp; Sell{' '}
            <span className="relative">
              <span className="text-brand-200">Anything</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-white/30 rounded-full" aria-hidden="true" />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            New, used, vintage — find amazing deals or give your items a new home.
            Millions of listings from sellers worldwide.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto gap-2 mb-6" role="search">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search for anything…"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-lg"
                aria-label="Search listings"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-brand-600 font-bold px-6 py-3.5 rounded-xl hover:bg-brand-50 active:bg-brand-100 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 text-sm text-brand-200">
            {['Electronics', 'Fashion', 'Vintage', 'Sports', 'Books', 'Home'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/browse?q=${tag}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-brand-500">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: <Shield size={16} className="text-brand-500" />,       label: 'Secure Payments' },
              { icon: <Globe size={16} className="text-accent-teal" />,       label: 'Ships Worldwide' },
              { icon: <TrendingUp size={16} className="text-accent-purple" />, label: 'Best Deals Daily' },
              { icon: <Star size={16} className="text-yellow-500" />,          label: 'Verified Sellers' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {icon} <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* ── Categories ── */}
        <section aria-labelledby="categories-heading">
          <div className="flex items-center justify-between mb-5">
            <h2 id="categories-heading" className="text-xl font-bold text-gray-900 dark:text-white">
              Browse Categories
            </h2>
            <Link to="/browse" className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
              All listings <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/browse?category=${cat.id}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-card transition-all duration-200"
                aria-label={`Browse ${cat.label}`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                  {cat.icon}
                </span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Featured listings ── */}
        <section aria-labelledby="featured-heading">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="featured-heading" className="text-xl font-bold text-gray-900 dark:text-white">
                {supabaseConfigured ? 'Featured Listings' : 'Example Listings'}
              </h2>
              {!supabaseConfigured && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Connect Supabase to show real listings
                </p>
              )}
            </div>
            <Link to="/browse" className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </section>

        {/* ── How it works ── */}
        <section aria-labelledby="how-heading" className="py-4">
          <h2 id="how-heading" className="text-xl font-bold text-gray-900 dark:text-white text-center mb-10">
            How Kenshop Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '🔍', title: 'Browse & Discover', desc: 'Search millions of listings across 15 categories from sellers worldwide.' },
              { step: '02', icon: '💬', title: 'Connect with Sellers', desc: 'Message sellers directly, ask questions, and negotiate — all in-app.' },
              { step: '03', icon: '📦', title: 'Buy or Sell Safely', desc: 'Place orders, track shipments, and get support from our team.' },
            ].map(item => (
              <div key={item.step} className="card p-6 text-center hover:shadow-card-hover transition-shadow">
                <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
                <div className="text-xs font-bold text-brand-500 mb-1">STEP {item.step}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sell CTA ── */}
        <section className="rounded-3xl bg-gradient-to-r from-brand-500 to-accent-purple text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Got something to sell?</h2>
            <p className="text-brand-100 max-w-md leading-relaxed">
              List your item in minutes. Reach buyers from over 120 countries. No listing fees to get started.
            </p>
          </div>
          <Link
            to="/sell"
            className="flex-shrink-0 bg-white text-brand-600 font-bold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            Start Selling →
          </Link>
        </section>
      </div>
    </div>
  )
}
