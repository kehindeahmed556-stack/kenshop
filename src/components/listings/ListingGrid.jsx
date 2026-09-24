import ListingCard from './ListingCard'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import { Link } from 'react-router-dom'

export default function ListingGrid({ listings, loading, error }) {
  if (loading) return (
    <div className="flex justify-center py-16">
      <Spinner size="lg" />
    </div>
  )

  if (error) return (
    <div className="text-center py-16 text-red-500">
      <p>Failed to load listings.</p>
      <p className="text-sm mt-1">{error}</p>
    </div>
  )

  if (!listings?.length) return (
    <EmptyState
      icon="🔍"
      title="No listings found"
      description="Try adjusting your filters or search terms"
      action={
        <Link to="/browse" className="btn-primary">
          Browse All
        </Link>
      }
    />
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
