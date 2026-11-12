import { useState } from 'react'
import { CheckCircle2, Code2, FileText } from 'lucide-react'

const SAMPLE_NOTICE = `Subject: Weekly EU Corridor Capacity - Carpathian Freight Lines LLC
Lane: Lviv (UA) -> Warsaw (PL) -> Berlin (DE)
Border: Korczowa / Krakivets (eCherha booked)
Equipment: FTL 20t Tautliner / Mega 100cbm | ADR Class 3
Transit: 48-60h door-to-door | Customs: T1 / EX-1
Rate: EUR 2,450 all-in (DAP Berlin)`

const NORMALIZED_JSON = `{
  "corridor_id": "cor_ualwo_plwaw_deber",
  "carrier": {
    "name": "Carpathian Freight Lines LLC",
    "eori_verified": true
  },
  "route": [
    { "hub": "Lviv, UA", "code": "UALWO" },
    { "hub": "Korczowa", "role": "border" },
    { "hub": "Warsaw, PL", "code": "PLWAW" },
    { "hub": "Berlin, DE", "code": "DEBER" }
  ],
  "equipment": ["FTL_20T", "MEGA_100CBM", "ADR_3"],
  "transit_hours": { "min": 48, "max": 60 },
  "tariff": {
    "amount": 2450,
    "currency": "EUR",
    "incoterms": "DAP"
  },
  "confidence": 0.98
}`

export function HeroPreview() {
  const [view, setView] = useState<'json' | 'source'>('json')

  return (
    <div className="panel" aria-label="Sample extraction output">
      <div className="panel-header">
        <div className="panel-title">
          <span className="badge badge-ok">
            <CheckCircle2 size={12} />
            Schema v1.4 Valid
          </span>
          <span className="mono" style={{ fontSize: 12, color: '#64748b' }}>
            POST /v1/routes/parse
          </span>
        </div>

        <div className="tab-group" role="tablist" aria-label="Preview view mode">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'json'}
            className={`tab-btn ${view === 'json' ? 'active' : ''}`}
            onClick={() => setView('json')}
          >
            <Code2 size={12} />
            JSON
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'source'}
            className={`tab-btn ${view === 'source' ? 'active' : ''}`}
            onClick={() => setView('source')}
          >
            <FileText size={12} />
            Raw Input
          </button>
        </div>
      </div>

      {view === 'json' ? (
        <pre className="code-block">{NORMALIZED_JSON}</pre>
      ) : (
        <div className="raw-notice-box" style={{ whiteSpace: 'pre-wrap' }}>
          {SAMPLE_NOTICE}
        </div>
      )}

      <div className="kv-grid">
        <div className="kv-cell">
          <div className="kv-label">Normalized Corridor</div>
          <div className="kv-val mono">UALWO -&gt; PLWAW -&gt; DEBER</div>
        </div>
        <div className="kv-cell">
          <div className="kv-label">Border Checkpoint</div>
          <div className="kv-val">Korczowa / Krakivets (T1)</div>
        </div>
        <div className="kv-cell">
          <div className="kv-label">Indicative Rate</div>
          <div className="kv-val">EUR 2,450 (DAP)</div>
        </div>
        <div className="kv-cell">
          <div className="kv-label">Extraction Confidence</div>
          <div className="kv-val mono">0.98 / Schema Passed</div>
        </div>
      </div>
    </div>
  )
}
