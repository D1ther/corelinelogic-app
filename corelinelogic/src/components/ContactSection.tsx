import { useState, type FormEvent } from 'react'
import { Building2, CheckCircle2, Globe, Mail, MapPin, Send } from 'lucide-react'
import { SITE_CONFIG } from '../config/site'

interface ContactSectionProps {
  standalone?: boolean
}

export function ContactSection({ standalone = false }: ContactSectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [volume, setVolume] = useState('1,000 - 10,000 lanes / mo')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !email.includes('@') || !company.trim()) {
      setError('Please enter your name, work email address, and company name.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header">
          <div className="section-kicker">Onboarding &amp; Engineering Contact</div>
          {standalone ? (
            <h1 className="section-title" style={{ fontSize: 36 }}>
              Request Sandbox API Access or Technical Walkthrough
            </h1>
          ) : (
            <h2 className="section-title">Request API credentials or discuss custom corridors</h2>
          )}
          <p className="section-desc">
            Share your carrier document formats and target transport corridors. Our engineering team
            in Lviv responds within one business day.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 28,
            }}
          >
            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f766e' }}>
                  <CheckCircle2 size={20} />
                  <strong style={{ fontSize: 17 }}>Access Request Recorded</strong>
                </div>
                <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.6 }}>
                  Thank you, <strong>{name}</strong> ({company}). Your request has been prepared for{' '}
                  <code>{email}</code>. For immediate sandbox provisioning, you can also email us
                  directly at{' '}
                  <a
                    href={`mailto:${SITE_CONFIG.email}?subject=Sandbox%20Access%20-%20${encodeURIComponent(company)}`}
                    style={{ color: '#1d4ed8', fontWeight: 500 }}
                  >
                    {SITE_CONFIG.email}
                  </a>
                  .
                </p>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSubmitted(false)
                      setName('')
                      setEmail('')
                      setCompany('')
                      setNotes('')
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-grid" noValidate>
                <div className="field-group">
                  <label className="field-label" htmlFor="contact-name">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="field-input"
                    placeholder="Olena Kovalenko"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="contact-email">
                    Corporate Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="field-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="contact-company">
                    Company / Freight Organization
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    className="field-input"
                    placeholder="WestCargo Forwarding LLC"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="contact-volume">
                    Estimated Monthly Volume
                  </label>
                  <select
                    id="contact-volume"
                    className="field-select"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                  >
                    <option value="Under 500 documents / mo">Under 500 documents / mo (Sandbox)</option>
                    <option value="1,000 - 10,000 lanes / mo">1,000 - 10,000 lanes / mo</option>
                    <option value="10,000 - 50,000 lanes / mo">10,000 - 50,000 lanes / mo</option>
                    <option value="50,000+ lanes / mo">50,000+ lanes / mo (Enterprise)</option>
                  </select>
                </div>

                <div className="field-group full">
                  <label className="field-label" htmlFor="contact-notes">
                    Target Corridors &amp; Document Formats
                  </label>
                  <textarea
                    id="contact-notes"
                    className="field-textarea"
                    placeholder="Example: Parsing PDF/XLSX carrier tariffs for UA-PL-DE road FTL and integrating JSON webhooks into our internal TMS."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {error && (
                  <div
                    className="field-group full"
                    style={{ fontSize: 13.5, color: '#b91c1c', fontWeight: 500 }}
                  >
                    {error}
                  </div>
                )}

                <div className="field-group full">
                  <button type="submit" className="btn btn-primary">
                    <Send size={14} />
                    Request Sandbox Credentials
                  </button>
                </div>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="icon-box">
                  <Mail size={17} />
                </div>
                <div>
                  <div className="kv-label" style={{ marginBottom: 2 }}>
                    Direct Engineering &amp; Founders Contact
                  </div>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="mono"
                    style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="icon-box">
                  <MapPin size={17} />
                </div>
                <div>
                  <div className="kv-label" style={{ marginBottom: 2 }}>
                    Operating Headquarters
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                    {SITE_CONFIG.location}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    Eastern European Time (EET / UTC+2) · EU &amp; UA Corridor Coverage
                  </div>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="icon-box">
                  <Building2 size={17} />
                </div>
                <div>
                  <div className="kv-label" style={{ marginBottom: 2 }}>
                    Official Domain &amp; Verification
                  </div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                    {SITE_CONFIG.url}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Globe size={13} />
                    <span>B2B Freight &amp; Route Intelligence SaaS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
