import { SITE_CONFIG, type AppRoute } from '../config/site'
import { LogoMark } from './Logo'

interface FooterProps {
  onNavigate: (route: AppRoute) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="brand-link">
              <LogoMark size={24} />
              <span>{SITE_CONFIG.brandName}</span>
            </div>
            <p style={{ fontSize: 13.5, color: '#475569', maxWidth: 320, lineHeight: 1.55 }}>
              Carrier capability and freight route normalization infrastructure for logistics
              engineering, dispatch, and procurement teams.
            </p>
            <div className="mono" style={{ fontSize: 12.5, color: '#475569' }}>
              <div>{SITE_CONFIG.location}</div>
              <div>
                <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
              </div>
            </div>
          </div>

          <div>
            <div className="footer-heading">Platform</div>
            <ul className="footer-links">
              <li>
                <button type="button" className="footer-link" onClick={() => onNavigate('/')}>
                  Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link"
                  onClick={() => onNavigate('/workbench')}
                >
                  Interactive Workbench
                </button>
              </li>
              <li>
                <button type="button" className="footer-link" onClick={() => onNavigate('/docs')}>
                  API Reference
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link"
                  onClick={() => onNavigate('/pricing')}
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Company</div>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  className="footer-link"
                  onClick={() => onNavigate('/contact')}
                >
                  Contact &amp; Access
                </button>
              </li>
              <li>
                <a className="footer-link" href={`mailto:${SITE_CONFIG.email}`}>
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <span className="footer-link" style={{ cursor: 'default', textDecoration: 'none' }}>
                  {SITE_CONFIG.location}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Legal &amp; Compliance</div>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  className="footer-link"
                  onClick={() => onNavigate('/privacy')}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" className="footer-link" onClick={() => onNavigate('/terms')}>
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; 2026 {SITE_CONFIG.legalEntity}. Operated from {SITE_CONFIG.location}.
          </span>
          <span className="mono">
            {SITE_CONFIG.domain} · API {SITE_CONFIG.apiVersion}
          </span>
        </div>
      </div>
    </footer>
  )
}
