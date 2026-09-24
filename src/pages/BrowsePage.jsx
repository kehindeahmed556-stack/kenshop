import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingGrid from '../components/listings/ListingGrid'
import ListingFilters from '../components/listings/ListingFilters'
import Pagination from '../components/ui/Pagination'
import { useListings } from '../hooks/useListings'

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

  // Sync filters → URL params
  useEffect(() => {
    const params = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params, { replace: true })
  }, [filters]) // eslint-disable-line

  const { listings, loading, error, total, page, totalPages, goToPage } = useListings(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Browse Listings</h1>
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total.toLocaleString()} {total === 1 ? 'listing' : 'listings'} found
          </p>
        )}
      </div>

      <ListingFilters filters={filters} onChange={setFilters} />

      <div className="mt-6">
        <ListingGrid listings={listings} loading={loading} error={error} />
        <Pagination page={page} totalPages={totalPages} onPage={goToPage} />
      </div>
    </div>
  )
}
