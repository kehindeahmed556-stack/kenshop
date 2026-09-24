import { useState, useRef } from 'react'
import { UploadCloud, X, GripVertical } from 'lucide-react'
import { CATEGORIES, CONDITIONS } from '../../lib/constants'
import { CURRENCIES } from '../../lib/currencies'
import { COUNTRIES } from '../../lib/constants'
import Spinner from '../ui/Spinner'

const MAX_IMAGES = 8

export default function ListingForm({ initialValues = {}, onSubmit, loading, submitLabel = 'Publish Listing' }) {
  const [values, setValues] = useState({
    title: '', description: '', category: '', condition: 'used',
    price: '', currency: 'USD', quantity: 1, location: '', tags: '',
    status: 'active', ...initialValues,
  })
  const [images, setImages]     = useState(initialValues.existingImages || [])
  const [newFiles, setNewFiles] = useState([])
  const [errors, setErrors]     = useState({})
  const fileRef = useRef()

  function set(key, value) {
    setValues(v => ({ ...v, [key]: value }))
    setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  function validate() {
    const e = {}
    if (!values.title.trim()) e.title = 'Title is required'
    if (!values.category)     e.category = 'Please select a category'
    if (!values.condition)    e.condition = 'Please select a condition'
    if (!values.price || Number(values.price) <= 0) e.price = 'Price must be greater than 0'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    await onSubmit({ values, newFiles, images })
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_IMAGES - images.length - newFiles.length
    const toAdd = files.slice(0, remaining).map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setNewFiles(prev => [...prev, ...toAdd])
    e.target.value = ''
  }

  function removeNewFile(idx) {
    setNewFiles(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[idx].preview)
      updated.splice(idx, 1)
      return updated
    })
  }

  function removeExisting(idx) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const totalImages = images.length + newFiles.length
  const canAddMore = totalImages < MAX_IMAGES

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="label">Title <span className="text-red-500" aria-hidden="true">*</span></label>
        <input
          id="title" type="text" value={values.title}
          onChange={e => set('title', e.target.value)}
          placeholder="What are you selling?"
          className={`input ${errors.title ? 'border-red-400 focus:ring-red-300' : ''}`}
          maxLength={120}
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-err' : undefined}
        />
        {errors.title && <p id="title-err" className="text-xs text-red-500 mt-1">{errors.title}</p>}
        <p className="text-xs text-gray-400 mt-1 text-right">{values.title.length}/120</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="desc" className="label">Description</label>
        <textarea
          id="desc" rows={5} value={values.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Describe your item — condition details, measurements, history..."
          className="input resize-none"
          maxLength={2000}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{(values.description || '').length}/2000</p>
      </div>

      {/* Category & Condition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="label">Category <span className="text-red-500" aria-hidden="true">*</span></label>
          <select
            id="category" value={values.category}
            onChange={e => set('category', e.target.value)}
            className={`input ${errors.category ? 'border-red-400' : ''}`}
            aria-required="true"
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="condition" className="label">Condition <span className="text-red-500" aria-hidden="true">*</span></label>
          <select
            id="condition" value={values.condition}
            onChange={e => set('condition', e.target.value)}
            className={`input ${errors.condition ? 'border-red-400' : ''}`}
            aria-required="true"
          >
            {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Price, Currency, Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label htmlFor="price" className="label">Price <span className="text-red-500" aria-hidden="true">*</span></label>
          <input
            id="price" type="number" min="0" step="0.01" value={values.price}
            onChange={e => set('price', e.target.value)}
            placeholder="0.00"
            className={`input ${errors.price ? 'border-red-400' : ''}`}
            aria-required="true"
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="currency" className="label">Currency</label>
          <select id="currency" value={values.currency} onChange={e => set('currency', e.target.value)} className="input">
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="qty" className="label">Quantity</label>
          <input id="qty" type="number" min="1" value={values.quantity} onChange={e => set('quantity', Math.max(1, parseInt(e.target.value) || 1))} className="input" />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="label">Location / Ships from</label>
        <input
          id="location" type="text" list="countries-list" value={values.location}
          onChange={e => set('location', e.target.value)}
          placeholder="City, Country"
          className="input"
        />
        <datalist id="countries-list">
          {COUNTRIES.map(c => <option key={c} value={c} />)}
        </datalist>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="label">Tags</label>
        <input
          id="tags" type="text" value={values.tags}
          onChange={e => set('tags', e.target.value)}
          placeholder="vintage, leather, handmade"
          className="input"
        />
        <p className="text-xs text-gray-400 mt-1">Comma-separated keywords to help buyers find your listing</p>
      </div>

      {/* Photos */}
      <div>
        <label className="label">Photos ({totalImages}/{MAX_IMAGES})</label>

        <div className="flex flex-wrap gap-3 mb-3">
          {/* Existing images */}
          {images.map((img, idx) => (
            <div key={img.url || idx} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group">
              <img src={img.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">Cover</span>
              )}
              <button
                type="button"
                onClick={() => removeExisting(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove photo ${idx + 1}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* New file previews */}
          {newFiles.map((f, idx) => (
            <div key={f.preview} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-brand-300 dark:border-brand-700 group">
              <img src={f.preview} alt={`New photo ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove new photo ${idx + 1}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* Upload button */}
          {canAddMore && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
              aria-label="Add photos"
            >
              <UploadCloud size={20} />
              <span className="text-xs">Add photo</span>
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload images"
        />
        <p className="text-xs text-gray-400">Up to 8 photos. First photo is the cover image. Max 10MB each.</p>
      </div>

      {/* Status (edit mode) */}
      {initialValues.status && (
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" value={values.status} onChange={e => set('status', e.target.value)} className="input">
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
        {loading ? <><Spinner size="sm" /> Saving…</> : submitLabel}
      </button>
    </form>
  )
}
