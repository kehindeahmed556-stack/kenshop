import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, TrendingUp, Shield, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/constants'
import ListingCard from '../components/listings/ListingCard'
import Spinner from '../components/ui/Spinner'

export default function HomePage() {
  const [searchQ, setSearchQ] = useState('')
  const [featured, setFeatured] = useState([])
  const [newest, setNewest] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchHome() {
      setLoading(true)
      const [featuredRes, newestRes] = await Promise.all([
        supabase
          .from('listings')
          .select('*, listing_images(url, sort_order)')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('listings')
          .select('*, listing_images(url, sort_order)')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .range(10, 19),
      ])
      const normalize = (rows) =>
        (rows || []).map(l => ({
          ...l,
          listing_images: [...(l.listing_images || [])].sort((a, b) => a.sort_order - b.sort_order),
        }))
      setFeatured(normalize(featuredRes.data))
      setNewest(normalize(newestRes.data))
      setLoading(false)
    }
    fetchHome()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQ.trim()) navigate(`/browse?q=${encodeURIComponent(searchQ.trim())}`)
    else navigate('/browse')
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-accent-purple text-white">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" aria-hidden="true" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Buy &amp; Sell{' '}
            <span className="text-brand-200">Anything</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto mb-8">
            New, used, vintage — find amazing deals or give your items a new home.
            Millions of listings, one marketplace.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto gap-2" role="search">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search for anything…"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label="Search listings"
              />
            </div>
            <button type="submit" className="bg-white text-brand-600 font-bold px-6 py-3.5 rounded-xl hover:bg-brand-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-brand-200">
            {['Electronics', 'Fashion', 'Home', 'Vintage', 'Sports'].map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/browse?q=${tag}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: <Shield size={20} className="text-brand-500" />, label: 'Secure Payments' },
              { icon: <Globe size={20} className="text-accent-teal" />, label: 'Ships Worldwide' },
              { icon: <TrendingUp size={20} className="text-accent-purple" />, label: 'Best Deals Daily' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <div className="flex items-center justify-between mb-5">
            <h2 id="categories-heading" className="text-xl font-bold text-gray-900 dark:text-white">Browse Categories</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/browse?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-brand-300 hover:shadow-card transition-all duration-200 group"
                aria-label={cat.label}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                  {cat.icon}
                </span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured listings */}
        <section aria-labelledby="featured-heading">
          <div className="flex items-center justify-between mb-5">
            <h2 id="featured-heading" className="text-xl font-bold text-gray-900 dark:text-white">Featured Listings</h2>
            <Link to="/browse" className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : featured.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featured.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="font-medium">No listings yet. Be the first to sell!</p>
              <Link to="/sell" className="btn-primary mt-4 inline-flex">Start Selling</Link>
            </div>
          )}
        </section>

        {/* Newest arrivals */}
        {newest.length > 0 && (
          <section aria-labelledby="newest-heading">
            <div className="flex items-center justify-between mb-5">
              <h2 id="newest-heading" className="text-xl font-bold text-gray-900 dark:text-white">Newest Arrivals</h2>
              <Link to="/browse?sort=newest" className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {newest.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        )}

        {/* CTA banner */}
        <section className="rounded-3xl bg-gradient-to-r from-accent-purple to-brand-500 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Got something to sell?</h2>
            <p className="text-brand-100 max-w-md">List your item in minutes. Reach buyers worldwide. No listing fees to get started.</p>
          </div>
          <Link to="/sell" className="flex-shrink-0 bg-white text-brand-600 font-bold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap">
            Start Selling →
          </Link>
        </section>
      </div>
    </div>
  )
}
