import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from '../../lib/constants'
import { CURRENCIES } from '../../lib/currencies'

export default function ListingFilters({ filters, onChange }) {
  const [showFilters, setShowFilters] = useState(false)

  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = filters.category || filters.condition || filters.minPrice ||
    filters.maxPrice || filters.currency !== 'USD' || filters.location

  return (
    <div className="space-y-3">
      {/* Search + toggle row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search listings..."
            value={filters.q || ''}
            onChange={e => set('q', e.target.value)}
            className="input pl-9"
            aria-label="Search listings"
          />
        </div>

        <select
          value={filters.sort || 'newest'}
          onChange={e => set('sort', e.target.value)}
          className="input w-44"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(f => !f)}
          className={`btn-secondary gap-2 relative ${hasActiveFilters ? 'border-brand-400 text-brand-600' : ''}`}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-slide-up">
          {/* Category */}
          <div className="col-span-2 sm:col-span-1">
            <label className="label">Category</label>
            <select value={filters.category || ''} onChange={e => set('category', e.target.value)} className="input text-sm">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="label">Condition</label>
            <select value={filters.condition || ''} onChange={e => set('condition', e.target.value)} className="input text-sm">
              <option value="">Any Condition</option>
              {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {/* Min price */}
          <div>
            <label className="label">Min Price</label>
            <input type="number" min="0" placeholder="0" value={filters.minPrice || ''} onChange={e => set('minPrice', e.target.value)} className="input text-sm" aria-label="Minimum price" />
          </div>

          {/* Max price */}
          <div>
            <label className="label">Max Price</label>
            <input type="number" min="0" placeholder="Any" value={filters.maxPrice || ''} onChange={e => set('maxPrice', e.target.value)} className="input text-sm" aria-label="Maximum price" />
          </div>

          {/* Currency */}
          <div>
            <label className="label">Currency</label>
            <select value={filters.currency || 'USD'} onChange={e => set('currency', e.target.value)} className="input text-sm">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="label">Location</label>
            <input type="text" placeholder="Any location" value={filters.location || ''} onChange={e => set('location', e.target.value)} className="input text-sm" aria-label="Filter by location" />
          </div>

          {/* Clear */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-6 flex justify-end">
            <button
              onClick={() => onChange({ q: filters.q, sort: filters.sort })}
              className="btn-ghost text-sm"
            >
              <X size={14} /> Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
