import { useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  FileSpreadsheet,
  GitBranch,
  Play,
  RotateCcw,
  Search,
  Table2,
} from 'lucide-react'
import {
  ROUTE_PRESETS,
  SAMPLE_CARRIERS,
  parseLogisticsDocument,
  type EquipmentType,
  type ParsedDocumentResult,
} from '../data/logisticsData'

type WorkbenchMode = 'parser' | 'registry'
type OutputTab = 'table' | 'topology' | 'json'

const EQUIPMENT_FILTERS: ReadonlyArray<'All' | EquipmentType> = [
  'All',
  'FTL',
  'LTL',
  'Reefer',
  'Intermodal',
  'ADR',
  'Container',
]

export function Workbench() {
  const [mode, setMode] = useState<WorkbenchMode>('parser')
  const [selectedPresetId, setSelectedPresetId] = useState<string>(ROUTE_PRESETS[0].id)
  const [rawInput, setRawInput] = useState<string>(ROUTE_PRESETS[0].rawText)
  const [result, setResult] = useState<ParsedDocumentResult>(() =>
    parseLogisticsDocument(ROUTE_PRESETS[0].rawText)
  )
  const [outputTab, setOutputTab] = useState<OutputTab>('table')
  const [copied, setCopied] = useState(false)

  const [carrierQuery, setCarrierQuery] = useState('')
  const [equipmentFilter, setEquipmentFilter] = useState<'All' | EquipmentType>('All')

  const activePreset =
    ROUTE_PRESETS.find((preset) => preset.id === selectedPresetId) ?? ROUTE_PRESETS[0]

  const handleSelectPreset = (presetId: string) => {
    const preset = ROUTE_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setSelectedPresetId(preset.id)
    setRawInput(preset.rawText)
    setResult(parseLogisticsDocument(preset.rawText))
  }

  const handleRunParse = () => {
    setResult(parseLogisticsDocument(rawInput))
  }

  const handleReset = () => {
    setRawInput(activePreset.rawText)
    setResult(parseLogisticsDocument(activePreset.rawText))
  }

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const filteredCarriers = SAMPLE_CARRIERS.filter((carrier) => {
    const matchesEquip =
      equipmentFilter === 'All' || carrier.primaryModes.includes(equipmentFilter)
    const q = carrierQuery.trim().toLowerCase()
    const matchesText =
      q === '' ||
      carrier.name.toLowerCase().includes(q) ||
      carrier.hqCity.toLowerCase().includes(q) ||
      carrier.country.toLowerCase().includes(q) ||
      carrier.borderClearance.toLowerCase().includes(q) ||
      carrier.activeCorridors.some((c) => c.toLowerCase().includes(q))
    return matchesEquip && matchesText
  })

  const primaryLane = result.lanes[0]

  return (
    <div className="workbench-shell">
      <div className="workbench-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-accent">Interactive Sandbox</span>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>
            CorelineLogic Extraction &amp; Carrier Registry
          </span>
        </div>

        <div className="tab-group" role="tablist" aria-label="Workbench mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'parser'}
            className={`tab-btn ${mode === 'parser' ? 'active' : ''}`}
            onClick={() => setMode('parser')}
          >
            <FileSpreadsheet size={13} />
            Route &amp; Tariff Parser
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'registry'}
            className={`tab-btn ${mode === 'registry' ? 'active' : ''}`}
            onClick={() => setMode('registry')}
          >
            <Database size={13} />
            Carrier Directory
          </button>
        </div>
      </div>

      {mode === 'parser' ? (
        <div className="workbench-split">
          <div className="workbench-input-pane">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span className="kv-label" style={{ margin: 0 }}>
                1. Select Sample Freight Document or Edit Raw Input
              </span>
              <span className="mono" style={{ fontSize: 11.5, color: '#64748b' }}>
                {activePreset.sourceType}
              </span>
            </div>

            <div className="preset-list">
              {ROUTE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`preset-btn ${selectedPresetId === preset.id ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(preset.id)}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            <textarea
              id="workbench-raw-input"
              name="rawInput"
              className="workbench-textarea"
              aria-label="Unstructured carrier or route text input"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleRunParse}>
                  <Play size={13} />
                  Parse &amp; Normalize
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
                  <RotateCcw size={13} />
                  Reset Preset
                </button>
              </div>
              <span className="mono" style={{ fontSize: 11.5, color: '#64748b' }}>
                Deterministic client-side evaluation
              </span>
            </div>

            <div className="pipeline-steps" aria-label="Pipeline stage checks">
              {result.validations.map((item) => (
                <div key={item.field} className="pipeline-step">
                  <div className="pipeline-step-label">
                    {item.status === 'passed' ? (
                      <CheckCircle2 size={12} color="#0f766e" />
                    ) : (
                      <AlertTriangle size={12} color="#b45309" />
                    )}
                    <span>{item.field.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="pipeline-step-status">
                    {item.status === 'passed' ? 'Validated' : 'Inferred'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="workbench-output-pane">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-ok">
                  <CheckCircle2 size={12} />
                  Confidence {result.confidence.toFixed(2)}
                </span>
                <span className="mono" style={{ fontSize: 12, color: '#475569' }}>
                  {primaryLane.corridorCode}
                </span>
              </div>

              <div className="tab-group" role="tablist" aria-label="Output format">
                <button
                  type="button"
                  role="tab"
                  aria-selected={outputTab === 'table'}
                  className={`tab-btn ${outputTab === 'table' ? 'active' : ''}`}
                  onClick={() => setOutputTab('table')}
                >
                  <Table2 size={12} />
                  Normalized
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={outputTab === 'topology'}
                  className={`tab-btn ${outputTab === 'topology' ? 'active' : ''}`}
                  onClick={() => setOutputTab('topology')}
                >
                  <GitBranch size={12} />
                  Corridor Graph
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={outputTab === 'json'}
                  className={`tab-btn ${outputTab === 'json' ? 'active' : ''}`}
                  onClick={() => setOutputTab('json')}
                >
                  <Code2 size={12} />
                  JSON
                </button>
              </div>
            </div>

            {outputTab === 'table' && (
              <>
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Extracted &amp; Normalized Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="mono">carrier_entity</td>
                        <td>
                          <strong>{result.carrierDetected}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="mono">origin_hub</td>
                        <td>
                          {primaryLane.origin.city}, {primaryLane.origin.country}{' '}
                          <span className="badge mono" style={{ marginLeft: 6 }}>
                            {primaryLane.origin.unlocode}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="mono">destination_hub</td>
                        <td>
                          {primaryLane.destination.city}, {primaryLane.destination.country}{' '}
                          <span className="badge mono" style={{ marginLeft: 6 }}>
                            {primaryLane.destination.unlocode}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="mono">border_nodes</td>
                        <td>
                          {result.borderNodes.length > 0
                            ? result.borderNodes.join(' · ')
                            : 'EU Internal / No external customs checkpoint specified'}
                        </td>
                      </tr>
                      <tr>
                        <td className="mono">equipment_specs</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {result.equipmentTags.map((tag) => (
                              <span key={tag} className="badge">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="mono">transit_window</td>
                        <td>
                          <strong>{result.transitSummary}</strong> · Customs: {primaryLane.customsRegime}
                        </td>
                      </tr>
                      <tr>
                        <td className="mono">tariff_indication</td>
                        <td>
                          <strong>{result.rateSummary}</strong> · Incoterms: {primaryLane.incoterms}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Leg</th>
                        <th>UN/LOCODE</th>
                        <th>Est. Distance</th>
                        <th>Mode</th>
                        <th>Border Control</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.segments.map((seg, idx) => (
                        <tr key={`${seg.originCode}-${seg.destinationCode}-${idx}`}>
                          <td>
                            <strong>
                              {seg.originCity} -&gt; {seg.destinationCity}
                            </strong>
                          </td>
                          <td className="mono">
                            {seg.originCode} -&gt; {seg.destinationCode}
                          </td>
                          <td className="mono">{seg.estimatedDistanceKm} km</td>
                          <td>{seg.mode}</td>
                          <td>
                            {seg.borderCheckpoints.length > 0
                              ? seg.borderCheckpoints.join(', ')
                              : 'Schengen / Domestic'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {outputTab === 'topology' && (
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  background: '#ffffff',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>
                    Normalized Corridor Topology ({primaryLane.corridorCode})
                  </span>
                  <span className="mono" style={{ fontSize: 12, color: '#64748b' }}>
                    {result.segments.reduce((acc, s) => acc + s.estimatedDistanceKm, 0)} km total est.
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                  }}
                >
                  {[primaryLane.origin, ...primaryLane.intermediateHubs, primaryLane.destination].map(
                    (hub, index, list) => {
                      const segment = result.segments[index]
                      const roleLabel =
                        index === 0
                          ? 'ORIGIN HUB'
                          : index === list.length - 1
                            ? 'DESTINATION'
                            : 'TRANSIT HUB'

                      return (
                        <div key={`${hub.unlocode}-${index}`}>
                          <div
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: 6,
                              padding: '12px 16px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 10,
                            }}
                          >
                            <div>
                              <div className="mono" style={{ fontSize: 11, color: '#1e3a5f', fontWeight: 600 }}>
                                {roleLabel}
                              </div>
                              <div style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
                                {hub.city}, {hub.country}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span className="badge mono">{hub.unlocode}</span>
                              <div className="mono" style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
                                {hub.latLabel}
                              </div>
                            </div>
                          </div>

                          {index < list.length - 1 && segment && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '6px 14px',
                                marginLeft: 18,
                                borderLeft: '2px solid #cbd5e1',
                              }}
                            >
                              <ArrowDown size={14} color="#1e3a5f" />
                              <span className="mono" style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>
                                {segment.estimatedDistanceKm} km · {segment.mode}
                              </span>
                              {segment.borderCheckpoints.length > 0 && (
                                <span className="badge badge-warn">
                                  Border: {segment.borderCheckpoints.join(', ')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }
                  )}
                </div>

                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.55 }}>
                  <strong>Customs &amp; Border Resolution:</strong>{' '}
                  {result.borderNodes.length > 0
                    ? `Detected external border crossing(s): ${result.borderNodes.join(', ')}. Transit regime mapped as ${primaryLane.customsRegime}.`
                    : `No external EU customs checkpoint detected in document. Mapped as ${primaryLane.customsRegime}.`}
                </div>
              </div>
            )}

            {outputTab === 'json' && (
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopyJson}>
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied JSON' : 'Copy Payload'}
                  </button>
                </div>
                <pre className="code-block" style={{ maxHeight: 390, borderRadius: 6 }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
              <Search
                size={15}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
              />
              <input
                id="carrier-directory-search"
                name="carrierSearch"
                type="search"
                className="field-input"
                style={{ paddingLeft: 36 }}
                placeholder="Filter by carrier, city, UN/LOCODE, or border..."
                value={carrierQuery}
                onChange={(e) => setCarrierQuery(e.target.value)}
                aria-label="Filter carrier directory"
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {EQUIPMENT_FILTERS.map((equip) => (
                <button
                  key={equip}
                  type="button"
                  className={`preset-btn ${equipmentFilter === equip ? 'active' : ''}`}
                  onClick={() => setEquipmentFilter(equip)}
                >
                  {equip}
                </button>
              ))}
            </div>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Carrier ID</th>
                  <th>Company</th>
                  <th>Equipment</th>
                  <th>Normalized Corridors</th>
                  <th>Border / Customs</th>
                  <th>Fleet / CMR</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarriers.length > 0 ? (
                  filteredCarriers.map((carrier) => (
                    <tr key={carrier.id}>
                      <td className="mono">{carrier.id}</td>
                      <td>
                        <strong>{carrier.name}</strong>
                        <div style={{ fontSize: 12.5, color: '#64748b' }}>
                          {carrier.hqCity}, {carrier.country}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {carrier.primaryModes.map((m) => (
                            <span key={m} className="badge">
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>
                        {carrier.activeCorridors.map((c) => (
                          <div key={c}>{c}</div>
                        ))}
                      </td>
                      <td>{carrier.borderClearance}</td>
                      <td>
                        <div>{carrier.fleetUnits} units</div>
                        <div className="mono" style={{ fontSize: 12, color: '#64748b' }}>
                          {carrier.cmrLimitEur}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            carrier.verificationState === 'Verified' ? 'badge-ok' : 'badge-accent'
                          }`}
                        >
                          {carrier.verificationState}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 28, color: '#64748b' }}>
                      No sample carrier records match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12.5, color: '#64748b' }}>
            <span>Sample evaluation dataset representing normalized European &amp; Ukrainian corridor profiles.</span>
            <span className="mono">Showing {filteredCarriers.length} of {SAMPLE_CARRIERS.length} records</span>
          </div>
        </div>
      )}
    </div>
  )
}
