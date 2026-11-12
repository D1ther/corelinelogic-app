export type EquipmentType =
  | 'FTL'
  | 'LTL'
  | 'Reefer'
  | 'Intermodal'
  | 'ADR'
  | 'Container'

export interface HubDefinition {
  city: string
  country: string
  unlocode: string
  latLabel: string
}

export interface RoutePreset {
  id: string
  title: string
  category: string
  sourceType: string
  rawText: string
}

export interface NormalizedSegment {
  originCity: string
  originCode: string
  destinationCity: string
  destinationCode: string
  borderCheckpoints: string[]
  estimatedDistanceKm: number
  transitWindow: string
  mode: string
}

export interface ParsedLane {
  laneId: string
  carrierName: string
  corridorCode: string
  origin: HubDefinition
  destination: HubDefinition
  intermediateHubs: HubDefinition[]
  borderCrossings: string[]
  equipment: string[]
  transitWindow: string
  indicativeRate: string
  incoterms: string
  customsRegime: string
  confidenceScore: number
}

export interface ValidationCheck {
  field: string
  status: 'passed' | 'warning'
  detail: string
}

export interface ParsedDocumentResult {
  documentId: string
  processedAt: string
  extractionEngine: string
  carrierDetected: string
  lanes: ParsedLane[]
  segments: NormalizedSegment[]
  equipmentTags: string[]
  borderNodes: string[]
  rateSummary: string
  transitSummary: string
  confidence: number
  validations: ValidationCheck[]
}

export interface CarrierRecord {
  id: string
  name: string
  country: string
  hqCity: string
  primaryModes: EquipmentType[]
  activeCorridors: string[]
  fleetUnits: number
  cmrLimitEur: string
  borderClearance: string
  verificationState: 'Verified' | 'Active Feed'
  updatedDate: string
}

const KNOWN_HUBS: Record<string, HubDefinition> = {
  lviv: { city: 'Lviv', country: 'UA', unlocode: 'UALWO', latLabel: '49.84N 24.03E' },
  lwo: { city: 'Lviv', country: 'UA', unlocode: 'UALWO', latLabel: '49.84N 24.03E' },
  kyiv: { city: 'Kyiv', country: 'UA', unlocode: 'UAIEV', latLabel: '50.45N 30.52E' },
  odesa: { city: 'Odesa', country: 'UA', unlocode: 'UAODS', latLabel: '46.48N 30.73E' },
  odessa: { city: 'Odesa', country: 'UA', unlocode: 'UAODS', latLabel: '46.48N 30.73E' },
  chornomorsk: { city: 'Chornomorsk', country: 'UA', unlocode: 'UAILK', latLabel: '46.30N 30.65E' },
  izmail: { city: 'Izmail', country: 'UA', unlocode: 'UAIZM', latLabel: '45.35N 28.84E' },
  warsaw: { city: 'Warsaw', country: 'PL', unlocode: 'PLWAW', latLabel: '52.23N 21.01E' },
  gdansk: { city: 'Gdansk', country: 'PL', unlocode: 'PLGDN', latLabel: '54.35N 18.65E' },
  krakow: { city: 'Krakow', country: 'PL', unlocode: 'PLKRK', latLabel: '50.06N 19.94E' },
  wroclaw: { city: 'Wroclaw', country: 'PL', unlocode: 'PLWRO', latLabel: '51.11N 17.04E' },
  berlin: { city: 'Berlin', country: 'DE', unlocode: 'DEBER', latLabel: '52.52N 13.40E' },
  hamburg: { city: 'Hamburg', country: 'DE', unlocode: 'DEHAM', latLabel: '53.55N 09.99E' },
  munich: { city: 'Munich', country: 'DE', unlocode: 'DEMUC', latLabel: '48.14N 11.58E' },
  duisburg: { city: 'Duisburg', country: 'DE', unlocode: 'DEDUI', latLabel: '51.43N 06.76E' },
  frankfurt: { city: 'Frankfurt', country: 'DE', unlocode: 'DEFRA', latLabel: '50.11N 08.68E' },
  rotterdam: { city: 'Rotterdam', country: 'NL', unlocode: 'NLRTM', latLabel: '51.92N 04.48E' },
  antwerp: { city: 'Antwerp', country: 'BE', unlocode: 'BEANR', latLabel: '51.22N 04.40E' },
  constanta: { city: 'Constanta', country: 'RO', unlocode: 'ROCND', latLabel: '44.16N 28.63E' },
  bucharest: { city: 'Bucharest', country: 'RO', unlocode: 'ROBUH', latLabel: '44.43N 26.10E' },
  prague: { city: 'Prague', country: 'CZ', unlocode: 'CZPRG', latLabel: '50.08N 14.44E' },
  vienna: { city: 'Vienna', country: 'AT', unlocode: 'ATVIE', latLabel: '48.21N 16.37E' },
  budapest: { city: 'Budapest', country: 'HU', unlocode: 'HUBUD', latLabel: '47.50N 19.04E' },
  bratislava: { city: 'Bratislava', country: 'SK', unlocode: 'SKBTS', latLabel: '48.15N 17.11E' },
  milan: { city: 'Milan', country: 'IT', unlocode: 'ITMIL', latLabel: '45.46N 09.19E' },
  vilnius: { city: 'Vilnius', country: 'LT', unlocode: 'LTVNO', latLabel: '54.69N 25.28E' },
}

