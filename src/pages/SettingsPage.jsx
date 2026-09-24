import { useState, useRef } from 'react'
import { Camera, User, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile, uploadAvatar } from '../hooks/useProfile'
import { COUNTRIES } from '../lib/constants'
import Spinner from '../components/ui/Spinner'

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    location:  profile?.location || '',
    bio:       profile?.bio || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [preview, setPreview] = useState(profile?.avatar_url || null)
  const fileRef = useRef()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.full_name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      await updateProfile(user.id, { ...form, avatar_url: preview })
      await refreshProfile()
      toast.success('Profile updated!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setUploadingAvatar(true)
    try {
      const url = await uploadAvatar(user.id, file)
      setPreview(url)
      await updateProfile(user.id, { avatar_url: url })
      await refreshProfile()
      toast.success('Avatar updated!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Manage your profile and account preferences.</p>

      <div className="card p-6 space-y-8">
        {/* Avatar */}
        <section aria-labelledby="avatar-heading">
          <h2 id="avatar-heading" className="font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {preview ? (
                <img src={preview} alt="Your avatar" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-purple flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="btn-secondary gap-2 text-sm"
                disabled={uploadingAvatar}
                aria-label="Change profile photo"
              >
                <Camera size={16} /> Change Photo
              </button>
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP. Max 5MB.</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="sr-only"
              aria-label="Upload profile photo"
            />
          </div>
        </section>

        {/* Profile info */}
        <form onSubmit={handleSave} className="space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Profile Information</h2>

          <div>
            <label htmlFor="full_name" className="label">Full Name</label>
            <input
              id="full_name" type="text" value={form.full_name}
              onChange={e => set('full_name', e.target.value)}
              className="input" maxLength={80}
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="location" className="label">Location</label>
            <input
              id="location" type="text" list="countries-settings"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="City, Country"
              className="input"
            />
            <datalist id="countries-settings">
              {COUNTRIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div>
            <label htmlFor="bio" className="label">Bio</label>
            <textarea
              id="bio" rows={4} value={form.bio}
              onChange={e => set('bio', e.target.value)}
              placeholder="Tell buyers a little about yourself…"
              className="input resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/500</p>
          </div>

          {/* Account info (read-only) */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <label className="label">Email Address</label>
            <input type="email" value={user?.email || ''} readOnly className="input opacity-60 cursor-not-allowed" aria-label="Email address (read only)" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here. Contact support if needed.</p>
          </div>

          <button type="submit" disabled={saving} className="btn-primary gap-2 w-full sm:w-auto">
            {saving ? <Spinner size="sm" /> : <Save size={16} />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
