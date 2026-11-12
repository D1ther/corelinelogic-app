import { useState } from 'react'
import { Menu, X, Terminal } from 'lucide-react'
import { NAV_ITEMS, SITE_CONFIG, type AppRoute } from '../config/site'
import { LogoMark } from './Logo'

interface HeaderProps {
  currentRoute: AppRoute
  onNavigate: (route: AppRoute) => void
}

export function Header({ currentRoute, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (route: AppRoute) => {
    setMobileOpen(false)
    onNavigate(route)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          href="/"
          className="brand-link"
          onClick={(e) => {
            e.preventDefault()
            handleNav('/')
          }}
        >
          <LogoMark size={28} />
          <span>{SITE_CONFIG.brandName}</span>
          <span className="brand-tag">{SITE_CONFIG.apiVersion}</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.route}
              type="button"
              className={`nav-link ${currentRoute === item.route ? 'active' : ''}`}
              onClick={() => handleNav(item.route)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleNav('/docs')}
          >
            <Terminal size={14} />
            API Reference
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleNav('/workbench')}
          >
            Open Workbench
          </button>
        </div>

        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.route}
                type="button"
                className={`nav-link ${currentRoute === item.route ? 'active' : ''}`}
                style={{ textAlign: 'left', width: '100%' }}
                onClick={() => handleNav(item.route)}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginTop: 8, width: '100%' }}
              onClick={() => handleNav('/workbench')}
            >
              Open Workbench
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