const KNOWN_BORDERS = [
  'Korczowa / Krakivets',
  'Korczowa',
  'Krakivets',
  'Yahodyn / Dorohusk',
  'Yahodyn',
  'Dorohusk',
  'Shehyni / Medyka',
  'Shehyni',
  'Medyka',
  'Rava-Ruska / Hrebenne',
  'Chop / Zahony',
  'Porubne / Siret',
  'Constanta Terminal',
  'Giurgiulesti',
]

const EQUIPMENT_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bFTL\b/i, label: 'FTL 20t' },
  { pattern: /\bLTL\b/i, label: 'LTL Groupage' },
  { pattern: /\b(?:reefer|temperature[- ]controlled|gdp|\+2\.\.\+8|cold[- ]chain|-20c)\b/i, label: 'Reefer (GDP)' },
  { pattern: /\b(?:mega|100\s?cbm|3m internal)\b/i, label: 'Mega Trailer' },
  { pattern: /\b(?:tautliner|curtainsider|tilt)\b/i, label: 'Tautliner' },
  { pattern: /\bADR\b/i, label: 'ADR Regulated' },
  { pattern: /\b40['’]?\s?HC\b/i, label: "40'HC Container" },
  { pattern: /\b20['’]?\s?DV\b/i, label: "20'DV Container" },
  { pattern: /\bintermodal\b/i, label: 'Intermodal Rail/Sea' },
  { pattern: /\bflatbed\b/i, label: 'Flatbed' },
]

export const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'cross-border-ftl',
    title: 'UA-PL-DE Road FTL Tariff',
    category: 'Rate Sheet',
    sourceType: 'Dispatcher Email / PDF Tariff',
    rawText: `Carrier: Carpathian Freight Lines LLC (UA-EORI Verified)
Corridor: Lviv -> Warsaw -> Berlin
Border Crossing: Korczowa / Krakivets (eCherha slot active)
Equipment: FTL 20t Tautliner / Mega Trailer (100 cbm), ADR Class 3 available
Customs Regime: T1 Transit / EX-1 export clearance at terminal
Transit Window: 48-60 hours door-to-door
Tariff: EUR 2,450 flat rate (incl. toll & border waiting up to 24h)
Incoterms: DAP Berlin / FCA Lviv`,
  },
  {
    id: 'black-sea-intermodal',
    title: 'Danube & Black Sea Feeder',
    category: 'Intermodal Schedule',
    sourceType: 'Port Terminal Bulletin',
    rawText: `Operator: Danube Container Logistics SRL
Route: Odesa -> Constanta -> Duisburg
Intermodal leg: Barge/Feeder Odesa / Chornomorsk to Constanta Terminal, block train onward to Duisburg
Container specs: 40'HC and 20'DV marine containers, VGM verified
Transit Time: 7-9 days port-to-rail terminal
Rate Indication: EUR 3,180 per 40'HC (THC Constanta included)
Cut-off: Weekly Thursday 16:00 EET`,
  },
  {
    id: 'pharma-reefer',
    title: 'GDP Cold-Chain Corridor',
    category: 'Contract Lane',
    sourceType: 'RFP Carrier Schedule',
    rawText: `Carrier: Silesia Cold Chain Transport Sp. z o.o.
Lane: Krakow -> Prague -> Rotterdam
Equipment: Reefer dual-evaporator +2..+8C GDP calibrated, dual-driver team
Transit SLA: 36 hours guaranteed delivery
Tariff Structure: EUR 2,890 all-in + diesel index BAF
Compliance: TAPA TSR-2 security lock, continuous telematics stream`,
  },
  {
    id: 'carrier-capacity',
    title: 'Carrier Fleet & Corridor Registry',
    category: 'Carrier Profile',
    sourceType: 'Carrier Onboarding Feed',
    rawText: `Company: Halychyna EuroTrans LLC (Lviv, Ukraine)
Primary Lanes: Kyiv -> Lviv -> Warsaw; Lviv -> Munich -> Milan
Border Posts: Shehyni / Medyka, Yahodyn / Dorohusk
Fleet: 34 Euro-6 tractors, 28 Tautliner trailers, 6 Reefer units
Capacity: LTL consolidation twice weekly, FTL daily dispatch
Indicative Rate: 1.42 EUR/km outbound EU corridor
Insurance: CMR EUR 300,000 per occurrence`,
  },
]

export const SAMPLE_CARRIERS: CarrierRecord[] = [
  {
    id: 'CL-CR-104',
    name: 'Carpathian Freight Lines LLC',
    country: 'Ukraine',
    hqCity: 'Lviv',
    primaryModes: ['FTL', 'ADR'],
    activeCorridors: ['UALWO -> PLWAW -> DEBER', 'UAIEV -> PLGDN'],
    fleetUnits: 42,
    cmrLimitEur: 'EUR 300,000',
    borderClearance: 'Korczowa / Yahodyn',
    verificationState: 'Verified',
    updatedDate: '2026-11-10',
  },
  {
    id: 'CL-CR-219',
    name: 'Vistula Intermodal Sp. z o.o.',
    country: 'Poland',
    hqCity: 'Gdansk',
    primaryModes: ['Intermodal', 'Container'],
    activeCorridors: ['PLGDN -> PLWAW -> DEDUI', 'PLKRK -> NLRTM'],
    fleetUnits: 68,
    cmrLimitEur: 'EUR 500,000',
    borderClearance: 'EU Internal / Port Terminal',
    verificationState: 'Active Feed',
    updatedDate: '2026-11-11',
  },
  {
    id: 'CL-CR-308',
    name: 'Danube Container Logistics SRL',
    country: 'Romania',
    hqCity: 'Constanta',
    primaryModes: ['Intermodal', 'Container', 'FTL'],
    activeCorridors: ['UAODS -> ROCND -> DEDUI', 'UAIZM -> ROCND -> HUBUD'],
    fleetUnits: 31,
    cmrLimitEur: 'EUR 400,000',
    borderClearance: 'Constanta Terminal / Izmail',
    verificationState: 'Verified',
    updatedDate: '2026-11-09',
  },
  {
    id: 'CL-CR-412',
    name: 'Silesia Cold Chain Transport',
    country: 'Poland',
    hqCity: 'Krakow',
    primaryModes: ['Reefer', 'FTL'],
    activeCorridors: ['PLKRK -> CZPRG -> NLRTM', 'UALWO -> PLKRK -> ATVIE'],
    fleetUnits: 24,
    cmrLimitEur: 'EUR 600,000',
    borderClearance: 'Korczowa / Medyka',
    verificationState: 'Verified',
    updatedDate: '2026-11-12',
  },
  {
    id: 'CL-CR-505',
    name: 'Rhine-Elbe Rail Forwarding GmbH',
    country: 'Germany',
    hqCity: 'Duisburg',
    primaryModes: ['Intermodal', 'LTL'],
    activeCorridors: ['DEDUI -> DEBER -> PLWAW', 'DEHAM -> CZPRG -> SKBTS'],
    fleetUnits: 85,
    cmrLimitEur: 'EUR 750,000',
    borderClearance: 'EU Customs Hub',
    verificationState: 'Active Feed',
    updatedDate: '2026-11-11',
  },
  {
    id: 'CL-CR-617',
    name: 'Halychyna EuroTrans LLC',
    country: 'Ukraine',
    hqCity: 'Lviv',
    primaryModes: ['FTL', 'LTL', 'Reefer'],
    activeCorridors: ['UAIEV -> UALWO -> PLWAW', 'UALWO -> DEMUC -> ITMIL'],
    fleetUnits: 34,
    cmrLimitEur: 'EUR 300,000',
    borderClearance: 'Shehyni / Rava-Ruska',
    verificationState: 'Verified',
    updatedDate: '2026-11-12',
  },
]

function detectHubsInOrder(text: string): HubDefinition[] {
  const explicitRouteLine =
    text.match(/(?:Primary\s+Lanes?|Corridor|Route|Lane)\s*:\s*([^\n;]+)/i)?.[1] ??
    text.match(/([A-Za-z][A-Za-z\s,()]{1,35}(?:\s*(?:->|→)\s*[A-Za-z][A-Za-z\s,()]{1,35})+)/)?.[1]

  const scanSource = explicitRouteLine ?? text
  const lower = scanSource.toLowerCase()
  const matches: Array<{ index: number; hub: HubDefinition }> = []

  for (const [key, hub] of Object.entries(KNOWN_HUBS)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi')
    const hit = regex.exec(lower)
    if (hit) {
      const alreadyAdded = matches.some((m) => m.hub.unlocode === hub.unlocode)
      if (!alreadyAdded) {
        matches.push({ index: hit.index, hub })
      }
    }
  }

  matches.sort((a, b) => a.index - b.index)
  if (matches.length >= 2 || !explicitRouteLine) {
    return matches.map((m) => m.hub)
  }

  // Fallback to full text if explicit route line used non-dictionary cities
  const fullLower = text.toLowerCase()
  const fullMatches: Array<{ index: number; hub: HubDefinition }> = []
  for (const [key, hub] of Object.entries(KNOWN_HUBS)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi')
    const hit = regex.exec(fullLower)
    if (hit && !fullMatches.some((m) => m.hub.unlocode === hub.unlocode)) {
      fullMatches.push({ index: hit.index, hub })
    }
  }
  fullMatches.sort((a, b) => a.index - b.index)
  return fullMatches.map((m) => m.hub)
}

function fallbackHubFromToken(token: string): HubDefinition {
  const clean = token.trim().replace(/[^a-zA-Z\s-]/g, '').trim()
  const code = clean.slice(0, 3).toUpperCase().padEnd(3, 'X')
  return {
    city: clean || 'Origin Hub',
    country: 'EU',
    unlocode: `EU${code}`,
    latLabel: 'Resolved via geocoder',
  }
}

function estimateSegmentDistance(a: string, b: string): number {
  const pair = `${a}-${b}`
  const known: Record<string, number> = {
    'UALWO-PLWAW': 390,
    'PLWAW-DEBER': 575,
    'UAODS-ROCND': 360,
    'ROCND-DEDUI': 1920,
    'PLKRK-CZPRG': 535,
    'CZPRG-NLRTM': 890,
    'UAIEV-UALWO': 540,
    'UALWO-DEMUC': 1020,
    'DEMUC-ITMIL': 495,
  }
  return known[pair] ?? 520
}

export function parseLogisticsDocument(rawText: string): ParsedDocumentResult {
  const text = rawText.trim()
  const nowIso = '2026-11-12T21:04:18Z'

  // Extract carrier or operator line
  const carrierMatch = text.match(/(?:Carrier|Operator|Company)\s*:\s*([^\n(]+)/i)
  const suffixMatch = text.match(
    /([A-Z][A-Za-z0-9&.\-\s]{2,40}\s(?:LLC|Sp\. z o\.o\.|GmbH|SRL|B\.V\.|Logistics|Transport|Freight|Express|Lines))/
  )
  const carrierDetected = carrierMatch
    ? carrierMatch[1].trim()
    : suffixMatch
      ? suffixMatch[1].trim()
      : 'Unassigned Carrier Entity'

  // Detect hubs from known UN/LOCODE dictionary
  let hubs = detectHubsInOrder(text)
  if (hubs.length < 2) {
    const arrowMatch = text.match(/([A-Za-z][A-Za-z\s]{2,20})\s*(?:->|→|to)\s*([A-Za-z][A-Za-z\s]{2,20})/i)
    if (arrowMatch) {
      hubs = [fallbackHubFromToken(arrowMatch[1]), fallbackHubFromToken(arrowMatch[2])]
    } else if (hubs.length === 1) {
      hubs = [hubs[0], KNOWN_HUBS.warsaw]
    } else {
      hubs = [KNOWN_HUBS.lviv, KNOWN_HUBS.warsaw]
    }
  }

  // Border checkpoints
  const borderNodes: string[] = []
  for (const border of KNOWN_BORDERS) {
    if (text.toLowerCase().includes(border.toLowerCase())) {
      const hasMoreSpecific = borderNodes.some((existing) => existing.includes(border))
      if (!hasMoreSpecific) {
        borderNodes.push(border)
      }
    }
  }

  // Equipment
  const equipmentTags: string[] = []
  for (const item of EQUIPMENT_PATTERNS) {
    if (item.pattern.test(text) && !equipmentTags.includes(item.label)) {
      equipmentTags.push(item.label)
    }
  }
  if (equipmentTags.length === 0) {
    equipmentTags.push('Standard Road FTL')
  }

  // Rate extraction
  const rateMatch = text.match(
    /(?:EUR|USD|PLN|€|\$)\s?[\d,]+(?:\.\d{1,2})?(?:\s*(?:per\s*[\w'/]+|flat rate|all-in|\/km))?|[\d.]+\s?(?:EUR|USD|PLN)\/km/i
  )
  const rateSummary = rateMatch ? rateMatch[0].trim() : 'Quote on request'

  // Transit extraction
  const transitMatch = text.match(/\b\d+(?:-\d+)?\s*(?:hours|hrs|h|days|d)\b/i)
  const transitSummary = transitMatch ? transitMatch[0].trim() : '48-72 hours'

  // Incoterms & Customs
  const incotermMatch = text.match(/\b(DAP|DDP|EXW|FCA|CIF|FOB|CPT)\b/i)
  const incoterms = incotermMatch ? incotermMatch[1].toUpperCase() : 'DAP'
  const customsRegime = /\bT1\b/i.test(text)
    ? 'T1 Transit / EX-1'
    : /\bVGM\b|port/i.test(text)
      ? 'Maritime Manifest / T1'
      : 'Standard EU/UA Clearance'

  const origin = hubs[0]
  const destination = hubs[hubs.length - 1]
  const intermediateHubs = hubs.slice(1, -1)

  const segments: NormalizedSegment[] = []
  for (let i = 0; i < hubs.length - 1; i++) {
    const segOrigin = hubs[i]
    const segDest = hubs[i + 1]
    const isCrossUaBorder =
      (segOrigin.country === 'UA' && segDest.country !== 'UA') ||
      (segOrigin.country !== 'UA' && segDest.country === 'UA')

    segments.push({
      originCity: segOrigin.city,
      originCode: segOrigin.unlocode,
      destinationCity: segDest.city,
      destinationCode: segDest.unlocode,
      borderCheckpoints: isCrossUaBorder ? borderNodes : [],
      estimatedDistanceKm: estimateSegmentDistance(segOrigin.unlocode, segDest.unlocode),
      transitWindow: i === 0 && hubs.length > 2 ? '18-24h' : transitSummary,
      mode: equipmentTags.some((e) => e.includes('Intermodal') || e.includes('Container'))
        ? 'Intermodal'
        : 'Road Freight',
    })
  }

  const corridorCode = hubs.map((h) => h.unlocode).join('-')
  const validations: ValidationCheck[] = [
    {
      field: 'unlocode_map',
      status: hubs.every((h) => !h.unlocode.startsWith('EU')) ? 'passed' : 'warning',
      detail: `${hubs.length} hub identifiers mapped to ISO/UNLOCODE`,
    },
    {
      field: 'carrier_id',
      status: carrierDetected !== 'Unassigned Carrier Entity' ? 'passed' : 'warning',
      detail: carrierDetected,
    },
    {
      field: 'equipment',
      status: 'passed',
      detail: `${equipmentTags.length} equipment classification(s) normalized`,
    },
    {
      field: 'rate_parse',
      status: rateMatch ? 'passed' : 'warning',
      detail: rateSummary,
    },
  ]

  const passedCount = validations.filter((v) => v.status === 'passed').length
  const confidence = Number((0.78 + passedCount * 0.05).toFixed(2))

  const lane: ParsedLane = {
    laneId: `LN-${corridorCode.slice(0, 11)}`,
    carrierName: carrierDetected,
    corridorCode,
    origin,
    destination,
    intermediateHubs,
    borderCrossings: borderNodes,
    equipment: equipmentTags,
    transitWindow: transitSummary,
    indicativeRate: rateSummary,
    incoterms,
    customsRegime,
    confidenceScore: confidence,
  }

  return {
    documentId: `doc_${corridorCode.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}`,
    processedAt: nowIso,
    extractionEngine: 'coreline-bedrock-norm-v1.4',
    carrierDetected,
    lanes: [lane],
    segments,
    equipmentTags,
    borderNodes,
    rateSummary,
    transitSummary,
    confidence,
    validations,
  }
}
