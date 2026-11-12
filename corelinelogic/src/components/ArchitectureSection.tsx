import { Cpu, Database, FileInput, Lock, MapPinned, Webhook } from 'lucide-react'

const PIPELINE_STAGES = [
  {
    step: '01 / INGESTION',
    title: 'Multi-Format Freight Intake',
    detail:
      'Collects carrier rate sheets, tariff tables, portal announcements, and dispatch bulletins from email relays, object storage, and REST uploads.',
    tech: 'PDF · XLSX · CSV · MIME',
    icon: FileInput,
  },
  {
    step: '02 / EXTRACTION',
    title: 'Document Layout & Table Parsing',
    detail:
      'Preserves multi-column tariff matrices, surcharge footnotes, and route leg schedules before semantic processing.',
    tech: 'OCR · Table Segmenter',
    icon: Database,
  },
  {
    step: '03 / AI INFERENCE',
    title: 'Foundation Model Normalization',
    detail:
      'Applies Amazon Bedrock foundation models and embeddings to resolve carrier names, equipment classes, Incoterms, and corridor constraints.',
    tech: 'Amazon Bedrock · JSON Schema',
    icon: Cpu,
  },
  {
    step: '04 / GEO VALIDATION',
    title: 'UN/LOCODE & Corridor Graph',
    detail:
      'Maps city strings to ISO 3166 / UN/LOCODE hubs, identifies external border crossings, and validates realistic corridor sequences.',
    tech: 'UN/LOCODE · PostGIS',
    icon: MapPinned,
  },
  {
    step: '05 / DELIVERY',
    title: 'API & TMS Webhook Sync',
    detail:
      'Delivers typed JSON records and signed change-detection webhooks directly into dispatch boards, ERP systems, and rate engines.',
    tech: 'REST · Webhooks · Parquet',
    icon: Webhook,
  },
]

const SECURITY_CONTROLS = [
  {
    title: 'Tenant-Isolated Processing',
    detail:
      'Customer tariff sheets and carrier contracts remain logically separated per workspace and are never pooled into shared training corpora.',
  },
  {
    title: 'Encryption in Transit & at Rest',
    detail:
      'All API traffic is enforced over TLS 1.3; persisted freight records and audit logs are encrypted using managed KMS keys (AES-256).',
  },
  {
    title: 'Deterministic Schema Guardrails',
    detail:
      'Every model extraction passes strict JSON Schema and currency/UNLOCODE validation checks before reaching production webhooks.',
  },
]

export function ArchitectureSection() {
  return (
    <section className="section section-surface" id="architecture">
      <div className="container">
        <div className="section-header">
          <div className="section-kicker">System Architecture</div>
          <h2 className="section-title">
            Built for deterministic freight data pipelines on AWS
          </h2>
          <p className="section-desc">
            CorelineLogic combines foundation model inference on Amazon Bedrock with strict
            geospatial and tariff validation rules so logistics engineering teams receive reliable,
            machine-readable records instead of raw text summaries.
          </p>
        </div>

        <div className="arch-flow">
          {PIPELINE_STAGES.map((stage) => {
            const IconComponent = stage.icon
            return (
              <div key={stage.step} className="arch-node">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="arch-step-num">{stage.step}</span>
                  <IconComponent size={16} color="#1e3a5f" />
                </div>
                <h3 className="arch-title">{stage.title}</h3>
                <p className="arch-detail">{stage.detail}</p>
                <div className="arch-tech">{stage.tech}</div>
              </div>
            )
          })}
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Lock size={16} color="#1e3a5f" />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
              Data Governance &amp; Operational Controls
            </span>
          </div>
          <div className="grid-3">
            {SECURITY_CONTROLS.map((ctrl) => (
              <div key={ctrl.title}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                  {ctrl.title}
                </div>
                <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.55 }}>
                  {ctrl.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
