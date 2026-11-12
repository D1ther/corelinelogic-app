import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { SITE_CONFIG } from '../config/site'

const CURL_SAMPLE = `curl -X POST \\
  https://api.${SITE_CONFIG.domain}/v1/routes/parse \\
  -H "Authorization: Bearer cl_live_984f2a..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_type": "rate_sheet_text",
    "resolve_unlocode": true,
    "content": "Carpathian Freight Lines LLC: \\
      Lviv -> Warsaw -> Berlin via Korczowa. \\
      FTL 20t Tautliner, 48-60h, EUR 2,450 DAP."
  }'`

const TS_SAMPLE = `const res = await fetch(
  "https://api.${SITE_CONFIG.domain}/v1/routes/parse",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${apiKey}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_type: "rate_sheet_text",
      content: rawCarrierNotice,
      resolve_unlocode: true,
    }),
  }
);

const normalizedLane = await res.json();`

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/v1/routes/parse',
    purpose: 'Parse unstructured rate card, dispatch notice, or corridor PDF into normalized lane objects.',
    limit: '120 req/min',
  },
  {
    method: 'GET',
    path: '/v1/carriers',
    purpose: 'Query normalized carrier profiles by equipment capability, border clearance, or hub coverage.',
    limit: '300 req/min',
  },
  {
    method: 'GET',
    path: '/v1/corridors/{corridor_id}',
    purpose: 'Retrieve historical transit time ranges, border nodes, and active operator capacity for a lane.',
    limit: '300 req/min',
  },
  {
    method: 'POST',
    path: '/v1/webhooks',
    purpose: 'Subscribe to HMAC-SHA256 signed notifications when a monitored carrier updates tariffs or schedules.',
    limit: '20 endpoints/org',
  },
]

interface ApiDocsViewProps {
  standalone?: boolean
}

export function ApiDocsView({ standalone = false }: ApiDocsViewProps) {
  const [lang, setLang] = useState<'curl' | 'typescript'>('curl')
  const [copied, setCopied] = useState(false)

  const activeCode = lang === 'curl' ? CURL_SAMPLE : TS_SAMPLE

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="section" id="api-docs">
      <div className="container">
        <div className="section-header">
          <div className="section-kicker">
            <Terminal size={13} />
            API Reference ({SITE_CONFIG.apiVersion})
          </div>
          {standalone ? (
            <h1 className="section-title" style={{ fontSize: 36 }}>
              Developer API &amp; Webhook Specification
            </h1>
          ) : (
            <h2 className="section-title">Developer-ready REST API &amp; TMS integration</h2>
          )}
          <p className="section-desc">
            Integrate CorelineLogic directly into custom dispatch platforms, SAP TM, CargoWise, or
            internal procurement tools using typed JSON endpoints and signed webhook events.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Request Example</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="tab-group">
                  <button
                    type="button"
                    className={`tab-btn ${lang === 'curl' ? 'active' : ''}`}
                    onClick={() => setLang('curl')}
                  >
                    cURL
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${lang === 'typescript' ? 'active' : ''}`}
                    onClick={() => setLang('typescript')}
                  >
                    TypeScript
                  </button>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <pre className="code-block">{activeCode}</pre>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Description</th>
                  <th>Rate Limit</th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map((ep) => (
                  <tr key={ep.path}>
                    <td>
                      <span className="badge badge-accent mono" style={{ marginRight: 6 }}>
                        {ep.method}
                      </span>
                      <div className="mono" style={{ fontSize: 12.5, marginTop: 4, color: '#0f172a' }}>
                        {ep.path}
                      </div>
                    </td>
                    <td>{ep.purpose}</td>
                    <td className="mono" style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                      {ep.limit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {standalone && (
          <div className="grid-3" style={{ marginTop: 28 }}>
            <div className="feature-card">
              <h3 className="feature-title">Authentication</h3>
              <p className="feature-desc">
                Authenticate requests using workspace-scoped Bearer keys passed in the{' '}
                <code>Authorization</code> header. Sandbox keys use the <code>cl_test_</code> prefix;
                production keys use <code>cl_live_</code>.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Webhook Signatures</h3>
              <p className="feature-desc">
                Every webhook event includes an <code>X-Coreline-Signature</code> HMAC-SHA256 digest
                and timestamp header so receivers can verify payload authenticity before ingestion.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Error Semantics</h3>
              <p className="feature-desc">
                Standard HTTP status codes (<code>400</code> invalid payload, <code>401</code>{' '}
                unauthorized, <code>422</code> unresolvable schema, <code>429</code> rate limited)
                with structured machine-readable error codes.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
