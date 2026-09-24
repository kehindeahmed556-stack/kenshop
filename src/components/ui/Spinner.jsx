import clsx from 'clsx'

export default function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx(
        'inline-block rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin',
        sizes[size],
        className
      )}
    />
  )
}
