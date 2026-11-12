import { SITE_CONFIG } from '../config/site'

export function PrivacyPolicyView() {
  return (
    <section className="section">
      <div className="container">
        <article className="prose-shell">
          <div className="section-kicker">Legal Documentation</div>
          <h1>Privacy Policy</h1>
          <p className="mono" style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
            Effective Date: {SITE_CONFIG.lastUpdated} · {SITE_CONFIG.legalEntity} ({SITE_CONFIG.location})
          </p>

          <p>
            {SITE_CONFIG.legalEntity} (&quot;CorelineLogic&quot;, &quot;we&quot;, &quot;our&quot;)
            operates the B2B logistics intelligence platform accessible at{' '}
            <a href={SITE_CONFIG.url} style={{ color: '#1d4ed8' }}>
              {SITE_CONFIG.url}
            </a>
            . This Privacy Policy explains how we collect, process, and protect business contact
            details and logistics documents submitted to our service.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Account &amp; Business Contact Data:</strong> Name, corporate email address,
              organization name, billing details, and technical inquiry metadata submitted when
              requesting API credentials or support.
            </li>
            <li>
              <strong>Customer Freight &amp; Corridor Documents:</strong> Rate sheets, route
              manifests, tariff spreadsheets, and carrier capability records explicitly uploaded by
              an authorized workspace user for normalization.
            </li>
            <li>
              <strong>Operational Telemetry:</strong> API request timestamps, HTTP response codes,
              and schema validation logs required to maintain service reliability and security.
            </li>
          </ul>

          <h2>2. How We Use Information</h2>
          <p>
            We process submitted data exclusively to provide, maintain, and secure the CorelineLogic
            extraction pipeline, API delivery, and customer support. Customer-uploaded tariff sheets
            and contract corridors are isolated by tenant workspace and are not sold to third
            parties or used to train public or shared AI models.
          </p>

          <h2>3. Infrastructure &amp; Subprocessors</h2>
          <p>
            CorelineLogic operates cloud workloads using managed Amazon Web Services (AWS)
            infrastructure, including encrypted object storage, relational databases, and managed
            foundation model inference endpoints (Amazon Bedrock) configured with zero-retention
            inference policies where supported.
          </p>

          <h2>4. Data Retention &amp; Security</h2>
          <p>
            All API traffic is encrypted in transit using TLS 1.3 and persisted records are
            encrypted at rest using AES-256. Workspace administrators may request deletion of
            uploaded documents or account records at any time.
          </p>

          <h2>5. Contact &amp; Data Requests</h2>
          <p>
            For privacy inquiries, GDPR data access requests, or workspace deletion requests,
            contact our team in {SITE_CONFIG.location} at{' '}
            <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: '#1d4ed8' }}>
              {SITE_CONFIG.email}
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  )
}

export function TermsOfServiceView() {
  return (
    <section className="section">
      <div className="container">
        <article className="prose-shell">
          <div className="section-kicker">Legal Documentation</div>
          <h1>Terms of Service</h1>
          <p className="mono" style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
            Effective Date: {SITE_CONFIG.lastUpdated} · {SITE_CONFIG.legalEntity} ({SITE_CONFIG.location})
          </p>

          <p>
            These Terms of Service govern access to and use of the {SITE_CONFIG.brandName} web
            platform, route normalization workbench, and REST APIs located at{' '}
            <a href={SITE_CONFIG.url} style={{ color: '#1d4ed8' }}>
              {SITE_CONFIG.url}
            </a>
            .
          </p>

          <h2>1. Scope of Service</h2>
          <p>
            CorelineLogic provides B2B software tools for parsing, normalizing, and structuring
            freight carrier capabilities, transport corridors, schedules, and commercial rate cards
            into standardized schemas for logistics and dispatch workflows.
          </p>

          <h2>2. Acceptable Use &amp; Data Compliance</h2>
          <ul>
            <li>
              Customers represent that they hold authorization to submit any rate cards, carrier
              records, or corridor schedules processed through the platform.
            </li>
            <li>
              The service may not be used for unauthorized third-party network intrusion, bypassing
              access controls, harvesting personal consumer data, or transmitting unlawful content.
            </li>
            <li>
              API keys are scoped to the registered organization and must not be shared publicly or
              used to circumvent plan rate limits.
            </li>
          </ul>

          <h2>3. Output Verification &amp; Operational Responsibility</h2>
          <p>
            While CorelineLogic applies deterministic schema checks, UN/LOCODE validation, and
            confidence scoring to every normalized corridor, commercial freight quotes, customs
            clearances, and carrier transit commitments must be verified by authorized dispatch
            personnel prior to cargo execution.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            Customers retain full ownership of all uploaded rate sheets, documents, and resulting
            normalized datasets. CorelineLogic retains all rights to the platform software,
            normalization schemas, APIs, and brand assets.
          </p>

          <h2>5. Billing, Termination &amp; Contact</h2>
          <p>
            Paid plans are billed according to the active subscription tier selected by the
            organization. For contractual questions or enterprise SLA terms, contact{' '}
            <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: '#1d4ed8' }}>
              {SITE_CONFIG.email}
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  )
}
