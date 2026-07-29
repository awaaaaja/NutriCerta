'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown } from 'lucide-react'

interface Citation {
  source_id: string
  rule: string
  kutipan: string
}

interface CitationPanelProps {
  citations: Citation[]
}

function CitationPanel({ citations }: CitationPanelProps) {
  const [open, setOpen] = useState(false)

  if (!citations?.length) return null

  return (
    <div className="clinical-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          Sitasi ({citations.length})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul className="mt-3 space-y-2 text-xs border-t border-[var(--color-border)] pt-3">
          {citations.map((c, i) => (
            <li key={i} className="flex gap-2 leading-relaxed">
              <span className="text-[var(--color-primary)] font-mono shrink-0 mt-0.5">
                [{c.source_id}]
              </span>
              <span>
                <strong className="text-[var(--color-foreground)]">{c.rule}:</strong>{' '}
                {c.kutipan}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { CitationPanel, type Citation }
