'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { OpportunityCard } from '../../../components/OpportunityCard'
import { Opportunity } from '../../../lib/database.types'
import { Search, X, Filter, Loader2 } from 'lucide-react'

function OpportunitiesList() {
  const searchParams = useSearchParams()

  // State initialized from URL query params
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [mode, setMode] = useState(searchParams.get('mode') || 'all')
  const [pricingType, setPricingType] = useState(searchParams.get('pricing_type') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance')
  const [page, setPage] = useState(Number(searchParams.get('page') || 1))

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const categories = [
    { label: 'All Tracks', value: 'all' },
    { label: 'Internships', value: 'internship' },
    { label: 'Hackathons', value: 'hackathon' },
    { label: 'Scholarships', value: 'scholarship' },
    { label: 'Fellowships', value: 'fellowship' },
    { label: 'Competitions', value: 'competition' },
    { label: 'Courses', value: 'course' },
  ]

  // Synchronize URL and fetch results
  useEffect(() => {
    let ignore = false
    setLoading(true)

    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category !== 'all') params.set('category', category)
    if (mode !== 'all') params.set('mode', mode)
    if (pricingType !== 'all') params.set('pricing_type', pricingType)
    if (sort !== 'relevance') params.set('sort', sort)
    if (page > 1) params.set('page', String(page))

    fetch(`/api/opportunities?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        if (!ignore && res.data) {
          setOpportunities(res.data)
          setTotal(res.pagination?.total || 0)
          setTotalPages(res.pagination?.totalPages || 1)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [query, category, mode, pricingType, sort, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const clearAllFilters = () => {
    setQuery('')
    setCategory('all')
    setMode('all')
    setPricingType('all')
    setSort('relevance')
    setPage(1)
  }

  const hasActiveFilters = query || category !== 'all' || mode !== 'all' || pricingType !== 'all' || sort !== 'relevance'

  return (
    <>
      {/* Main Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <input
              type="text"
              placeholder="Search by role, company, or tech stack (e.g. Next.js, AI, Google)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={mode}
              onChange={(e) => { setMode(e.target.value); setPage(1) }}
              className="form-select"
              style={{ width: 'auto', minWidth: '130px' }}
            >
              <option value="all">Any Work Mode</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="offline">In-Person</option>
            </select>

            <select
              value={pricingType}
              onChange={(e) => { setPricingType(e.target.value); setPage(1) }}
              className="form-select"
              style={{ width: 'auto', minWidth: '120px' }}
            >
              <option value="all">Any Price</option>
              <option value="free">100% Free</option>
              <option value="paid">Paid</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="relevance">Top Match</option>
              <option value="deadline_asc">Closing Soonest</option>
              <option value="newest">Recently Added</option>
              <option value="stipend_desc">Highest Stipend</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn btn-outline"
                style={{ padding: '0.625rem 0.875rem', fontSize: '0.8125rem', gap: '0.375rem' }}
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </form>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none',
        }}>
          {categories.map((c) => {
            const isSelected = category === c.value
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => { setCategory(c.value); setPage(1) }}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-medium)',
                  background: isSelected ? 'var(--accent-indigo)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{opportunities.length}</strong> of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> verified opportunities
        </div>
      </div>

      {/* Content Grid / Loading / Empty State */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-panel" style={{ height: '240px', padding: '1.25rem' }}>
              <div className="skeleton" style={{ width: '40%', height: '20px', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ width: '60%', height: '16px', marginBottom: '1.5rem' }} />
              <div className="skeleton" style={{ width: '100%', height: '40px', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ width: '50%', height: '20px' }} />
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
          }}>
            <Filter size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No opportunities matched your filters</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Try expanding your search query, switching categories, or clearing selected work modes.
          </p>
          <button onClick={clearAllFilters} className="btn btn-secondary">
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {opportunities.map((opp: any) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              matchScore={opp.relevanceScore}
              matchReasons={opp.relevanceBreakdown?.explanationTags}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '3.5rem',
        }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem' }}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default function OpportunitiesPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Discover Opportunities
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Explore curated tech opportunities with deterministic match scoring, deadline tracking, and verified provenance.
        </p>
      </div>

      <Suspense fallback={
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-indigo)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading discovery catalogue...</p>
        </div>
      }>
        <OpportunitiesList />
      </Suspense>
    </div>
  )
}
