import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Package, User } from 'lucide-react'
import { format } from 'date-fns'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../contexts/AuthContext'
import ListingCard from '../components/listings/ListingCard'
import Spinner from '../components/ui/Spinner'

export default function ProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { profile, listings, loading, error } = useProfile(id)
  const isOwn = user?.id === id

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  if (error || !profile) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">👤</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Profile not found</h2>
      <Link to="/" className="btn-primary mt-4">Go Home</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Profile header */}
      <div className="card p-6 md:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-purple flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.full_name || 'Kenshop User'}
                </h1>
                <div className="flex items-center gap-4 mt-1 flex-wrap text-sm text-gray-500 dark:text-gray-400">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} aria-hidden="true" /> {profile.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={13} aria-hidden="true" />
                    Member since {format(new Date(profile.created_at), 'MMMM yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package size={13} aria-hidden="true" /> {listings.length} active listing{listings.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {isOwn && (
                <Link to="/settings" className="btn-secondary text-sm">
                  Edit Profile
                </Link>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-lg leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Listings */}
      <section aria-labelledby="profile-listings-heading">
        <h2 id="profile-listings-heading" className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Active Listings
        </h2>
        {listings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📦</p>
            <p>{isOwn ? 'You have no active listings.' : 'This seller has no active listings.'}</p>
            {isOwn && <Link to="/sell" className="btn-primary mt-4 inline-flex">Create a Listing</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </div>
  )
}
