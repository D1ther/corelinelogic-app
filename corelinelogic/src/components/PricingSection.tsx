import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { AppRoute } from '../config/site'

interface PricingSectionProps {
  onNavigate: (route: AppRoute) => void
  standalone?: boolean
}

const PLANS = [
  {
    name: 'Sandbox',
    price: '$0',
    period: '/ month',
    summary: 'For logistics engineers evaluating route parsing schemas and API responses.',
    featured: false,
    ctaLabel: 'Start in Sandbox',
    features: [
      '500 parsed tariff/route documents per month',
      'Interactive Web Workbench & JSON schema export',
      'UN/LOCODE & European border crossing mapping',
      'REST API key (rate limited to 30 req/min)',
      'Email support via engineering desk',
    ],
  },
  {
    name: 'Operations',
    price: '$240',
    period: '/ month',
    summary: 'For freight forwarders and dispatch teams automating carrier rate & lane intake.',
    featured: true,
    ctaLabel: 'Request Operations Access',
    features: [
      '15,000 parsed route & carrier documents per month',
      'Automated email relay & S3 batch ingestion',
      'Real-time signed webhook sync to TMS / ERP',
      'Carrier capability registry & corridor monitoring',
      'Priority support & custom field mapping',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    summary: 'For multi-branch 3PL operators requiring isolated pipelines and custom SLAs.',
    featured: false,
    ctaLabel: 'Contact Sales',
    features: [
      'High-volume parsing & dedicated worker queues',
      'Custom SAP TM / CargoWise / Oracle OTM adapters',
      'Isolated AWS VPC / KMS customer-managed keys',
      'EU / regional data residency configuration',
      'Dedicated onboarding engineer in Lviv / CET timezone',
    ],
  },
]

const FAQS = [
  {
    q: 'What input formats can CorelineLogic normalize?',
    a: 'The pipeline processes carrier rate cards in PDF and XLSX, dispatch email notices, corridor announcements, and structured/semi-structured CSV or JSON feeds.',
  },
  {
    q: 'How does CorelineLogic prevent LLM extraction errors in tariff numbers?',
    a: 'Foundation model inference on Amazon Bedrock is paired with deterministic regex/numeric post-processors, ISO currency verification, and UN/LOCODE lookup tables. Any field that cannot be deterministically validated is flagged in the validations array.',
  },
  {
    q: 'Do you support Ukrainian and EU cross-border logistics corridors?',
    a: 'Yes. Built in Lviv, Ukraine, the schema includes native mapping for major UA-EU border checkpoints (Korczowa/Krakivets, Yahodyn/Dorohusk, Shehyni/Medyka, Chop/Zahony, Constanta/Danube ports) alongside standard European UN/LOCODE hubs.',
  },
  {
    q: 'Are customer rate sheets used to train shared AI models?',
    a: 'No. Tenant documents and carrier contracts remain isolated to your workspace and are never used to train third-party or shared foundation models.',
  },
]

export function PricingSection({ onNavigate, standalone = false }: PricingSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <section className="section section-surface" id="pricing">
      <div className="container">
        <div className="section-header">
          <div className="section-kicker">Commercial Licensing</div>
          {standalone ? (
            <h1 className="section-title" style={{ fontSize: 36 }}>
              Transparent usage-based plans for freight teams
            </h1>
          ) : (
            <h2 className="section-title">Predictable pricing aligned with lane volume</h2>
          )}
          <p className="section-desc">
            Start in the Sandbox environment to validate output schemas against your real carrier
            documents before moving into production TMS sync.
          </p>
        </div>

        <div className="grid-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>{plan.name}</h3>
                  {plan.featured && <span className="badge badge-accent">Recommended</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.55 }}>{plan.summary}</p>
              </div>

              <ul className="check-list">
                {plan.features.map((feat) => (
                  <li key={feat}>
                    <Check size={16} className="check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <button
                  type="button"
                  className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
                  onClick={() => onNavigate('/contact')}
                >
                  {plan.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 18 }}>
            Frequently Asked Technical Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((item, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={item.q}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    background: '#f8fafc',
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: 15,
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 18px 16px',
                        fontSize: 14.5,
                        color: '#475569',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
