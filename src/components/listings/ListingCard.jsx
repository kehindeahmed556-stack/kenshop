import { Link } from 'react-router-dom'
import { MapPin, Heart } from 'lucide-react'
import { ConditionBadge } from '../ui/Badge'
import { useCurrency } from '../../contexts/CurrencyContext'
import { CATEGORIES } from '../../lib/constants'

export default function ListingCard({ listing }) {
  const { display } = useCurrency()
  const category = CATEGORIES.find(c => c.id === listing.category)
  const coverImage = listing.listing_images?.[0]?.url

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group card overflow-hidden flex flex-col hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
      aria-label={`${listing.title} — ${display(listing.price, listing.currency)}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
            {category?.icon || '📦'}
          </div>
        )}
        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg rotate-[-12deg] border-2 border-white px-3 py-1 rounded">
              SOLD
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <ConditionBadge condition={listing.condition} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-brand-600 transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-base font-bold text-brand-600 dark:text-brand-400">
            {display(listing.price, listing.currency)}
          </span>
          {listing.location && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500 truncate max-w-[100px]">
              <MapPin size={10} aria-hidden="true" />
              {listing.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
