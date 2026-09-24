import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null
  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="btn-secondary p-2 disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        let p
        if (totalPages <= 7) p = i + 1
        else if (page <= 4) p = i + 1
        else if (page >= totalPages - 3) p = totalPages - 6 + i
        else p = page - 3 + i
        return (
          <button
            key={p}
            onClick={() => onPage(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
              p === page
                ? 'bg-brand-500 text-white'
                : 'btn-secondary'
            }`}
          >
            {p}
          </button>
        )
      })}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="btn-secondary p-2 disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
