import { useEffect, useState } from 'react'
import {
  ArrowRight,
  FileSpreadsheet,
  Route,
  ShieldCheck,
  Terminal,
  Truck,
} from 'lucide-react'
import { ApiDocsView } from './components/ApiDocsView'
import { ArchitectureSection } from './components/ArchitectureSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeroPreview } from './components/HeroPreview'
import { PrivacyPolicyView, TermsOfServiceView } from './components/LegalViews'
import { PricingSection } from './components/PricingSection'
import { Workbench } from './components/Workbench'
import { SITE_CONFIG, type AppRoute } from './config/site'

const VALID_ROUTES: ReadonlySet<string> = new Set([
  '/',
  '/workbench',
  '/docs',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
])

const PAGE_TITLES: Record<AppRoute, string> = {
  '/': `${SITE_CONFIG.brandName} — Carrier & Route Intelligence Infrastructure`,
  '/workbench': `Interactive Workbench — ${SITE_CONFIG.brandName}`,
  '/docs': `API Documentation — ${SITE_CONFIG.brandName}`,
  '/pricing': `Pricing — ${SITE_CONFIG.brandName}`,
  '/contact': `Contact & Access — ${SITE_CONFIG.brandName}`,
  '/privacy': `Privacy Policy — ${SITE_CONFIG.brandName}`,
  '/terms': `Terms of Service — ${SITE_CONFIG.brandName}`,
}

function normalizePathname(pathname: string): AppRoute {
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  if (VALID_ROUTES.has(trimmed)) {
    return trimmed as AppRoute
  }
  return '/'
}

const CAPABILITIES = [
  {
    icon: Truck,
    title: 'Carrier Capability & Fleet Indexing',
    desc: 'Extract and structure operator profiles, equipment classes (FTL, LTL, Reefer, ADR, Intermodal), EORI identifiers, and CMR insurance limits from unstructured onboarding bulletins.',
    meta: 'ENTITY RESOLUTION · FLEET SCHEMA',
  },
  {
    icon: Route,
    title: 'Cross-Border Corridor Topology',
    desc: 'Resolve city strings into ISO UN/LOCODE hubs and map border crossings, customs regimes (T1 / EX-1), and multi-leg road or feeder sequences automatically.',
    meta: 'UN/LOCODE · CUSTOMS CHECKPOINTS',
  },
  {
    icon: FileSpreadsheet,
    title: 'Tariff & Rate-Card Normalization',
    desc: 'Ingest disparate PDF rate matrices, XLSX spreadsheets, and dispatcher emails into uniform currency, Incoterms, surcharge, and transit-window records.',
    meta: 'PDF / XLSX / EMAIL · RATE ENGINE',
  },
  {
    icon: ShieldCheck,
    title: 'Schema-Validated AI Extraction',
    desc: 'Combine Amazon Bedrock foundation models with deterministic geographic and numeric guardrails so every output record carries verifiable confidence metrics.',
    meta: 'AMAZON BEDROCK · JSON SCHEMA',
  },
]

export function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    normalizePathname(window.location.pathname)
  )

  useEffect(() => {
    document.title = PAGE_TITLES[route]
  }, [route])

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizePathname(window.location.pathname))
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextRoute: AppRoute) => {
    if (nextRoute !== route) {
      window.history.pushState({}, '', nextRoute)
      setRoute(nextRoute)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <Header currentRoute={route} onNavigate={navigate} />

      <main className="main-content">
        {route === '/' && (
          <>
            <section className="hero-section">
              <div className="container hero-grid">
                <div>
                  <div className="section-kicker">
                    B2B Logistics &amp; Route Data Platform
                  </div>
                  <h1 className="hero-title">
                    Structured carrier and route intelligence from unstructured freight data.
                  </h1>
                  <p className="hero-subtitle">
                    CorelineLogic ingests carrier rate sheets, corridor notices, and transport
                    operator directories, normalizing them through foundation model pipelines into
                    UN/LOCODE route graphs and schema-validated REST APIs.
                  </p>

                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => navigate('/workbench')}
                    >
                      Launch Interactive Workbench
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/docs')}
                    >
                      <Terminal size={15} />
                      Inspect API Spec
                    </button>
                  </div>

                  <div className="hero-specs">
                    <div>
                      <div className="spec-label">Geo Standard</div>
                      <div className="spec-value">UN/LOCODE &amp; EU Borders</div>
                    </div>
                    <div>
                      <div className="spec-label">Inference Stack</div>
                      <div className="spec-value">Amazon Bedrock + Guardrails</div>
                    </div>
                    <div>
                      <div className="spec-label">Engineering Base</div>
                      <div className="spec-value">{SITE_CONFIG.location}</div>
                    </div>
                  </div>
                </div>

                <HeroPreview />
              </div>
            </section>

            <section className="section" id="capabilities">
              <div className="container">
                <div className="section-header">
                  <div className="section-kicker">Core Capabilities</div>
                  <h2 className="section-title">
                    Eliminate manual tariff entry and fragmented carrier spreadsheets
                  </h2>
                  <p className="section-desc">
                    Freight forwarders and dispatch operations lose hours translating inconsistent
                    carrier PDFs, emails, and corridor bulletins. CorelineLogic standardizes every
                    incoming lane before it reaches your TMS.
                  </p>
                </div>

                <div className="grid-2">
                  {CAPABILITIES.map((cap) => {
                    const IconComponent = cap.icon
                    return (
                      <div key={cap.title} className="feature-card">
                        <div className="icon-box">
                          <IconComponent size={18} />
                        </div>
                        <h3 className="feature-title">{cap.title}</h3>
                        <p className="feature-desc">{cap.desc}</p>
                        <div className="feature-meta">{cap.meta}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="section section-surface" id="workbench">
              <div className="container">
                <div className="section-header">
                  <div className="section-kicker">Interactive MVP Workbench</div>
                  <h2 className="section-title">
                    Evaluate route normalization and carrier indexing in real time
                  </h2>
                  <p className="section-desc">
                    Select a freight tariff preset or paste any raw route announcement below to
                    inspect extracted UN/LOCODE hubs, border checkpoints, equipment specs, and JSON
                    payloads.
                  </p>
                </div>

                <Workbench />
              </div>
            </section>

            <ArchitectureSection />
            <ApiDocsView />
            <PricingSection onNavigate={navigate} />
            <ContactSection />
          </>
        )}

        {route === '/workbench' && (
          <section className="section">
            <div className="container">
              <div className="section-header">
                <div className="section-kicker">Interactive Evaluation Environment</div>
                <h1 className="section-title" style={{ fontSize: 36 }}>
                  Route Parser &amp; Carrier Registry Workbench
                </h1>
                <p className="section-desc">
                  Test unstructured carrier announcements, rate sheets, and corridor schedules.
                  Inspect deterministic schema checks, topology diagrams, and normalized JSON
                  output.
                </p>
              </div>
              <Workbench />
            </div>
          </section>
        )}

        {route === '/docs' && <ApiDocsView standalone />}
        {route === '/pricing' && <PricingSection onNavigate={navigate} standalone />}
        {route === '/contact' && <ContactSection standalone />}
        {route === '/privacy' && <PrivacyPolicyView />}
        {route === '/terms' && <TermsOfServiceView />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  )
}

export default App
