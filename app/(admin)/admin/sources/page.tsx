'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Rss,
  Play,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)

  // Add source form
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [feedUrl, setFeedUrl] = useState('')
  const [adapterType, setAdapterType] = useState('rss')
  const [trustScore, setTrustScore] = useState('0.95')
  const [adding, setAdding] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const loadSources = () => {
    fetch('/api/admin/sources')
      .then((res) => res.json())
      .then((json) => {
        if (json.sources) setSources(json.sources)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSources()
  }, [])

  const handleRunSync = async () => {
    setSyncing(true)
    setSyncResult(null)

    try {
      const res = await fetch('/api/ingestion/run', {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok) {
        setSyncResult(data.summary)
        loadSources()
      } else {
        setErrorMsg(data.error || 'Sync execution failed')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Sync execution failed')
    } finally {
      setSyncing(false)
    }
  }

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          feed_url: feedUrl,
          adapter_type: adapterType,
          trust_score: Number(trustScore),
          enabled: true,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create source')
      }

      setName('')
      setFeedUrl('')
      setShowAddForm(false)
      loadSources()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-indigo)', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading ingestion sources...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Admin Console</span>
        </Link>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Ingestion Sources & Deduplication Feeds
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Configured programmatic adapters, trust rankings, and pipeline synchronizers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleRunSync}
            disabled={syncing}
            className="btn btn-primary"
            style={{ padding: '0.625rem 1.25rem' }}
          >
            {syncing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Run Ingestion Pipeline Now</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-secondary"
            style={{ padding: '0.625rem 1.25rem' }}
          >
            <Plus size={16} />
            <span>Add Feed</span>
          </button>
        </div>
      </div>

      {/* Sync Execution Metrics Banner */}
      {syncResult && (
        <div className="glass-panel" style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6ee7b7', fontWeight: 700, marginBottom: '0.5rem' }}>
            <CheckCircle size={18} />
            <span>Ingestion Pipeline Executed Successfully</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.875rem' }}>
            <div>Sources Queried: <strong>{syncResult.processedSources}</strong></div>
            <div>New Opportunities Added: <strong style={{ color: '#6ee7b7' }}>{syncResult.itemsIngested}</strong></div>
            <div>Duplicates Prevented: <strong style={{ color: 'var(--accent-amber)' }}>{syncResult.duplicatesSkipped}</strong></div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="glass-panel" style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#fca5a5',
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add Feed Form Modal / Dropdown */}
      {showAddForm && (
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Register New Ingestion Source</h2>
          <form onSubmit={handleAddSource}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Source / Provider Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Unstop Hackathons RSS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feed Endpoint / URL</label>
                <input
                  required
                  type="url"
                  placeholder="https://example.com/feed.xml"
                  value={feedUrl}
                  onChange={(e) => setFeedUrl(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Adapter Protocol</label>
                <select
                  value={adapterType}
                  onChange={(e) => setAdapterType(e.target.value)}
                  className="form-select"
                >
                  <option value="rss">RSS / Atom XML Feed</option>
                  <option value="json">Structured JSON API</option>
                  <option value="api">REST Partner Webhook</option>
                  <option value="manual">Manual Curated Stream</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trust Score (0.0 to 1.0)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={trustScore}
                  onChange={(e) => setTrustScore(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adding}
                className="btn btn-primary"
              >
                {adding ? 'Saving...' : 'Register Source'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sources Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {sources.map((src) => (
          <div key={src.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Rss size={18} color="var(--accent-indigo)" />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{src.name}</h3>
              </div>
              <span className="badge badge-emerald">
                {src.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', wordBreak: 'break-all', marginBottom: '1rem' }}>
              {src.feed_url}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '1rem',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Adapter: </span>
                <strong style={{ textTransform: 'uppercase' }}>{src.adapter_type}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Trust Score: </span>
                <strong>{(src.trust_score * 100).toFixed(0)}%</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)' }}>Last synced: </span>
                <span>{src.last_fetched_at ? new Date(src.last_fetched_at).toLocaleTimeString() : 'Never'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
