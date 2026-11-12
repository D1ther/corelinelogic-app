export type AppRoute =
  | '/'
  | '/workbench'
  | '/docs'
  | '/pricing'
  | '/contact'
  | '/privacy'
  | '/terms'

export const SITE_CONFIG = {
  brandName: 'CorelineLogic',
  legalEntity: 'CorelineLogic',
  domain: 'corelinelogic.com',
  url: 'https://corelinelogic.com',
  email: 'maxim@corelinelogic.com',
  location: 'Lviv, Ukraine',
  regionNote: 'EU / Eastern Europe Freight Corridors',
  apiVersion: 'v1.4',
  lastUpdated: 'November 12, 2026',
} as const

export const NAV_ITEMS: ReadonlyArray<{ label: string; route: AppRoute }> = [
  { label: 'Platform', route: '/' },
  { label: 'Workbench', route: '/workbench' },
  { label: 'API Docs', route: '/docs' },
  { label: 'Pricing', route: '/pricing' },
  { label: 'Contact', route: '/contact' },
]
