// Clinical Charts — SOAP notes, injection maps, treatment documentation
import { useState, useEffect, useRef, useCallback } from 'react';
import { useStyles } from '../theme';
import { getPatients, getServices, getProviders, subscribe } from '../data/store';

const CHARTS_KEY = 'ms_charts';
function getCharts() { try { return JSON.parse(localStorage.getItem(CHARTS_KEY)) || []; } catch { return []; } }
function saveCharts(c) { localStorage.setItem(CHARTS_KEY, JSON.stringify(c)); }

const INJECTION_ZONES = [
  { id: 'forehead', label: 'Forehead', x: 50, y: 15 },
  { id: 'glabella', label: 'Glabella (11s)', x: 50, y: 22 },
  { id: 'crow-l', label: 'Crows Feet L', x: 28, y: 28 },
  { id: 'crow-r', label: 'Crows Feet R', x: 72, y: 28 },
  { id: 'brow-l', label: 'Brow L', x: 34, y: 25 },
  { id: 'brow-r', label: 'Brow R', x: 66, y: 25 },
  { id: 'temple-l', label: 'Temple L', x: 22, y: 22 },
  { id: 'temple-r', label: 'Temple R', x: 78, y: 22 },
  { id: 'cheek-l', label: 'Cheek L', x: 32, y: 45 },
  { id: 'cheek-r', label: 'Cheek R', x: 68, y: 45 },
  { id: 'naso-l', label: 'Nasolabial L', x: 38, y: 52 },
  { id: 'naso-r', label: 'Nasolabial R', x: 62, y: 52 },
  { id: 'lips-upper', label: 'Upper Lip', x: 50, y: 58 },
  { id: 'lips-lower', label: 'Lower Lip', x: 50, y: 63 },
  { id: 'marionette-l', label: 'Marionette L', x: 40, y: 68 },
  { id: 'marionette-r', label: 'Marionette R', x: 60, y: 68 },
  { id: 'chin', label: 'Chin', x: 50, y: 73 },
  { id: 'jawline-l', label: 'Jawline L', x: 28, y: 62 },
  { id: 'jawline-r', label: 'Jawline R', x: 72, y: 62 },
  { id: 'neck', label: 'Neck', x: 50, y: 85 },
];

function initCharts() {
  if (localStorage.getItem('ms_charts_init')) return;
  saveCharts([
    {
      id: 'CHT-1', patientId: 'PAT-1000', patientName: 'Emma Johnson', providerId: 'PRV-1',
      date: '2026-03-10', serviceId: 'SVC-1', serviceName: 'Botox',
      subjective: 'Patient presents for routine Botox. Concerned about forehead lines deepening. No new medications. Denies allergies.',
      objective: 'Moderate dynamic rhytids across forehead. Moderate glabellar lines. Mild crows feet bilateral.',
      assessment: 'Candidate for neuromodulator treatment. Forehead, glabella, and lateral canthal lines.',
      plan: '28 units Botox: 10 units forehead (5 injection sites), 12 units glabella (3 sites), 6 units crows feet (3 sites bilateral). Follow up 2 weeks. Consider filler for nasolabial folds at next visit.',
      injectionMap: { forehead: '10u', glabella: '12u', 'crow-l': '3u', 'crow-r': '3u' },
      vitals: { bp: '118/76', pulse: '72', temp: '98.6' },
      medications: 'None',
      status: 'signed',
      createdAt: '2026-03-10T10:30:00Z',
    },
    {
      id: 'CHT-2', patientId: 'PAT-1003', patientName: 'Ava Jones', providerId: 'PRV-2',
      date: '2026-03-12', serviceId: 'SVC-6', serviceName: 'IPL Photofacial',
      subjective: 'Follow-up IPL session 3 of 3. Reports improvement in sun spots after sessions 1 and 2. No adverse reactions.',
      objective: 'Moderate improvement in pigmentation. Remaining focal hyperpigmentation left cheekbone. Skin texture improved.',
      assessment: 'Good response to IPL series. Final session of planned protocol.',
      plan: 'IPL treatment left cheek and bilateral nose. Settings: 560nm, 15J/cm2, double pass on areas of concern. SPF 50 daily. Follow up 4 weeks for assessment.',
      injectionMap: {},
      vitals: { bp: '122/78', pulse: '68', temp: '98.4' },
      medications: 'Tretinoin 0.025% (paused 1 week pre-treatment)',
      status: 'signed',
      createdAt: '2026-03-12T14:00:00Z',
    },
    {
      id: 'CHT-3', patientId: 'PAT-1002', patientName: 'Sophia Brown', providerId: 'PRV-3',
      date: '2026-03-15', serviceId: 'SVC-5', serviceName: 'RF Microneedling',
      subjective: 'Session 2 of RF microneedling series for acne scarring. Tolerated first session well. Reports smoother texture.',
      objective: 'Healing well from session 1. Ice pick and boxcar scars bilateral cheeks. Skin hydrated.',
      assessment: 'Continue RF microneedling protocol. Good candidate for continued treatment.',
      plan: 'Morpheus8 full face, depth 2.5mm cheeks, 1.5mm forehead. Apply numbing cream 45 min prior. Post-care: gentle cleanser, hyaluronic acid serum, SPF. Avoid retinoids 5 days.',
      injectionMap: {},
      vitals: { bp: '110/70', pulse: '74', temp: '98.6' },
      medications: 'None',
      status: 'draft',
      createdAt: '2026-03-15T09:00:00Z',
    },
  ]);
  localStorage.setItem('ms_charts_init', 'true');
}

export default function Charts() {
  const s = useStyles();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);
  useEffect(() => { initCharts(); setTick(t => t + 1); }, []);

  const [charts, setCharts] = useState(getCharts);
  const [activeId, setActiveId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingZone, setEditingZone] = useState(null);
  const [zoneValue, setZoneValue] = useState('');
  const [form, setForm] = useState({
    patientId: '', serviceId: '', providerId: '',
    subjective: '', objective: '', assessment: '', plan: '',
    injectionMap: {}, vitals: { bp: '', pulse: '', temp: '' },
    medications: '', status: 'draft',
  });

  const patients = getPatients();
  const services = getServices();
  const providers = getProviders();

  const refresh = () => { setCharts(getCharts()); };
  const active = charts.find(c => c.id === activeId);

  const filtered = charts.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.patientName?.toLowerCase().includes(q) && !c.serviceName?.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const openNew = () => {
    setActiveId(null);
    setForm({ patientId: '', serviceId: '', providerId: '', subjective: '', objective: '', assessment: '', plan: '', injectionMap: {}, vitals: { bp: '', pulse: '', temp: '' }, medications: '', status: 'draft' });
    setShowNew(true);
  };

  const openChart = (chart) => {
    setActiveId(chart.id);
    setForm({
      patientId: chart.patientId, serviceId: chart.serviceId, providerId: chart.providerId,
      subjective: chart.subjective, objective: chart.objective, assessment: chart.assessment, plan: chart.plan,
      injectionMap: chart.injectionMap || {}, vitals: chart.vitals || { bp: '', pulse: '', temp: '' },
      medications: chart.medications || '', status: chart.status,
    });
    setShowNew(true);
  };

  const handleSave = (sign = false) => {
    const pat = patients.find(p => p.id === form.patientId);
    const svc = services.find(sv => sv.id === form.serviceId);
    const data = {
      ...form,
      patientName: pat ? `${pat.firstName} ${pat.lastName}` : 'Unknown',
      serviceName: svc?.name || 'Service',
      date: new Date().toISOString().slice(0, 10),
      status: sign ? 'signed' : 'draft',
    };

    const all = getCharts();
    if (activeId) {
      const idx = all.findIndex(c => c.id === activeId);
      if (idx >= 0) all[idx] = { ...all[idx], ...data };
    } else {
      data.id = `CHT-${Date.now()}`;
      data.createdAt = new Date().toISOString();
      all.unshift(data);
    }
    saveCharts(all);
    refresh();
    setShowNew(false);
  };

  const addInjectionPoint = (zoneId) => {
    setEditingZone(zoneId);
    setZoneValue(form.injectionMap[zoneId] || '');
  };

  const saveZone = () => {
    if (editingZone) {
      const map = { ...form.injectionMap };
      if (zoneValue.trim()) map[editingZone] = zoneValue.trim();
      else delete map[editingZone];
      setForm({ ...form, injectionMap: map });
    }
    setEditingZone(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ font: `600 26px ${s.FONT}`, color: s.text, marginBottom: 4 }}>Clinical Charts</h1>
          <p style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>SOAP notes, injection mapping, and treatment documentation</p>
        </div>
        <button onClick={openNew} style={s.pillAccent}>+ New Chart</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or service..." style={{ ...s.input, maxWidth: 260 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'All'], ['draft', 'Drafts'], ['signed', 'Signed']].map(([id, label]) => (
            <button key={id} onClick={() => setStatusFilter(id)} style={{
              ...s.pill, padding: '7px 14px', fontSize: 12,
              background: statusFilter === id ? s.accent : 'transparent',
              color: statusFilter === id ? s.accentText : s.text2,
              border: statusFilter === id ? `1px solid ${s.accent}` : '1px solid #E5E5E5',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Charts List */}
      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map(chart => {
          const prov = providers.find(p => p.id === chart.providerId);
          const injectionCount = Object.keys(chart.injectionMap || {}).length;
          return (
            <div key={chart.id} onClick={() => openChart(chart)} style={{
              ...s.cardStyle, padding: '18px 22px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = s.shadowMd}
            onMouseLeave={e => e.currentTarget.style.boxShadow = s.shadow}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: chart.status === 'signed' ? '#F0FDF4' : '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 12px ${s.FONT}`, color: chart.status === 'signed' ? s.success : s.warning }}>
                  {chart.patientName?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{chart.patientName} — {chart.serviceName}</div>
                  <div style={{ font: `400 12px ${s.FONT}`, color: s.text2 }}>{prov?.name?.split(',')[0] || 'Provider'} · {chart.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {injectionCount > 0 && <span style={{ padding: '3px 8px', borderRadius: 100, background: '#F5F5F5', font: `400 10px ${s.MONO}`, color: s.text2 }}>{injectionCount} injection sites</span>}
                <span style={{
                  padding: '3px 10px', borderRadius: 100, font: `500 10px ${s.FONT}`, textTransform: 'uppercase',
                  background: chart.status === 'signed' ? '#F0FDF4' : '#FFF7ED',
                  color: chart.status === 'signed' ? s.success : s.warning,
                }}>{chart.status}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ ...s.cardStyle, padding: 48, textAlign: 'center', font: `400 14px ${s.FONT}`, color: s.text3 }}>No charts found</div>
        )}
      </div>

      {/* Chart Editor Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowNew(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 900, width: '95%', boxShadow: s.shadowLg, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ font: `600 22px ${s.FONT}`, color: s.text, marginBottom: 20 }}>{activeId ? 'Edit Chart' : 'New Clinical Chart'}</h2>

            {/* Patient / Service / Provider */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={s.label}>Patient</label>
                <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Service</label>
                <select value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  {services.map(sv => <option key={sv.id} value={sv.id}>{sv.name}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Provider</label>
                <select value={form.providerId} onChange={e => setForm({ ...form, providerId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Vitals */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              {[['bp', 'Blood Pressure'], ['pulse', 'Pulse'], ['temp', 'Temp (°F)']].map(([key, label]) => (
                <div key={key} style={{ flex: 1 }}>
                  <label style={s.label}>{label}</label>
                  <input value={form.vitals[key] || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, [key]: e.target.value } })} style={s.input} placeholder={key === 'bp' ? '120/80' : key === 'pulse' ? '72' : '98.6'} />
                </div>
              ))}
              <div style={{ flex: 2 }}>
                <label style={s.label}>Current Medications</label>
                <input value={form.medications} onChange={e => setForm({ ...form, medications: e.target.value })} style={s.input} placeholder="List medications" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
              {/* SOAP Notes */}
              <div>
                {[
                  { key: 'subjective', label: 'S — Subjective', placeholder: 'Chief complaint, patient history, symptoms, concerns...' },
                  { key: 'objective', label: 'O — Objective', placeholder: 'Physical findings, observations, measurements...' },
                  { key: 'assessment', label: 'A — Assessment', placeholder: 'Clinical assessment, diagnosis, treatment candidacy...' },
                  { key: 'plan', label: 'P — Plan', placeholder: 'Treatment performed, products/units used, post-care instructions, follow-up...' },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: 14 }}>
                    <label style={{ ...s.label, color: s.accent }}>{field.label}</label>
                    <textarea value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} rows={3} style={{ ...s.input, resize: 'vertical', lineHeight: 1.6 }} placeholder={field.placeholder} />
                  </div>
                ))}
              </div>

              {/* Face Map */}
              <div>
                <label style={{ ...s.label, marginBottom: 12 }}>Injection Map</label>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '0.75', background: '#FAFAFA', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
                  {/* Face outline */}
                  <svg viewBox="0 0 200 260" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <ellipse cx="100" cy="110" rx="72" ry="90" fill="none" stroke="#DDD" strokeWidth="1.5" />
                    <ellipse cx="70" cy="85" rx="10" ry="6" fill="none" stroke="#DDD" strokeWidth="1" />
                    <ellipse cx="130" cy="85" rx="10" ry="6" fill="none" stroke="#DDD" strokeWidth="1" />
                    <path d="M90 120 Q100 130 110 120" fill="none" stroke="#DDD" strokeWidth="1" />
                    <path d="M85 150 Q100 165 115 150" fill="none" stroke="#DDD" strokeWidth="1" />
                    <line x1="100" y1="200" x2="100" y2="240" stroke="#DDD" strokeWidth="1" />
                  </svg>

                  {/* Injection points */}
                  {INJECTION_ZONES.map(zone => {
                    const hasValue = form.injectionMap[zone.id];
                    return (
                      <div key={zone.id} onClick={() => addInjectionPoint(zone.id)} style={{
                        position: 'absolute', left: `${zone.x}%`, top: `${zone.y}%`,
                        transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10,
                      }}>
                        <div style={{
                          width: hasValue ? 24 : 14, height: hasValue ? 24 : 14, borderRadius: '50%',
                          background: hasValue ? s.accent : 'rgba(0,0,0,0.08)',
                          border: hasValue ? 'none' : '1.5px dashed #CCC',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          font: `600 8px ${s.MONO}`, color: s.accentText,
                          transition: 'all 0.15s',
                        }}>
                          {hasValue && form.injectionMap[zone.id]}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ font: `400 10px ${s.FONT}`, color: s.text3, marginTop: 6, textAlign: 'center' }}>Click points to add injection details</div>

                {/* Active zones list */}
                {Object.keys(form.injectionMap).length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    {Object.entries(form.injectionMap).map(([zoneId, val]) => {
                      const zone = INJECTION_ZONES.find(z => z.id === zoneId);
                      return (
                        <div key={zoneId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', font: `400 11px ${s.FONT}`, color: s.text2 }}>
                          <span>{zone?.label}</span>
                          <span style={{ font: `500 11px ${s.MONO}`, color: s.accent }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNew(false)} style={s.pillGhost}>Cancel</button>
              <button onClick={() => handleSave(false)} style={s.pillOutline}>Save Draft</button>
              <button onClick={() => handleSave(true)} style={s.pillAccent}>Sign & Lock</button>
            </div>
          </div>
        </div>
      )}

      {/* Zone Edit Popover */}
      {editingZone && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }} onClick={() => setEditingZone(null)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 280, boxShadow: s.shadowLg }} onClick={e => e.stopPropagation()}>
            <div style={{ font: `600 14px ${s.FONT}`, color: s.text, marginBottom: 12 }}>{INJECTION_ZONES.find(z => z.id === editingZone)?.label}</div>
            <input value={zoneValue} onChange={e => setZoneValue(e.target.value)} style={s.input} placeholder="e.g., 10u Botox" autoFocus onKeyDown={e => e.key === 'Enter' && saveZone()} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => { setZoneValue(''); saveZone(); }} style={{ ...s.pillGhost, padding: '6px 12px', fontSize: 11, color: s.danger }}>Clear</button>
              <button onClick={saveZone} style={{ ...s.pillAccent, padding: '6px 16px', fontSize: 12 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
